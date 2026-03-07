import { auth, signOut } from "../../../auth";

export async function DashboardHeader() {
  const session = await auth();
  const name = session?.user?.name || "User";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          Monitor your store performance and analytics.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-full border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 sm:block">
          {session?.user?.email}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
          {initial}
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}