'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppNavbar } from "@/components/app-navbar";

export default function DashboardLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const { user, loading } = useAuth()
   const router = useRouter()

   useEffect(() => {
      if (!loading && !user) {
         router.push('/auth/login')
      }
   }, [user, loading, router])

   if (loading) {
      return <div>Loading...</div>
   }

   if (!user) {
      return null
   }

   return (
      <SidebarProvider>
         <AppSidebar />
         <main className="w-screen overflow-x-hidden">
            <AppNavbar />
            <div className="p-4 sm:p-5 h-full">{children}</div>
         </main>
      </SidebarProvider>
   );
}
