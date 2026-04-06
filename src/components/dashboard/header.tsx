import { auth, signOut } from "../../../auth";

export async function DashboardHeader() {
  const session = await auth();
  const name = session?.user?.name || "User";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      
      {/* LEFT */}
      <div>
        <h1 className="text-lg font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400">
          Monitor your store performance and analytics.
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        
        {/* EMAIL */}
        <div className="hidden rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400 sm:block">
          {session?.user?.email}
        </div>

        {/* AVATAR */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-white">
          {initial}
        </div>

        {/* LOGOUT */}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}