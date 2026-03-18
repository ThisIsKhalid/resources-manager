import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getHtmlFiles } from "@/lib/resources";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resources Manager",
  description: "View and manage HTML resources seamlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const files = getHtmlFiles();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#061E29] text-gray-100 pt-16 selection:bg-[#1D546D]/50`}
      >
        <Navbar files={files} />
        <main className="h-[calc(100vh-4rem)] w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
