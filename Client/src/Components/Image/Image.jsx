import React from 'react'
import { cn } from '@/lib/utils'

export default function Image({ src, alt, className, fittingType = 'fit' }) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn('h-auto w-full rounded-lg object-cover', className)}
      style={{ objectFit: fittingType === 'fill' ? 'cover' : 'contain' }}
      loading="lazy"
    />
  )
}