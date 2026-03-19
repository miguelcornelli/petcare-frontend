'use client'
import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && <label htmlFor={textareaId} className="text-sm font-medium text-gray-700">{label}</label>}
        <textarea
          ref={ref}
          id={textareaId}
          rows={3}
          className={cn(
            'w-full rounded-xl border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 resize-none',
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
Textarea.displayName = 'Textarea'
