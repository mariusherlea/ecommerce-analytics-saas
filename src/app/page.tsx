//src/app/page.tsx
import { Suspense } from "react";
import LoginPageClient from "./login/LoginPageClient";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-zinc-900 px-4">
      <div className="grid w-full max-w-6xl gap-8 md:grid-cols-2">
        
        {/* LEFT */}
        <section className="flex flex-col justify-center">
          <span className="inline-flex w-fit rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">
            SaaS eCommerce Analytics
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-200 sm:text-5xl">
            StorePulse
          </h1>

          <p className="mt-4 max-w-xl text-lg text-zinc-600">
           Monitor your online store performance in real time.
Clear insights about sales, customers, and products — in a simple
dashboard.
          </p>

          <div className="mt-6 space-y-2 text-sm text-zinc-500">
            <p>📊 
Real-time analytics</p>
            <p>🛒 Order tracking</p>
            <p>📈 
Advanced reports</p>
            <p>⚡ Fast integration</p>
          </div>
        </section>

        {/* RIGHT */}
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <Suspense fallback={<div className="h-[520px] w-full rounded-2xl border border-zinc-200 bg-white" />}>
              <LoginPageClient />
            </Suspense>
          </div>
        </section>

      </div>
    </main>
  );
}
