import { LegalPage, Section } from '../components/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalPage
      badge="Legal"
      badgeColor="accent2"
      title="Privacy Policy"
      lastUpdated="March 19, 2026"
      intro="Your privacy matters to us. This policy explains what data we collect, how we use it, and the choices you have. We are committed to protecting your personal information."
    >
      <Section title="1. Information We Collect">
        <p>We collect the following categories of personal data when you use MindSetTracker:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <strong className="text-txt">Account Information:</strong> Name, email address, and password (stored as a secure hash).
          </li>
          <li>
            <strong className="text-txt">Usage Data:</strong> Habit entries, completion logs, mindset metrics (mood, focus, energy, motivation), and notes you create.
          </li>
          <li>
            <strong className="text-txt">Technical Data:</strong> IP address, browser type, operating system, device information, and session identifiers.
          </li>
          <li>
            <strong className="text-txt">Payment Information:</strong> Processed securely by our payment provider. We do not store full card numbers.
          </li>
          <li>
            <strong className="text-txt">Cookies & Analytics:</strong> Usage patterns to improve the product (see Cookie Policy for details).
          </li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Data">
        <p>We use your personal data to:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Provide, maintain, and improve the MindSetTracker platform.</li>
          <li>Authenticate your account and keep it secure.</li>
          <li>Process subscription payments and manage billing.</li>
          <li>Generate your personalized analytics, reports, and insights.</li>
          <li>Send transactional emails (account confirmations, subscription reminders).</li>
          <li>Respond to support requests and inquiries.</li>
          <li>Detect and prevent fraudulent activity or Terms violations.</li>
          <li>Comply with legal obligations.</li>
        </ul>
        <p>We do <strong className="text-txt">not</strong> sell your personal data to third parties.</p>
      </Section>

      <Section title="3. Data Sharing and Third-Party Services">
        <p>We share your data only in the following limited circumstances:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <strong className="text-txt">Payment Processors:</strong> We use secure, PCI-compliant services (e.g., Stripe) to handle subscription payments. They receive only the information necessary to process transactions.
          </li>
          <li>
            <strong className="text-txt">Cloud Infrastructure:</strong> Our platform is hosted on secure cloud servers. Data is stored with encryption at rest and in transit.
          </li>
          <li>
            <strong className="text-txt">Analytics Services:</strong> We may use anonymized analytics tools to understand general usage patterns. No personally identifiable data is shared with these services.
          </li>
          <li>
            <strong className="text-txt">Legal Requirements:</strong> We may disclose your data if required by law, court order, or government authority.
          </li>
        </ul>
      </Section>

      <Section title="4. Data Security">
        <p>
          We implement industry-standard security measures to protect your data, including:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>TLS/HTTPS encryption for all data in transit.</li>
          <li>AES-256 encryption for sensitive data at rest.</li>
          <li>Bcrypt hashing for all stored passwords.</li>
          <li>Regular security audits and penetration testing.</li>
          <li>Strict access controls — only authorized personnel can access user data.</li>
        </ul>
        <p>
          Despite our best efforts, no system is 100% secure. If you suspect unauthorized access to your account, contact us immediately at{' '}
          <a href="mailto:support@mindsettracker.app" className="text-accent2 hover:underline">support@mindsettracker.app</a>.
        </p>
      </Section>

      <Section title="5. Your Rights">
        <p>Depending on your location, you may have the following rights regarding your personal data:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><strong className="text-txt">Access:</strong> Request a copy of the data we hold about you.</li>
          <li><strong className="text-txt">Rectification:</strong> Correct inaccurate or incomplete data.</li>
          <li><strong className="text-txt">Erasure:</strong> Request deletion of your account and associated data.</li>
          <li><strong className="text-txt">Portability:</strong> Receive your data in a structured, machine-readable format.</li>
          <li><strong className="text-txt">Restriction:</strong> Request that we limit how we process your data.</li>
          <li><strong className="text-txt">Objection:</strong> Object to processing based on legitimate interests.</li>
        </ul>
        <p>
          To exercise any of these rights, email us at{' '}
          <a href="mailto:privacy@mindsettracker.app" className="text-accent2 hover:underline">privacy@mindsettracker.app</a>.
          We will respond within 30 days.
        </p>
      </Section>

      <Section title="6. Data Retention">
        <p>
          We retain your personal data for as long as your account is active. Upon account deletion, we will remove your personal data within 30 days, except where retention is required by law (e.g., financial records may be kept for up to 7 years).
        </p>
      </Section>

      <Section title="7. Children's Privacy">
        <p>
          MindSetTracker is not intended for users under the age of 13. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
        </p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>
          We may update this Privacy Policy periodically. We will notify you via email or an in-app notification at least 14 days before significant changes take effect.
          Continued use of the Service after the effective date constitutes acceptance of the revised policy.
        </p>
      </Section>

      <Section title="9. Contact">
        <p>
          For privacy-related questions or requests, contact our Privacy Team at:{' '}
          <a href="mailto:privacy@mindsettracker.app" className="text-accent2 hover:underline">privacy@mindsettracker.app</a>
        </p>
      </Section>
    </LegalPage>
  );
}
