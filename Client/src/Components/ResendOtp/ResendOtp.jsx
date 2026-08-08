import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { apiClient } from '../../axios/axios'

const COOLDOWN_SECONDS = 60

// Petit lien "Renvoyer le code" à placer sous n'importe quel formulaire OTP,
// Comme il déclenche un appel API (et non une navigation), on empêche la
// navigation par défaut du Link et on gère le clic nous-mêmes.
export default function ResendOtp({ email }) {
  const [isSending, setIsSending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleResend = async (e) => {
    e.preventDefault()
    if (isSending || cooldown > 0) return

    if (!email) {
      toast.error("Email introuvable, recommence depuis le début.")
      return
    }

    setIsSending(true)
    try {
      const response = await apiClient.post('/resend-otpCode', { email })
      toast.success(response.data.message || "Un nouveau code vous a été envoyé.")
      setCooldown(COOLDOWN_SECONDS)
    } catch (error) {
      toast.error(error.response?.data?.message || "Impossible de renvoyer le code.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <p className="text-center text-sm text-muted-foreground">
      {cooldown > 0 ? (
        <span>Renvoyer le code dans {cooldown}s</span>
      ) : (
        <a href="#" onClick={handleResend} className="font-medium text-primary hover:underline">
          {isSending ? 'Envoi...' : 'Renvoyer le code'}
        </a>
      )}
    </p>
  )
}