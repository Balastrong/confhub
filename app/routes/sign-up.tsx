import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "~/components/layout";
import { SignUp } from "~/components/sign-up";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout className="items-center gap-2 max-w-md">
      <SignUp />
      <small>
        <Link to="/sign-in">Do you already have an account?</Link>
      </small>
    </Layout>
  );
}
