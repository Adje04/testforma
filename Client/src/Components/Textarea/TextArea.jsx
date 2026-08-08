import React from 'react'
import { cn } from '@/lib/utils'

export default function TextArea({
  value,
  onChange,
  placeholder = '',
  rows = 5,
  cols = 50,
  maxLength,
  disabled = false,
  readOnly = false,
  style = {},
  className = '',
  label,
  reference,
  error,
}) {
  return (
    <div className={cn('w-full', className)} style={style}>
      {label && (
        <label htmlFor={reference} className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        id={reference}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        className="input-base resize-y min-h-[120px] leading-relaxed"
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && <span className="mt-1 block text-sm text-destructive">{error}</span>}
    </div>
  )
}