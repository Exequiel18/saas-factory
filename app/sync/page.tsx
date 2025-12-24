"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, CheckCircle2, Zap } from "lucide-react"

export default function VoiceTrainingPage() {
    const [recording, setRecording] = useState(false)
    const [done, setDone] = useState(false)

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <Card className="max-w-md w-full p-10 border-none shadow-2xl rounded-[3rem] bg-white text-center">
                <div className="bg-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <Zap className="h-8 w-8 text-white fill-current" />
                </div>
                <h1 className="text-3xl font-black mb-4">Sincroniza tu ADN</h1>
                <p className="text-slate-500 font-bold mb-8">Grabá 15 segundos de audio explicando cómo cerrás un trato. Tu Voz Digital hará el resto.</p>

                {!done ? (
                    <Button
                        onClick={() => {
                            setRecording(true)
                            setTimeout(() => { setRecording(false); setDone(true); }, 5000)
                        }}
                        disabled={recording}
                        className={`w-24 h-24 rounded-full transition-all ${recording ? 'bg-red-500 animate-pulse' : 'bg-slate-900 hover:bg-red-600'}`}
                    >
                        <Mic className="h-10 w-10 text-white" />
                    </Button>
                ) : (
                    <div className="flex flex-col items-center animate-in zoom-in-50">
                        <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
                        <p className="font-black text-green-600 uppercase tracking-widest">DNA SYNC COMPLETE</p>
                        <Button className="mt-8 rounded-xl font-bold px-8" onClick={() => window.location.href = "/"}>Volver a la Home</Button>
                    </div>
                )}
            </Card>
        </div>
    )
}
