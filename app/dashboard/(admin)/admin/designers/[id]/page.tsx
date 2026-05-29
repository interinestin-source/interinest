"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { db, storage } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Link from "next/link";

export default function DesignerDetailPage() {
  const params = useParams();
  const designerId = params?.id as string;

  const [designer, setDesigner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDesigner = async () => {
      if (!designerId) return;
      setLoading(true);
      setError(null);
      try {
        const snapshot = await getDoc(doc(db, "interinestUsers", designerId));
        if (snapshot.exists()) {
          setDesigner({ id: snapshot.id, ...(snapshot.data() as any) });
        } else {
          setError("Designer not found.");
        }
      } catch (err) {
        console.error("Failed to load designer details", err);
        setError("Unable to load designer details.");
      } finally {
        setLoading(false);
      }
    };
    void fetchDesigner();
  }, [designerId]);

  const handleApprove = async () => {
    if (!designerId) return;
    setUpdating(true);
    setSuccessMessage("");
    try {
      await updateDoc(doc(db, "interinestUsers", designerId), { status: "approved", updatedAt: new Date() });
      setDesigner((prev: any) => prev ? { ...prev, status: "approved" } : null);
      setSuccessMessage("Designer approved successfully!");
    } catch {
      setError("Failed to approve designer.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeny = async () => {
    if (!designerId) return;
    setUpdating(true);
    setSuccessMessage("");
    try {
      await updateDoc(doc(db, "interinestUsers", designerId), { status: "rejected", updatedAt: new Date() });
      setDesigner((prev: any) => prev ? { ...prev, status: "rejected" } : null);
      setSuccessMessage("Designer rejected.");
    } catch {
      setError("Failed to reject designer.");
    } finally {
      setUpdating(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !designerId) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, PNG, or WebP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccessMessage("");

    const storageRef = ref(storage, `designers/${designerId}/profile`);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => {
        console.error("Upload failed", err);
        setError("Photo upload failed. Please try again.");
        setUploading(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          await updateDoc(doc(db, "interinestUsers", designerId), { photoURL: url, updatedAt: new Date() });
          setDesigner((prev: any) => prev ? { ...prev, photoURL: url } : null);
          setSuccessMessage("Profile photo updated!");
        } catch {
          setError("Failed to save photo URL.");
        } finally {
          setUploading(false);
          setUploadProgress(0);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }
    );
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return "N/A";
    return new Date(timestamp.seconds * 1000).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const statusConfig: Record<string, { label: string; classes: string }> = {
    approved: { label: "Approved", classes: "bg-green-100 text-green-800 border border-green-200" },
    rejected: { label: "Rejected", classes: "bg-red-100 text-red-800 border border-red-200" },
    pending:  { label: "Pending",  classes: "bg-amber-100 text-amber-800 border border-amber-200" },
  };
  const statusInfo = statusConfig[designer?.status] ?? { label: "Pending", classes: "bg-amber-100 text-amber-800 border border-amber-200" };

  const SKIP_KEYS = new Set(["id", "fullName", "email", "phone", "city", "state", "createdAt", "updatedAt", "status", "designerType", "imageUrls", "role", "photoURL"]);
  const extraFields = designer
    ? Object.entries(designer).filter(([k, v]) => !SKIP_KEYS.has(k) && v !== null && v !== undefined && v !== "")
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#7593b4] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !designer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <Link href="/dashboard/admin/designers" className="inline-block px-5 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-100 transition">
            Back to Designers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard/admin" className="hover:text-slate-800 transition">Admin</Link>
        <span>/</span>
        <Link href="/dashboard/admin/designers" className="hover:text-slate-800 transition">Designers</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate max-w-xs">{designer?.fullName || "Profile"}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Toasts */}
        {successMessage && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-green-800 text-sm font-medium">
            <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">&#10003;</span>
            {successMessage}
          </div>
        )}
        {error && designer && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Profile header card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-[#7593b4] to-[#a3bcd4]" />

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 mb-4">
              <div className="flex items-end gap-4">
                {/* Clickable avatar */}
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    disabled={uploading}
                    className="group w-24 h-24 rounded-2xl border-4 border-white shadow-md overflow-hidden block focus:outline-none focus:ring-2 focus:ring-[#7593b4]"
                    title="Click to upload profile photo"
                  >
                    {designer?.photoURL ? (
                      <img
                        src={designer.photoURL}
                        alt={designer.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#7593b4]"
                        style={{ background: "linear-gradient(135deg, #e8f0f7 0%, #cddbe9 100%)" }}
                      >
                        {designer?.fullName?.charAt(0).toUpperCase() || "D"}
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center rounded-2xl">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center">
                        <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-white text-[10px] mt-0.5 block">Upload</span>
                      </div>
                    </div>
                  </button>

                  {/* Upload progress ring */}
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
                      <div className="text-center">
                        <div className="w-8 h-8 border-4 border-[#7593b4] border-t-transparent rounded-full animate-spin mx-auto" />
                        <span className="text-[10px] text-[#7593b4] font-semibold mt-1 block">{uploadProgress}%</span>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />

                <div className="mb-1">
                  <h1 className="text-xl font-bold text-slate-900">{designer?.fullName || "Designer"}</h1>
                  <p className="text-slate-500 text-sm">{designer?.designerType || "Interior Designer"}</p>
                  <button
                    type="button"
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    disabled={uploading}
                    className="mt-1 text-xs text-[#7593b4] hover:underline disabled:opacity-50"
                  >
                    {uploading ? `Uploading... ${uploadProgress}%` : "Change photo"}
                  </button>
                </div>
              </div>

              <div className="sm:mb-1">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${statusInfo.classes}`}>
                  {statusInfo.label}
                </span>
              </div>
            </div>

            {/* Contact row */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 border-t border-slate-100 pt-4">
              {designer?.email && (
                <a href={`mailto:${designer.email}`} className="flex items-center gap-1.5 hover:text-[#7593b4] transition">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {designer.email}
                </a>
              )}
              {designer?.phone && (
                <a href={`tel:${designer.phone}`} className="flex items-center gap-1.5 hover:text-[#7593b4] transition">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {designer.phone}
                </a>
              )}
              {(designer?.city || designer?.state) && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {[designer.city, designer.state].filter(Boolean).join(", ")}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Joined {formatDate(designer?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: details + gallery */}
          <div className="lg:col-span-2 space-y-6">
            {extraFields.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-base font-semibold text-slate-800 mb-5">Profile Details</h2>
                <div className="divide-y divide-slate-100">
                  {extraFields.map(([key, value]) => {
                    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
                    return (
                      <div key={key} className="py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                        <span className="sm:w-44 flex-shrink-0 text-xs font-medium text-slate-500 uppercase tracking-wide pt-0.5">{label}</span>
                        <span className="text-sm text-slate-800 flex-1">
                          {typeof value === "boolean"
                            ? <span className={value ? "text-green-600 font-medium" : "text-red-500 font-medium"}>{String(value)}</span>
                            : typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"))
                              ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-[#7593b4] hover:underline break-all">{value}</a>
                              : Array.isArray(value)
                                ? <span className="flex flex-wrap gap-1.5">{value.map((v: any, i: number) => <span key={i} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full">{String(v)}</span>)}</span>
                                : (value as any)?.seconds
                                  ? formatDate(value)
                                  : typeof value === "object"
                                    ? <pre className="bg-slate-50 text-xs p-2 rounded-lg overflow-auto max-h-32 text-slate-600">{JSON.stringify(value, null, 2)}</pre>
                                    : String(value)
                          }
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {designer?.imageUrls?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-slate-800">Portfolio</h2>
                  <span className="text-xs text-slate-500">{designer.imageUrls.length} image{designer.imageUrls.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {designer.imageUrls.map((url: string, idx: number) => (
                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer"
                      className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 block">
                      <img
                        src={url}
                        alt={`Portfolio ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget.parentElement as HTMLElement).innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400 text-xs">Not available</div>';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5 lg:sticky lg:top-6 self-start">
            {/* Action card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Review Decision</h3>

              {designer?.status === "approved" && (
                <div className="text-center py-4 space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-green-700 font-semibold text-sm">Approved</p>
                  <p className="text-slate-400 text-xs">This designer is active on the platform</p>
                  <button onClick={handleDeny} disabled={updating}
                    className="mt-3 w-full border border-red-200 text-red-600 text-sm py-2 rounded-lg hover:bg-red-50 transition disabled:opacity-50">
                    {updating ? "Processing..." : "Revoke & Reject"}
                  </button>
                </div>
              )}

              {designer?.status === "rejected" && (
                <div className="text-center py-4 space-y-2">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </div>
                  <p className="text-red-600 font-semibold text-sm">Rejected</p>
                  <p className="text-slate-400 text-xs">This designer has been rejected</p>
                  <button onClick={handleApprove} disabled={updating}
                    className="mt-3 w-full border border-green-200 text-green-700 text-sm py-2 rounded-lg hover:bg-green-50 transition disabled:opacity-50">
                    {updating ? "Processing..." : "Approve Instead"}
                  </button>
                </div>
              )}

              {designer?.status !== "approved" && designer?.status !== "rejected" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 mb-3">This designer is awaiting review. Approve to grant platform access.</p>
                  <button onClick={handleApprove} disabled={updating}
                    className="w-full bg-[#7593b4] hover:bg-[#5f7a9d] text-white font-medium py-2.5 rounded-xl text-sm transition disabled:opacity-50">
                    {updating ? "Processing..." : "Approve Designer"}
                  </button>
                  <button onClick={handleDeny} disabled={updating}
                    className="w-full border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium py-2.5 rounded-xl text-sm transition disabled:opacity-50">
                    {updating ? "Processing..." : "Reject"}
                  </button>
                </div>
              )}
            </div>

            {/* Photo upload card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Profile Photo</h3>
              <p className="text-xs text-slate-400 mb-4">JPG, PNG or WebP · Max 5 MB</p>

              {uploading && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-[#7593b4] h-1.5 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => !uploading && fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-[#7593b4] text-slate-500 hover:text-[#7593b4] rounded-xl py-3 text-sm transition disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {uploading ? "Uploading..." : designer?.photoURL ? "Replace Photo" : "Upload Photo"}
              </button>

              {designer?.photoURL && !uploading && (
                <p className="text-center text-xs text-green-600 mt-2">&#10003; Photo saved</p>
              )}
            </div>

            {/* Account info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700">Account Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">User ID</p>
                  <p className="font-mono text-xs bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-slate-600 break-all">{designerId}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Joined</span>
                  <span className="text-slate-800 font-medium">{formatDate(designer?.createdAt)}</span>
                </div>
                {designer?.updatedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Updated</span>
                    <span className="text-slate-800 font-medium">{formatDate(designer?.updatedAt)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Role</span>
                  <span className="capitalize text-slate-800">{designer?.role || "designer"}</span>
                </div>
              </div>
            </div>

            <Link href="/dashboard/admin/designers"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition px-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Designers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
