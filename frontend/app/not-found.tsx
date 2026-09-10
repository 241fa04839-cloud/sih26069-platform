import { notFound } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="glitch-text text-6xl font-bold tracking-wider text-tactical-crimson">
          404
        </h1>
        <h2 className="mt-4 text-xl font-bold text-white">
          Sector Not Found
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          The requested resource does not exist in the tactical network.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/command"
            className="rounded border border-tactical-cyan bg-tactical-cyan/10 px-6 py-3 text-sm font-mono text-tactical-cyan transition-colors hover:bg-tactical-cyan/20"
          >
            LAUNCH COMMAND CENTER
          </Link>
          <Link
            href="/"
            className="text-xs font-mono text-gray-500 transition-colors hover:text-gray-300"
          >
            Return to Landing
          </Link>
        </div>
      </div>
    </div>
  );
}
