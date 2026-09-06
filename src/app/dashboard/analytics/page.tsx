// src/app/dashboard/analytics/page.tsx

import { auth } from "../../../../auth";
import { redirect } from "next/navigation";

import { ForecastSection } from "@/components/dashboard/forecast-section";

import { getRevenueForecast } from "@/lib/analytics/forecast";
import { db } from "@/lib/db";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const store = await db.store.findFirst({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!store) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-black text-zinc-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            No store found
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Your account is not connected to a store yet.
          </p>
        </div>
      </div>
    );
  }

  const forecast = await getRevenueForecast(store.id);

  return (
    <div className="min-h-screen space-y-6 bg-black p-6 text-zinc-100">
      {/* HEADER */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Analytics
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Revenue trends, seasonality, and future performance predictions.
        </p>
      </section>

      {/* FORECAST & ANALYTICS */}
      <ForecastSection forecast={forecast} />
    </div>
  );
}