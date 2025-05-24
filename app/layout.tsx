import type { Metadata } from "next";
import {  Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/shared/Header";
import {
  ClerkProvider,
} from '@clerk/nextjs'
const inter = Inter({ subsets: ["latin"] });

export const metadata  : Metadata= {
  title: "Vehiqle",
  description: "Find your Dream Car",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
 <ClerkProvider>
      <html lang="en">
    <head>
      <link rel="icon" href="/logo-white.png" sizes="any" />
    </head>
    <body className={`${inter.className}`}>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Toaster richColors />

      <footer className="bg-blue-50 py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Made with 💗 by ahmedyasserdev</p>
        </div>
      </footer>
    </body>
  </html>
 </ClerkProvider>
  );
}
