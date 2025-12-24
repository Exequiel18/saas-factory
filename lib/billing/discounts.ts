// lib/billing/discounts.ts

import { prisma } from "@/lib/prisma"

/**
 * Validate a coupon code and return its details if valid.
 */
export async function validateCoupon(code: string) {
    const coupon = await prisma.coupon.findUnique({
        where: { code },
    })

    if (!coupon) return null

    // Check expiration
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return null
    }

    // Check usage limit
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        return null
    }

    return coupon
}

/**
 * Calculate distance after discount.
 */
export function applyDiscount(amount: number, coupon: { discountPercentage?: number | null, discountAmount?: number | null }) {
    if (coupon.discountPercentage) {
        return amount * (1 - coupon.discountPercentage / 100)
    }
    if (coupon.discountAmount) {
        return Math.max(0, amount - coupon.discountAmount)
    }
    return amount
}
