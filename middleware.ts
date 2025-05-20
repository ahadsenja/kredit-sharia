import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { useAuth } from "@/contexts/auth-context";
export function middleware(request: NextRequest) {
   const { user } = useAuth()
   if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
   }
   return NextResponse.next()
}

export const config = {
   matcher: '/',
}