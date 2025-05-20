import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { SelectField } from "src/components/form/select-field"
import { SubmitButton } from "src/components/form/submit-button"
import { TextField } from "src/components/form/text-field"

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})
