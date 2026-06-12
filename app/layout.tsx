import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const Muli = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interior Designers in India for Home & Office | Interinest",
  description: "Find affordable interior designers in India for homes, cafes, offices, and commercial spaces. Compare portfolios and hire the right designer for your project.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.svg",
    apple: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${Muli.variable} antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
