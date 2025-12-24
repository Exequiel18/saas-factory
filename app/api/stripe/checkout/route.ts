import { NextResponse } from "next/server"

// Stripe checkout disabled - using Mercado Pago instead
export async function POST(request: Request) {
  return NextResponse.json(
    { error: "Stripe checkout is disabled. Please use Mercado Pago payment flow." },
    { status: 501 }
  )
}





