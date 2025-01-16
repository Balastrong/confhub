import { signIn } from "~/db/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const SignIn = () => {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signIn({
        data: {
          email,
          password,
        },
      });
    } catch (error) {
      // TODO Handle error
      console.log("Error", error);
    }
  };
  return (
    <form className="flex flex-col gap-2 w-full" onSubmit={onSubmit}>
      <Label htmlFor="email">
        Email
        <Input id="email" name="email" />
      </Label>
      <Label htmlFor="password">
        Password
        <Input id="password" name="password" />
      </Label>
      <Button>Sign In</Button>
    </form>
  );
};
