"use client";

import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-tactical-border bg-tactical-panel/95 backdrop-blur-sm">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Home - MoES Weather Analytics">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-tactical-cyan bg-tactical-canvas">
              <span className="font-mono text-xs font-bold text-tactical-cyan">
                IMD
              </span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold tracking-wider text-white">
                NATIONAL WEATHER ANALYTICS
              </h1>
              <p className="font-mono text-[10px] text-tactical-amber">
                SIH26069 | MOES
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            <Link
              href="/command"
              className="rounded border border-transparent px-3 py-1.5 text-xs font-mono text-gray-300 transition-colors hover:border-tactical-cyan hover:text-tactical-cyan"
            >
              COMMAND CENTER
            </Link>
            <Link
              href="/report"
              className="rounded border border-transparent px-3 py-1.5 text-xs font-mono text-gray-300 transition-colors hover:border-tactical-cyan hover:text-tactical-cyan"
            >
              REPORT INCIDENT
            </Link>
            <Link
              href="/privacy"
              className="rounded border border-transparent px-3 py-1.5 text-xs font-mono text-gray-300 transition-colors hover:border-tactical-cyan hover:text-tactical-cyan"
            >
              PRIVACY
            </Link>
            <Link
              href="/terms"
              className="rounded border border-transparent px-3 py-1.5 text-xs font-mono text-gray-300 transition-colors hover:border-tactical-cyan hover:text-tactical-cyan"
            >
              TERMS
            </Link>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden rounded p-2 text-gray-400 hover:text-white"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <nav id="mobile-menu" className="border-t border-tactical-border py-2 md:hidden">
            {[
              { href: "/command", label: "COMMAND CENTER" },
              { href: "/report", label: "REPORT INCIDENT" },
              { href: "/privacy", label: "PRIVACY POLICY" },
              { href: "/terms", label: "TERMS & CONDITIONS" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-xs font-mono text-gray-300 hover:text-tactical-cyan"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
