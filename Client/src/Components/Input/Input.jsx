import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export default function Input({
  label,
  type,
  reference,
  value,
  onChange,
  placeholder,
  onClick,
  style,
  icon,
  className,
  iconStyle,
  showIconOnly = false,
  isRequired = true,
}) {
  const [showInput, setShowInput] = useState(!showIconOnly)

  const handleIconClick = () => {
    if (showIconOnly) {
      setShowInput(true)
    }
    if (onClick) {
      setShowInput(false)
    }
  }

  if (showIconOnly && !showInput) {
    return (
      <span onClick={handleIconClick} style={{ cursor: 'pointer', ...iconStyle }}>
        {icon}
      </span>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {icon && (
        <span onClick={handleIconClick} style={{ cursor: 'pointer', ...iconStyle }}>
          {icon}
        </span>
      )}
      {label && (
        <label htmlFor={reference} className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        type={type}
        id={reference}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={style}
        required={isRequired}
        className="input-base"
      />
    </div>
  )
}