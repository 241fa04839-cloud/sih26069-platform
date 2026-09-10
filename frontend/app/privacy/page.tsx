import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MoES Weather Analytics",
  description:
    "Privacy Policy for the National Weather Big Data Analytics Platform under the Ministry of Earth Sciences, Government of India.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-[80vh] bg-tactical-canvas py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-2 font-mono text-xs text-gray-500">
          Last updated: {new Date().toISOString().split("T")[0]} | SIH26069
        </p>

        <div className="mt-8 space-y-8 text-sm text-gray-400">
          <section>
            <h2 className="mb-3 text-lg font-bold text-tactical-cyan">
              1. Data Collection
            </h2>
            <p>
              The National Weather Big Data Analytics Platform collects weather-related
              data from social media posts tagged with #IMD, citizen reports, and official
              meteorological sources. We collect geolocation data only with explicit user
              consent and as permitted under DPDP Act 2023 and GDPR.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-tactical-cyan">
              2. Data Processing & AI Verification
            </h2>
            <p>
              All submitted reports undergo AI-powered verification including perceptual
              hashing for duplicate detection, Natural Language Processing for location
              extraction, and sensor corroboration against Automatic Weather Station data.
              No personal data is used for AI training without explicit consent.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-tactical-cyan">
              3. Data Sharing
            </h2>
            <p>
              We do not sell or trade personal data. Aggregated and anonymized data may
              be shared with government agencies for disaster management purposes as
              authorized under Indian law. Third-party service providers process data
              only as necessary for platform operation.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-tactical-cyan">
              4. Data Retention
            </h2>
            <p>
              Personal data is retained only as long as necessary for the purposes for
              which it was collected. Report data may be retained for historical and
              research purposes in anonymized form. Cookies and preferences are stored
              in localStorage as permitted by the cookie consent mechanism.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-tactical-cyan">
              5. Your Rights
            </h2>
            <p>
              Under DPDP Act 2023 and GDPR, you have the right to access, correct, and
              delete your personal data. You may withdraw consent at any time. To exercise
              these rights, contact us at privacy@moes.gov.in.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-tactical-cyan">
              6. Security
            </h2>
            <p>
              We implement industry-standard security measures including HTTPS/TLS
              encryption, strict access controls, and regular security audits. No secrets
              are exposed on the client-side. All environment variables without
              NEXT_PUBLIC_ prefix are server-side only.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-tactical-cyan">
              7. Cookies
            </h2>
            <p>
              We use cookies to ensure the best experience on our platform. Necessary
              cookies are always active. Analytics and marketing cookies require your
              explicit consent, managed through our cookie consent banner.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
