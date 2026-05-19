import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <span className="text-zinc-600 text-sm">Loading...</span>
    </div>}>
      <LoginForm />
    </Suspense>
  );
}