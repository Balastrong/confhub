import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "~/components/layout";
import { SignIn } from "~/components/sign-in";

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout className="items-center gap-2 max-w-md">
      <SignIn />
      <small>
        <Link to="/sign-up">Do you want to create an account instead?</Link>
      </small>
    </Layout>
  );
}
