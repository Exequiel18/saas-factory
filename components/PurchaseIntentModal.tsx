"use client"

import { useEffect, useState } from 'react'
import { X, Zap, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface PurchaseIntentModalProps {
    onClose?: () => void
}

/**
 * 🔥 AUTONOMOUS CONVERSION MODAL
 * Appears automatically when user shows high purchase intent
 */
export function PurchaseIntentModal({ onClose }: PurchaseIntentModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [offer, setOffer] = useState<any>(null)
    const [intent, setIntent] = useState<any>(null)

    useEffect(() => {
        if (typeof window === 'undefined') return

        const handlePurchaseIntent = (event: CustomEvent) => {
            const { intent: detectedIntent, offer: detectedOffer } = event.detail

            setIntent(detectedIntent)
            setOffer(detectedOffer)
            setIsOpen(true)

            // Auto-close after 30 seconds if not interacted
            setTimeout(() => {
                setIsOpen(false)
            }, 30000)
        }

        window.addEventListener('purchaseIntentDetected' as any, handlePurchaseIntent)

        return () => {
            window.removeEventListener('purchaseIntentDetected' as any, handlePurchaseIntent)
        }
    }, [])

    const handleUpgrade = () => {
        // Redirect to checkout with pre-selected plan
        window.location.href = `/pricing?plan=${offer?.planId}&discount=${offer?.discount || 0}`
    }

    const handleClose = () => {
        setIsOpen(false)
        onClose?.()
    }

    if (!offer || !intent) return null

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        {intent.emotionalState === 'burning' && (
                            <>
                                <Zap className="h-5 w-5 text-orange-500 animate-pulse" />
                                <span className="text-orange-500 font-bold text-lg">Perfect Timing!</span>
                            </>
                        )}
                        {intent.emotionalState === 'hot' && (
                            <>
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                                <span className="text-blue-500 font-bold text-lg">Special Offer for You</span>
                            </>
                        )}
                    </div>
                    <DialogTitle className="sr-only">Special Offer</DialogTitle>
                    <DialogDescription className="space-y-4 pt-4">
                        <p className="text-base font-medium text-gray-900">
                            {offer.urgencyMessage}
                        </p>

                        {offer.discount && (
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Original Price</p>
                                        <p className="text-lg line-through text-gray-400">
                                            ${(offer.price / (1 - offer.discount / 100)).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Your Price</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            ${offer.price.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-center mt-2 text-sm font-semibold text-orange-600">
                                    Save {offer.discount}% Today!
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Button
                                onClick={handleUpgrade}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-6 text-lg"
                            >
                                {intent.emotionalState === 'burning' ? '🔥 Claim This Offer Now' : '✨ Upgrade Now'}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={handleClose}
                                className="w-full text-gray-500"
                            >
                                Maybe Later
                            </Button>
                        </div>

                        <p className="text-xs text-center text-gray-500">
                            {intent.emotionalState === 'burning'
                                ? 'This exclusive offer expires in 5 minutes'
                                : 'Limited time offer - don\'t miss out!'}
                        </p>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
