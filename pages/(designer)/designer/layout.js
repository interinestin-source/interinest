import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

import SidebarClientWrapper from "@/components/supplier/SidebarClientWrapper";
 
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Industry Selling - B2B Marketplace",
  description:
    "The ultimate B2B marketplace platform connecting wholesale suppliers with buyers globally in India. List your products, discover new suppliers, and grow your business.",
  keywords:
    "B2B marketplace, wholesale, suppliers, buyers, trading platform, business, industry selling",
  generator: "v0.dev",
};

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" />
        <AuthProvider>
          <div className="flex min-h-screen w-full">
            <SidebarClientWrapper>{children}</SidebarClientWrapper>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
