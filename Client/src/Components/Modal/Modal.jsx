import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Modal({ isVisible, onClose, children, className }) {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', className)}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" />
      <div
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-lift animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  )
}