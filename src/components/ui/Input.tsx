'use client'
import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && <label htmlFor={inputId} className="text-sm font-medium text-gray-700">{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2',
            error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-emerald-400',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500" role="alert">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
