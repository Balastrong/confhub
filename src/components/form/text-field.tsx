import { useFieldContext } from "src/lib/form"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { JSX } from "react"

type Props = {
  label: string | JSX.Element
  type?: "text" | "email" | "password" | "url"
  required?: boolean
}

export const TextField = ({ label, type = "text", required }: Props) => {
  const field = useFieldContext<string>()

  return (
    <Label htmlFor={field.name}>
      <div className="flex items-center gap-2">
        {label}
        {required ? " *" : ""}
      </div>
      <Input
        name={field.name}
        id={field.name}
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        type={type}
      />
    </Label>
  )
}
