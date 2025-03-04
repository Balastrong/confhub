import { useFieldContext } from "~/lib/form"

import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

type Props<T> = {
  label: string
  options: { value: string | number; label: string }[]
  required?: boolean
}

export const SelectField = <T extends string | number>({
  label,
  options,
  required,
}: Props<T>) => {
  const field = useFieldContext<T>()

  return (
    <Label htmlFor={field.name}>
      {label}
      {required ? " *" : ""}
      <Select
        value={field.state.value?.toString() ?? ""}
        onValueChange={(value) => {
          field.handleChange(value as T)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Select a ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={`${option.value}`}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Label>
  )
}
