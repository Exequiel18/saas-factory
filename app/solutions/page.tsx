"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SolutionsRedirect() {
    const router = useRouter()
    useEffect(() => {
        router.replace("/que-hacemos")
    }, [router])
    return null
}
