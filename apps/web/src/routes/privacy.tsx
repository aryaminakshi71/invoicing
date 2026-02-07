import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <p>
          <strong className="text-foreground">Last updated:</strong> February 7,
          2026
        </p>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide directly, such as your name,
            email address, and billing information when you create an account.
            We also collect invoicing data you enter, including client details,
            invoice amounts, and payment records.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            2. How We Use Your Information
          </h2>
          <p>
            We use your information to provide and improve our invoicing
            service, process transactions, send service-related communications,
            and comply with legal obligations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            3. Data Security
          </h2>
          <p>
            We implement industry-standard security measures to protect your
            data, including encryption in transit and at rest. However, no
            method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            4. Data Sharing
          </h2>
          <p>
            We do not sell your personal information. We may share data with
            third-party service providers who assist in operating our platform,
            subject to confidentiality agreements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            5. Your Rights
          </h2>
          <p>
            You have the right to access, correct, or delete your personal
            information. You may also request a copy of your data or restrict
            its processing by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            6. Cookies
          </h2>
          <p>
            We use essential cookies for authentication and session management.
            We do not use third-party tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            7. Contact
          </h2>
          <p>
            For privacy-related inquiries, please contact us at
            privacy@invoicing.app.
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
