import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import { AuthProvider } from '@/contexts/auth-context'
import { AuthLayoutContent } from '@/app/(features)/auth/auth-layout-content'

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Login - Toko Sharia",
   description: "Login to Toko Sharia",
};

export default function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <div
         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <AuthProvider>
            <AuthLayoutContent>{children}</AuthLayoutContent>
         </AuthProvider>
      </div>
   );
}