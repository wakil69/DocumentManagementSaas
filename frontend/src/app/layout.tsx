import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryClientWrapper from "./queryClientWrapper";
import { Suspense } from "react";
import Loading from "./loading";
import Footer from "@/components/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Extranet pour les membres du conseil syndical",
  description: "Extranet pour les membres du conseil syndical",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientWrapper>
        <Suspense fallback={<Loading />}>{children}</Suspense>
        </QueryClientWrapper>
        <Footer />
      </body>
    </html>
  );
}
