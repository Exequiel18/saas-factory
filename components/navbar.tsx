"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Zap, Clock, ShieldCheck } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    try {
      if (name && typeof name === 'string' && name.trim()) {
        const parts = name.trim().split(/\s+/).filter(Boolean)
        return parts
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      }
      if (email && typeof email === 'string' && email.trim()) {
        return email.trim()[0].toUpperCase()
      }
    } catch (e) {
      console.error("Error generating initials", e)
    }
    return "U"
  }

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-red-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Zap className="h-5 w-5 text-white fill-current" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">SaaS Factory</h1>
        </Link>
        <div className="hidden md:flex gap-8 items-center mr-auto ml-12 font-bold text-sm text-slate-500">
          <Link href="/que-hacemos" className="hover:text-red-600 transition-colors">¿Qué hacemos?</Link>
          <Link href="/audit" className="hover:text-red-600 transition-colors">Analizar Mi Tiempo</Link>
        </div>
        <div className="flex gap-4 items-center">
          {session ? (
            <>
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="font-bold">
                  Mi Panel
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-red-50">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.user?.image || undefined} />
                      <AvatarFallback className="bg-red-50 text-red-600 font-bold">
                        {getInitials(session.user?.name, session.user?.email || "")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="px-2 py-1.5 border-b mb-1">
                    <p className="text-sm font-bold text-slate-900">{session.user?.name || "Usuario"}</p>
                    <p className="text-xs text-slate-500">Industry: {session.user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="font-medium cursor-pointer">Mi Panel de Control</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="font-medium cursor-pointer">Configuración</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <div className="w-full mt-2 pt-2 border-t">
                      <LogoutButton />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-all mr-2">
                Entrar
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-black rounded-xl h-10 px-6">
                  Empezar ahora
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}





