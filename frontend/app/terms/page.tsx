import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | MoES Weather Analytics",
  description:
    "Terms & Conditions for the National Weather Big Data Analytics Platform under the Ministry of Earth Sciences, Government of India.",
};

export default function TermsPage() {
  return (
    <div className="min-h-[80vh] bg-tactical-canvas py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-white">Terms & Conditions</h1>
        <p className="mt-2 font-mono text-xs text-gray-500">
          Last updated: {new Date().toISOString().split("T")[0]} | SIH26069
        </p>

        <div className="mt-8 space-y-8 text-sm text-gray-400">
          <section>
            <h2 className="mb-3 text-lg font-bold text-tactical-cyan">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the National Weather Big Data Analytics Platform,
              you agree to comply with these Terms and Conditions, the Privacy Policy,
              and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-tactical-cyan">
              2. Use of Platform
            </h2>
            <p>
              This platform is provided for weather intelligence and disaster management
              purposes. Users may submit weather reports through the Citizen Incident
              Reporter interface. All reports are subject to AI verification and may be
              flagged as fake or duplicate.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-tactical-cyan">
              3. User Conduct
            </h2>
            <p>
              Users agree not to submit false, misleading, or fraudulent reports.
              Submission of false reports may result in account suspension and
              legal action under Indian law. A honeypot field and submission cooldown
              are in place to prevent automated spam.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-tactical-cyan">
              4. Intellectual Property
            </h2>
            <p>
              All content, data, and materials on this platform are the property of
              the Ministry of Earth Sciences, Government of India, or their licensors.
              Unauthorized use, reproduction, or distribution is prohibited.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-tactical-cyan">
              5. Disclaimer
            </h2>
            <p>
              The platform is provided "as is" without warranties of any kind. Weather
              data and AI verification results are for informational purposes only
              and should not be the sole basis for any decision-making.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-tactical-cyan">
              6. Limitation of Liability
            </h2>
            <p>
              Under no circumstances shall the Ministry of Earth Sciences be liable
              for any indirect, incidental, or consequential damages arising from
              the use of this platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-tactical-cyan">
              7. Governing Law
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the
              laws of India. Any disputes shall be subject to the jurisdiction of
              courts in India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
