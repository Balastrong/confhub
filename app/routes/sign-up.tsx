import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Layout } from "~/components/layout";
import { SignUpForm } from "~/components/sign-up-form";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <Layout className="items-center gap-2 max-w-md">
      <SignUpForm />
      <small>
        <Link to="/sign-in">Do you already have an account?</Link>
      </small>
    </Layout>
  );
}
