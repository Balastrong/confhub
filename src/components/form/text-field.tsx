import { useFieldContext } from "src/lib/form"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

type Props = {
  label: string
  type?: "text" | "email" | "password"
  required?: boolean
}

export const TextField = ({ label, type = "text", required }: Props) => {
  const field = useFieldContext<string>()

  return (
    <Label htmlFor={field.name}>
      {label}
      {required ? " *" : ""}
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
