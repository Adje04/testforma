import React from 'react'
import { cn } from '@/lib/utils'

// Bouton polyvalent : supporte icône + texte, variantes de couleur via className,
// et conserve la même API (type, text, icon, disabled, onClick, style, className).
export default function Button({
  type,
  text,
  style,
  disabled,
  iconStyle,
  icon = null,
  className,
  onClick
}) {
  return (
    <button
      type={type || 'button'}
      style={style}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium',
        'bg-primary text-primary-foreground transition-all',
        'hover:bg-primary/90 active:scale-[0.98]',
        'disabled:opacity-60 disabled:pointer-events-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        className
      )}
    >
      {icon && (
        <span className="flex items-center justify-center" style={iconStyle}>
          {icon}
        </span>
      )}
      {text}
    </button>
  )
}