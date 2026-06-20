import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <section
        aria-labelledby="login-heading"
        className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm md:p-8"
      >
        <LoginForm />
      </section>
    </div>
  );
}
