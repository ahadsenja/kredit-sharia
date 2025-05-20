'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (window.location.pathname === "/") {
      router.push("/dashboard");
    }
  }, []);
}
