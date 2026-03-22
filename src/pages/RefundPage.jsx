import { LegalPage, Section } from '../components/LegalLayout';

export default function RefundPage() {
  return (
    <LegalPage
      badge="Legal"
      badgeColor="purple"
      title="Refund Policy"
      lastUpdated="March 19, 2026"
      intro="We want you to be fully satisfied with MindSetTracker. This policy explains when and how you may be eligible for a refund."
    >
      <Section title="1. Overview">
        <p>
          MindSetTracker offers a <strong className="text-txt">30-day free trial</strong> so you can thoroughly evaluate the Service before committing to a paid subscription. Refund eligibility is governed by the terms below.
        </p>
      </Section>

      <Section title="2. Free Trial Period">
        <p>
          No payment is collected during the 30-day free trial. The trial period begins immediately upon account creation and provides full access to all features.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>There is no charge associated with the free trial — therefore no refund is applicable for this period.</li>
          <li>The trial is valid for new accounts only. One trial per person.</li>
          <li>You will be notified before the trial expires with a reminder to subscribe or let it lapse.</li>
        </ul>
      </Section>

      <Section title="3. Subscription Payments">
        <p>
          After the free trial, a monthly subscription fee is charged at the start of each billing cycle. Payments are non-refundable in most circumstances because:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Full access to all features is provided from the moment of payment.</li>
          <li>The 30-day free trial is explicitly provided for evaluation purposes.</li>
          <li>Digital services, once provided, are generally non-refundable under standard digital goods policies.</li>
        </ul>
      </Section>

      <Section title="4. Refund Eligibility">
        <p>We will consider refund requests under the following exceptional circumstances:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <strong className="text-txt">Technical Failure:</strong> A documented, platform-side failure prevented you from accessing core features for more than 72 consecutive hours, and you reported the issue to support without resolution.
          </li>
          <li>
            <strong className="text-txt">Duplicate Charge:</strong> You were charged more than once for the same billing cycle due to a payment processing error.
          </li>
          <li>
            <strong className="text-txt">Unauthorized Transaction:</strong> A charge occurred on your account that you did not authorize, and you notify us within 30 days of the charge.
          </li>
          <li>
            <strong className="text-txt">Goodwill Refund:</strong> In rare cases, we may offer a goodwill refund at our discretion for your first subscription month if you are genuinely dissatisfied and contact us within 7 days of your first charge.
          </li>
        </ul>
        <p>
          Refunds are <strong className="text-txt">not</strong> provided for: forgetting to cancel before renewal, partial month usage, or dissatisfaction after extended use without contacting support.
        </p>
      </Section>

      <Section title="5. Cancellation Policy">
        <p>
          You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period — you retain full access until that date.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Cancellation does <strong className="text-txt">not</strong> automatically entitle you to a refund for the current period.</li>
          <li>Your data is retained for 30 days after account closure, then permanently deleted.</li>
          <li>You may reactivate a cancelled account at any time within 30 days without losing data.</li>
        </ul>
      </Section>

      <Section title="6. How to Request a Refund">
        <p>To request a refund, follow these steps:</p>
        <ol className="list-decimal pl-5 space-y-2 mt-2">
          <li>Email us at <a href="mailto:billing@mindsettracker.app" className="text-purple hover:underline">billing@mindsettracker.app</a> with the subject line "Refund Request".</li>
          <li>Include your registered email address, the charge date, and the reason for your request.</li>
          <li>We will review your request within 5 business days.</li>
          <li>If approved, the refund will be processed to your original payment method within 7–10 business days.</li>
        </ol>
      </Section>

      <Section title="7. Chargebacks">
        <p>
          If you initiate a chargeback with your bank without first contacting us, we reserve the right to suspend your account pending resolution. We strongly encourage you to contact us first — we are committed to resolving legitimate billing issues promptly.
        </p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>
          We may update this Refund Policy with 14 days' advance notice. Continued use of the Service after changes take effect constitutes acceptance.
        </p>
      </Section>

      <Section title="9. Contact">
        <p>
          For refund-related enquiries:{' '}
          <a href="mailto:billing@mindsettracker.app" className="text-purple hover:underline">billing@mindsettracker.app</a>
        </p>
      </Section>
    </LegalPage>
  );
}
