import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import { PurchaseIntentModal } from "@/components/PurchaseIntentModal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Chequeo Real de Negocio - La Verdad que tu Negocio Necesita Escuchar",
    template: "%s | Chequeo Real"
  },
  description: "En 3 minutos, te decimos si tu negocio está bien armado o solo se sostiene. Sin humo, sin promesas. Solo la verdad que necesitás escuchar.",
  keywords: ["chequeo de negocio", "diagnóstico empresarial", "evaluación de negocios", "emprendedores", "negocios pequeños", "métricas de negocio", "análisis financiero"],
  authors: [{ name: "Antigravity" }],
  creator: "Antigravity",
  publisher: "Antigravity",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
    siteName: "Chequeo Real de Negocio",
    title: "Chequeo Real de Negocio - La Verdad que tu Negocio Necesita Escuchar",
    description: "En 3 minutos, te decimos si tu negocio está bien armado o solo se sostiene. Sin humo, sin promesas.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chequeo Real de Negocio - La Verdad que tu Negocio Necesita Escuchar",
    description: "En 3 minutos, te decimos si tu negocio está bien armado o solo se sostiene. Sin humo, sin promesas.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
          <PurchaseIntentModal />
        </Providers>
      </body>
    </html>
  )
}

