'use client'
import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
  dark?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, dark, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={selectId} className={cn('text-sm font-medium', dark ? 'text-black' : 'text-gray-700')}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full rounded-xl border px-3 py-2 text-sm bg-white transition-colors focus:outline-none focus:ring-2',
            dark ? 'text-black border-gray-300 focus:ring-emerald-400' : error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-emerald-400',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {error && <p className="text-xs text-red-500" role="alert">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
