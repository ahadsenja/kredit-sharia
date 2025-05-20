'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function AuthLayoutContent({ children }: { children: React.ReactNode }) {
   const { user, loading } = useAuth()
   const router = useRouter()

   useEffect(() => {
      if (!loading && user) {
         router.push('/dashboard')
      }
   }, [user, loading, router])

   if (loading) {
      return <div>Loading...</div>
   }

   if (user) {
      return null
   }

   return (
      <main className="min-h-screen flex items-center justify-center">
         {children}
      </main>
   )
} 