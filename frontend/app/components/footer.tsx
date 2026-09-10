import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-tactical-border bg-tactical-panel" role="contentinfo">
      <div className="mx-auto max-w-[1920px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded border border-tactical-cyan bg-tactical-canvas">
                <span className="font-mono text-[10px] font-bold text-tactical-cyan">IMD</span>
              </div>
              <span className="text-xs font-bold tracking-wider text-white">
                NWA PLATFORM
              </span>
            </div>
            <p className="text-xs text-gray-500">
              National Weather Big Data Analytics Platform
            </p>
            <p className="mt-1 font-mono text-[10px] text-gray-600">
              Ministry of Earth Sciences, Govt. of India
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-tactical-amber">
              Platform
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/command", label: "Command Center" },
                { href: "/report", label: "Incident Reporter" },
                { href: "/api/health", label: "API Status" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-gray-400 transition-colors hover:text-tactical-cyan"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-tactical-amber">
              Legal
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/", label: "Cookie Policy" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-gray-400 transition-colors hover:text-tactical-cyan"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-tactical-amber">
              System Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-tactical-green" />
                <span className="font-mono text-[10px] text-gray-400">API: OPERATIONAL</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-tactical-green" />
                <span className="font-mono text-[10px] text-gray-400">SENSORS: ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-tactical-amber" />
                <span className="font-mono text-[10px] text-gray-400">AI: PROCESSING</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-tactical-border pt-4">
          <p className="font-mono text-center text-[10px] text-gray-600">
            © {new Date().getFullYear()} Ministry of Earth Sciences, Government of India.
            All rights reserved. SIH26069 | National Weather Big Data Analytics Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
