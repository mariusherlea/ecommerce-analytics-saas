//src/app/login/page.tsx
import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <Suspense fallback={<div />}>
        <div className="w-full max-w-md">
          <LoginPageClient />
        </div>
      </Suspense>
    </main>
  );
}