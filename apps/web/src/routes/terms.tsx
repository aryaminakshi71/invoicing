import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <p>
          <strong className="text-foreground">Last updated:</strong> February 7,
          2026
        </p>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using this invoicing platform, you agree to be
            bound by these Terms of Service. If you do not agree to these terms,
            please do not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            2. Description of Service
          </h2>
          <p>
            We provide a cloud-based invoicing and billing management platform
            that enables users to create, send, and manage invoices, track
            payments, and manage client relationships.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            3. User Accounts
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. You must notify us immediately of any unauthorized use.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            4. Acceptable Use
          </h2>
          <p>
            You agree not to misuse the service or help anyone else do so. You
            may not use the service for any illegal or unauthorized purpose.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            5. Data and Privacy
          </h2>
          <p>
            Your use of the service is also governed by our{" "}
            <Link
              to="/privacy"
              className="text-primary underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            . By using the service, you consent to the collection and use of
            information as described therein.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            6. Limitation of Liability
          </h2>
          <p>
            The service is provided "as is" without warranties of any kind. We
            shall not be liable for any indirect, incidental, or consequential
            damages arising from your use of the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            7. Contact
          </h2>
          <p>
            If you have questions about these Terms, please contact us at
            support@invoicing.app.
          </p>
        </section>
      </div>

      <div className="mt-8">
        <Link
          to="/"
          className="text-sm font-medium text-primary underline underline-offset-4"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
