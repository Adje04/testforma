import React from 'react'
import { cn } from '@/lib/utils'

export default function Card({ width, height, image, file, text, icon, iconStyle, style, className }) {
  const defaultCover = `${import.meta.env.VITE_ASSETS_URL || ''}/resource/coverDefault.png`

  return (
    <div
      className={cn(
        'group overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card',
        className
      )}
      style={{ width, height, ...style }}
    >
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={image ? `${import.meta.env.VITE_ASSETS_URL || ''}/resource/${image.split('\\').pop()}` : defaultCover}
          alt="image de la ressource"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex items-center justify-between gap-2 p-3">
        <p className="truncate text-sm font-medium text-foreground">{text}</p>
        {icon && (
          <button
            className="flex flex-shrink-0 items-center justify-center rounded-lg p-2 text-accent transition-colors hover:bg-accent/10"
            style={iconStyle}
          >
            {icon}
          </button>
        )}
      </div>
    </div>
  )
}