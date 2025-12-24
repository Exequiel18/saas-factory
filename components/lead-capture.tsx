"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Loader2, Mail } from "lucide-react"

interface LeadCaptureProps {
    niche?: string
    title?: string
    description?: string
    buttonText?: string
}

export function LeadCapture({
    niche = "generic",
    title = "Unlock Exclusive Insights",
    description = "Join our elite network of innovators and get weekly reports delivered to your inbox.",
    buttonText = "Get Access Now"
}: LeadCaptureProps) {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setStatus('loading')
        setErrorMessage("")

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, niche, source: window.location.pathname })
            })

            if (!response.ok) throw new Error('Failed to submit')

            setStatus('success')
            setEmail("")
        } catch (error) {
            setStatus('error')
            setErrorMessage("Something went wrong. Please try again.")
        }
    }

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md mx-auto p-8 rounded-2xl bg-green-500/10 border border-green-500/20 backdrop-blur-sm text-center"
            >
                <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-green-400 mb-2">Welcome Aboard!</h3>
                <p className="text-zinc-400">You&apos;ve successfully joined our priority list.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-sm text-zinc-500 hover:text-zinc-300 underline"
                >
                    Register another email
                </button>
            </motion.div>
        )
    }

    return (
        <div className="w-full max-w-2xl mx-auto my-12">
            <div className="relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-zinc-800 p-8 md:p-12 backdrop-blur-xl">
                {/* Glow Effects */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 mb-3">
                            {title}
                        </h3>
                        <p className="text-zinc-400 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full md:w-auto min-w-[300px] flex flex-col gap-3">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="group relative w-full flex items-center justify-center gap-2 bg-white text-zinc-950 font-semibold py-3 px-6 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                        >
                            {status === 'loading' ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>{buttonText}</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        {status === 'error' && (
                            <p className="text-xs text-red-400 text-center">{errorMessage}</p>
                        )}

                        <p className="text-xs text-zinc-600 text-center">
                            No spam. Unsubscribe at any time.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
