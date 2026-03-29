"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"

export default function LearnResourcesPage() {
  const router = useRouter()
  const { session, setResourcesFlow, isHydrated } = useStore()

  useEffect(() => {
    if (!isHydrated) return
    if (session.region) {
      router.replace(`/learn/resources/${session.region}`)
    } else {
      setResourcesFlow(true)
      router.replace("/learn/language")
    }
  }, [isHydrated, session.region, router, setResourcesFlow])

  return null
}
