import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { name, email, password, referralCode } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Buscar usuario referidor si hay código de referido
    let referredBy = null
    if (referralCode) {
      // El código de referido tiene formato REF-XXXXXXXX
      const referrerId = referralCode.replace("REF-", "").toLowerCase()
      // Buscar usuario por ID parcial (primeros 8 caracteres)
      const referrer = await prisma.user.findFirst({
        where: {
          id: {
            startsWith: referrerId,
          },
        },
      })
      if (referrer) {
        referredBy = referrer.id
        // Otorgar créditos al referidor
        await prisma.user.update({
          where: { id: referrer.id },
          data: {
            credits: {
              increment: 10, // $10 de crédito por referido
            },
          },
        })
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        referralCode: referralCode || null,
        referredBy: referredBy,
        credits: referredBy ? 10 : 0, // $10 de crédito por registrarse con referido
        industry: "docente", // Default for now as per manifesto
      },
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Signup error:", error)
    // DEBUG: Reveal connection target in error message (safe mask)
    const dbUrl = process.env.DATABASE_URL || "undefined"
    const maskedUrl = dbUrl.replace(/:[^:@]*@/, ":***@")
    return NextResponse.json(
      { error: `DB Error: ${error?.message} | Target: ${maskedUrl}` },
      { status: 500 }
    )
  }
}

