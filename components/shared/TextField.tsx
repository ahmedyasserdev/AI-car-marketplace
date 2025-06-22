'use client'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { UseFormRegister, FieldValues, FieldError, Path } from "react-hook-form"

interface FormFieldProps<T extends FieldValues> {
  id: Path<T>
  label: string
  placeholder?: string
  register: UseFormRegister<T>
  error?: FieldError
  type?: string
  textarea?: boolean
  className?: string
}

const TextField = <T extends FieldValues>({
  id,
  label,
  placeholder,
  register,
  error,
  type = "text",
  textarea = false,
  className = ""
}: FormFieldProps<T>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
        {
          textarea ? (
            <Textarea
            id={id}
            {...register(id)}
            placeholder={placeholder}
            className={cn(className, error && "border-red-500" ,  )}
    
          />
          ) : (
            <Input
            id={id}
            type={type}
            {...register(id)}
            placeholder={placeholder}
            className={cn(className, error && "border-red-500")}
    
          />
          )
        }
      {error && (
        <p className="text-xs text-red-500">
          {error.message}
        </p>
      )}
    </div>
  )
}

export default TextField