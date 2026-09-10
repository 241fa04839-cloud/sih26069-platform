import Link from "next/link";

export default function HomePage() {
  const telemetryData = [
    { label: "INGESTION LATENCY", value: "12ms", status: "OK" },
    { label: "ACTIVE AWS SENSORS", value: "2,847", status: "ONLINE" },
    { label: "IMD POSTS/HR", value: "14,203", status: "STREAMING" },
    { label: "AI VERIFICATION", value: "98.7%", status: "ACCURATE" },
  ];

  return (
    <div className="min-h-screen bg-tactical-canvas">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 tactical-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-tactical-cyan bg-tactical-canvas">
              <span className="font-mono text-2xl font-bold text-tactical-cyan">
                IMD
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              NATIONAL WEATHER
              <br />
              <span className="text-tactical-cyan">BIG DATA ANALYTICS</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-gray-400 sm:text-lg">
              Mission-critical platform for the Ministry of Earth Sciences.
              Real-time weather intelligence, AI-powered verification, and tactical
              command center visualization for disaster management.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/command"
                className="group relative flex items-center gap-2 rounded-lg border-2 border-tactical-cyan bg-tactical-cyan/10 px-8 py-4 text-base font-bold uppercase tracking-wider text-tactical-cyan transition-all hover:bg-tactical-cyan/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                LAUNCH TACTICAL COMMAND CENTER
              </Link>
              <Link
                href="/report"
                className="rounded-lg border border-tactical-border px-6 py-4 text-sm font-mono text-gray-400 transition-colors hover:border-tactical-amber hover:text-tactical-amber"
              >
                REPORT INCIDENT
              </Link>
            </div>
          </div>

          <div className="mt-20">
            <div className="flex items-center gap-2 border-b border-tactical-border pb-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-tactical-green" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-tactical-green">
                LIVE SYSTEM TELEMETRY
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {telemetryData.map((item) => (
                <div
                  key={item.label}
                  className="border border-tactical-border bg-tactical-panel p-4"
                >
                  <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                    {item.label}
                  </p>
                  <div className="mt-2 flex items-end justify-between">
                    <p className="text-2xl font-bold font-mono text-white">{item.value}</p>
                    <span className="rounded bg-tactical-green/10 px-2 py-0.5 font-mono text-[10px] text-tactical-green">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-center text-lg font-bold text-white">
              PLATFORM CAPABILITIES
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: "Real-Time Ingestion",
                  desc: "Continuous collection of #IMD tagged social media posts, citizen reports, and official meteorological data streams.",
                  icon: "⚡",
                },
                {
                  title: "AI Verification Engine",
                  desc: "Perceptual hashing for duplicate detection, NER for location extraction, and sensor corroboration against IMD AWS thresholds.",
                  icon: "🧠",
                },
                {
                  title: "Tactical 3D Visualization",
                  desc: "CesiumJS-powered 3D globe with color-coded incident clusters, CCTV integration, and real-time sensor overlays.",
                  icon: "🛰️",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-tactical-border bg-tactical-panel p-6"
                >
                  <div className="mb-3 text-3xl">{item.icon}</div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
