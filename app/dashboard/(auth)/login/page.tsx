"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { auth, db } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const getLoginErrorMessage = (error: unknown) => {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          return "Invalid email or password. Please try again.";
        case "auth/invalid-email":
          return "Please enter a valid email address.";
        case "auth/user-disabled":
          return "This account has been disabled.";
        case "auth/too-many-requests":
          return "Too many failed attempts. Please try again later.";
        default:
          return "Login failed. Please try again.";
      }
    }
    return "Login failed. Please try again.";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;

    try {
      const data = new FormData(form);
      const email = String(data.get("email") || "").trim();
      const password = String(data.get("password") || "");

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      const userRef = doc(db, "interinestUsers", uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        toast.error("Account not found. Please register first.");
        setLoading(false);
        return;
      }

      const userData = userSnap.data();
      const rawRole = String(userData?.role || "").trim().toLowerCase();
      let userRole: string | null = null;
      if (rawRole === "designer") userRole = "designer";
      else if (rawRole === "admin" || rawRole === "administratorrr") userRole = "admin";
      else if (rawRole === "user") userRole = "user";

      if (!userRole) {
        toast.error("Your account role is not valid. Contact support.");
        setLoading(false);
        return;
      }

      const token = await cred.user.getIdToken();
      const maxAge = 3 * 24 * 60 * 60;
      const secureFlag = window.location.protocol === "https:" ? "; secure" : "";
      document.cookie = `authToken=${token}; path=/; max-age=${maxAge}; samesite=lax${secureFlag}`;
      document.cookie = `role=${userRole}; path=/; max-age=${maxAge}; samesite=lax${secureFlag}`;
      document.cookie = `uid=${uid}; path=/; max-age=${maxAge}; samesite=lax${secureFlag}`;

      form?.reset();
      toast.success("Login successful!");

      if (userRole === "designer") {
        router.push("/dashboard/designer-dashboard");
      } else if (userRole === "admin") {
        router.push("/dashboard/admin");
      } else if (userRole === "user") {
        router.push("/dashboard/user-dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(getLoginErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f4ec]">
      {/* Left brand / visual panel */}
      <div
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-[#e2d6c3] text-[#f8f4ec] lg:flex"
        style={{
          backgroundImage:
            "url('https://cdn.home-designing.com/wp-content/uploads/2020/09/luxury-living-room-3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0">
          <div className="h-full w-full bg-black/55" />
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-white/25 blur-3xl" />
            <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />
          </div>
        </div>

        <header className="relative z-10 flex items-center gap-2 px-10 pt-9">
          <Link href="/">
            <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: 12, padding: "6px 16px" }}>
              <Image
                width={160}
                height={50}
                src="/images/logo-interinest.png"
                alt="Interinest"
                className="object-contain"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>
          </Link>
        </header>

        <main className="relative z-10 px-10 pb-16 pt-6">
          <div className="max-w-xl rounded-3xl bg-black/55 p-6 backdrop-blur-md sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f8f4ec]/80">
              FOR INTERIOR DESIGNERS
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight">
              Get Interior Design Clients.
              <br />
              Not Just a Portfolio.
            </h1>
            <p className="mt-3 text-sm text-[#f8f4ec]/85">
              Join Interinest and connect with homeowners and businesses looking
              for interior designers across India.
            </p>
            <div className="mt-6 space-y-2.5 text-sm text-[#f8f4ec]/90">
              {[
                "Get real client inquiries",
                "Showcase your portfolio",
                "Get discovered in your city",
                "Build your design brand",
              ].map((point) => (
                <div key={point} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold text-white">
                    ✔
                  </span>
                  <span className="text-sm font-medium text-[#fefbf7]">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="relative z-10 px-10 pb-9 text-[11px] text-[#f8f4ec]/80">
          © {new Date().getFullYear()} Interinest — Interior Designers Marketplace India
        </footer>
      </div>

      {/* Right login panel */}
      <div className="flex w-full items-center justify-center px-4 py-8 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-md rounded-3xl border border-[#e2d6c3] bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="mb-6 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9b8c77]">
              Welcome back
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Log in to your designer workspace
            </h2>
            <p className="text-xs text-slate-500">
              Use the email you registered with Interinest. New here?{" "}
              <Link
                href="/dashboard/register"
                className="font-medium text-[#7593b4] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-slate-700">Work email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="h-10 rounded-xl border-[#e2d6c3] bg-[#fdf9f2] text-sm placeholder:text-slate-400 focus-visible:ring-[#7593b4]"
                placeholder="you@studio-name.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-slate-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="h-10 rounded-xl border-[#e2d6c3] bg-[#fdf9f2] pr-10 text-sm placeholder:text-slate-400 focus-visible:ring-[#7593b4]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="mt-1 flex justify-end">
                <button type="button" className="text-[11px] font-medium text-[#7593b4] hover:underline">
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-1 h-10 w-full rounded-xl bg-[#7593b4] text-xs font-medium tracking-wide text-[#f8f4ec] shadow-sm hover:bg-[#607da0]"
            >
              {loading ? "Signing you in…" : "Continue to Interinest"}
            </Button>

            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <div className="h-px flex-1 bg-[#e5d9c9]" />
              <span>or</span>
              <div className="h-px flex-1 bg-[#e5d9c9]" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-10 w-full rounded-xl border-[#e2d6c3] bg-white text-xs font-medium text-slate-700 hover:bg-[#f8f4ec]"
            >
              Don&apos;t have an account?{" "}
              <Link href="/dashboard/register" className="font-medium text-[#7593b4] hover:underline">
                Register Yourself
              </Link>
            </Button>
          </form>

          <p className="mt-6 text-[11px] leading-relaxed text-slate-500">
            By continuing, you agree to Interinest&apos;s{" "}
            <Link href="#" className="font-medium text-[#7593b4] hover:underline">Terms</Link>{" "}
            and{" "}
            <Link href="#" className="font-medium text-[#7593b4] hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
