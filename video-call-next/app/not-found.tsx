import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#09090b] text-white font-[family-name:var(--font-geist-sans)]">
      <div className="space-y-4 text-center">
        <h1 className="text-6xl font-bold tracking-tighter sm:text-8xl text-indigo-500">404</h1>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Page Not Found</h2>
        <p className="max-w-md mx-auto text-zinc-400">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-black transition-colors bg-white rounded-full hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
