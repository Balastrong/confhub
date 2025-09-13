import { ButtonLink } from "src/components/button-link"

export type AuthMode = "sign-in" | "sign-up"

type Props = {
  mode: AuthMode
}

export const AuthSwitcher = ({ mode }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-md bg-muted p-1 text-muted-foreground">
      <ButtonLink
        to="/sign-in"
        search={true}
        variant={mode === "sign-in" ? "default" : "secondary"}
        size="sm"
        className="w-full"
      >
        Sign in
      </ButtonLink>
      <ButtonLink
        to="/sign-up"
        search={true}
        variant={mode === "sign-up" ? "default" : "secondary"}
        size="sm"
        className="w-full"
      >
        Sign up
      </ButtonLink>
    </div>
  )
}
