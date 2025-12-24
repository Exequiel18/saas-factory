import { NextResponse } from "next/server"

// Stripe webhook disabled - using Mercado Pago instead
export async function POST(request: Request) {
  return NextResponse.json(
    { error: "Stripe webhook is disabled. Please use Mercado Pago webhook." },
    { status: 501 }
  )
}
