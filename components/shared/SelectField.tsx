'use client'

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldError } from "react-hook-form"

interface SelectFieldProps {
  id: string
  label: string
  placeholder?: string
  error?: FieldError
  options: string[]
  onValueChange: (value: string) => void
  defaultValue?: string
  className?: string
}

const SelectField = ({
  id,
  label,
  placeholder,
  error,
  options,
  onValueChange,
  defaultValue,
  className = ""
}: SelectFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select  onValueChange={onValueChange} defaultValue={defaultValue}>
        <SelectTrigger className={'w-full'}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-red-500">
          {error.message}
        </p>
      )}
    </div>
  )
}

export default SelectField