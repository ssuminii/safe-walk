import { useState, useRef, useEffect } from 'react'
import ChevronDownIcon from '@/assets/chevron-down.svg?react'

interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  options: DropdownOption[]
  value: string | null
  onChange: (value: string) => void
  placeholder?: string
}

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedLabel = value ? options.find((option) => option.value === value)?.label : null

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full px-3 py-1 r1 border border-gray-7 rounded-sm bg-white flex justify-between items-center cursor-pointer'
      >
        <span className={value ? 'text-black' : 'text-gray-5'}>{selectedLabel || placeholder}</span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div className='absolute top-full left-0 w-full mt-1 bg-white border border-gray-7 rounded-sm shadow-lg z-10'>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className='w-full px-4 py-2 text-left r1 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md cursor-pointer'
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
