import { NextResponse } from "next/server"

// Stripe plans disabled - using Mercado Pago instead
export async function GET() {
  return NextResponse.json(
    { error: "Stripe plans are disabled. Please use Mercado Pago payment flow." },
    { status: 501 }
  )
}





