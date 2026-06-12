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
  description: "A quiet library for curated learning resources",
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
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#f6f1e8] pt-16 text-[#201a14] antialiased selection:bg-[#d8c7a0]/70`}
      >
        <Navbar files={files} />
        <main className="h-[calc(100vh-4rem)] w-full">{children}</main>
      </body>
    </html>
  );
}
