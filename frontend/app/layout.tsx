import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { TanStackQueryProvider } from "./_lib/tanstack-query";
import { CookieBanner } from "./components/cookie-banner";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "National Weather Big Data Analytics Platform | SIH26069",
    template: "%s | MoES Weather Analytics",
  },
  description: "Mission-critical weather intelligence platform for the Ministry of Earth Sciences. Real-time weather data ingestion, AI-powered fake report detection, and tactical command center visualization.",
  keywords: ["weather", "IMD", "meteorology", "India", "MoES", "analytics", "flooding", "heatwave", "disaster"],
  authors: [{ name: "Ministry of Earth Sciences, Government of India" }],
  creator: "Smart India Hackathon 2026",
  publisher: "Ministry of Earth Sciences",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://weather-analytics.gov.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "National Weather Big Data Analytics Platform",
    description: "Mission-critical weather intelligence platform for the Ministry of Earth Sciences",
    siteName: "MoES Weather Analytics",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "National Weather Big Data Analytics Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "National Weather Big Data Analytics Platform",
    description: "Mission-critical weather intelligence platform for the Ministry of Earth Sciences",
    creator: "@MoES_Gov",
    site: "@MoES_Gov",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
  other: {
    "application-name": "MoES Weather Analytics",
    "apple-itunes-app": "app-id=YOUR_APP_ID",
    "dcterms.created": new Date().toISOString(),
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
      <body className="bg-tactical-canvas text-gray-200 font-sans antialiased">
        <TanStackQueryProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </div>
          <CookieBanner />
          <Script id="analytics-stub" strategy="afterInteractive">
            {`(function(){var a=window.analytics=window.analytics||[];if(!a.initialize)a.initialize=function(){(a.q=a.q||[]).push(arguments)};a.q=a.q||[];a.track=function(){a.q.push(['track'].concat([].slice.call(arguments)))};window.__analyticsReady=true;})();function trackEvent(name,props){if(window.analytics&&window.analytics.track){window.analytics.track(name,props||{})}if(window.plausible){plausible(name,{props:props||{}})}if(window.umami){umami.trackEvent(name,props||{})}}`}
          </Script>
        </TanStackQueryProvider>
      </body>
    </html>
  );
}
