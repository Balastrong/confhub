import { Loader2 } from "lucide-react"
import { useFormContext } from "src/lib/form"
import { Button } from "../ui/button"

type Props = {
  label: string
  className?: string
  disabled?: boolean
}

export const SubmitButton = ({ label, className, disabled }: Props) => {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={(state) => [state.isSubmitting, state.canSubmit]}
      children={([isSubmitting, canSubmit]) => (
        <Button
          disabled={isSubmitting || !canSubmit || disabled}
          type="submit"
          className={className}
        >
          {label}
          {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      )}
    />
  )
}
