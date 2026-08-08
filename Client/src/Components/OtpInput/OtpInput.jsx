import React, { useRef } from 'react'
import { cn } from '@/lib/utils'

// 6 cases numériques alignées, avec navigation clavier automatique et support du copier-coller.
// value : la chaîne de 6 chiffres (ex: "123456", éventuellement incomplète)
// onChange : appelé avec la nouvelle chaîne complète à chaque saisie
export default function OtpInput({ length = 6, value = '', onChange }) {
  const inputsRef = useRef([])
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length)

  const updateValue = (newDigits) => {
    onChange(newDigits.join(''))
  }

  const handleChange = (e, index) => {
    const raw = e.target.value
    // On ne garde que le dernier caractère saisi, et uniquement s'il est numérique
    const digit = raw.replace(/\D/g, '').slice(-1)

    const newDigits = [...digits]
    newDigits[index] = digit
    updateValue(newDigits)

    // Passe automatiquement au champ suivant dès qu'un chiffre est saisi
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Si la case est déjà vide, Retour arrière revient à la case précédente
      inputsRef.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return

    const newDigits = pasted.split('').concat(Array(length).fill('')).slice(0, length)
    updateValue(newDigits)

    // Place le curseur sur la première case vide après le collage (ou la dernière case si tout est rempli)
    const nextEmptyIndex = pasted.length < length ? pasted.length : length - 1
    inputsRef.current[nextEmptyIndex]?.focus()
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          className={cn(
            'h-12 w-11 sm:h-14 sm:w-12 rounded-lg border bg-background text-center text-lg font-semibold text-foreground',
            'transition-all focus:outline-hidden focus:ring-2 focus:ring-ring/40',
            digit ? 'border-primary' : 'border-input'
          )}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          autoFocus={index === 0}
        />
      ))}
    </div>
  )
}