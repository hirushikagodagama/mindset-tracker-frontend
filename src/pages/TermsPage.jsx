import { LegalPage, Section } from '../components/LegalLayout';

export default function TermsPage() {
  return (
    <LegalPage
      badge="Legal"
      badgeColor="accent"
      title="Terms and Conditions"
      lastUpdated="March 19, 2026"
      intro="Please read these Terms and Conditions carefully before using MindSetTracker. By accessing or using our service, you agree to be bound by these terms."
    >
      <Section title="1. Acceptance of Terms">
        <p>
          By creating an account or using the MindSetTracker platform ("Service"), you agree to these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use the Service.
        </p>
        <p>
          MindSetTracker reserves the right to update these Terms at any time. Continued use of the Service after changes constitutes your acceptance of the updated Terms.
        </p>
      </Section>

      <Section title="2. User Responsibilities">
        <p>You agree to:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Provide accurate and complete information when creating your account.</li>
          <li>Maintain the security of your account credentials and not share them with others.</li>
          <li>Use the Service only for lawful, personal, non-commercial purposes.</li>
          <li>Not attempt to reverse-engineer, hack, or interfere with the platform.</li>
          <li>Not upload or transmit harmful, offensive, or unlawful content.</li>
          <li>Notify us immediately of any unauthorized use of your account.</li>
        </ul>
      </Section>

      <Section title="3. Free Trial Terms">
        <p>
          New users receive a <strong className="text-txt">30-day free trial</strong> with full access to all features. No credit card is required to begin the trial.
        </p>
        <p>
          After the trial period expires, continued access requires a paid monthly subscription. You will be notified before the trial ends. Features will be restricted upon trial expiry if no subscription is activated.
        </p>
        <p>
          The free trial is available once per person. Creating multiple accounts to access additional free trials is a violation of these Terms and may result in account suspension.
        </p>
      </Section>

      <Section title="4. Subscription Rules">
        <p>
          After the free trial, MindSetTracker operates on a monthly subscription model. Subscriptions automatically renew each month unless cancelled.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Subscription fees are charged at the beginning of each billing cycle.</li>
          <li>You may cancel your subscription at any time from your account settings.</li>
          <li>Cancellation takes effect at the end of your current billing period.</li>
          <li>Pricing is subject to change with 30 days' advance notice.</li>
          <li>All prices are listed in USD and are exclusive of applicable taxes.</li>
        </ul>
      </Section>

      <Section title="5. Payment Policies">
        <p>
          Payments are processed securely through our third-party payment processor. MindSetTracker does not store your complete payment card information.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Failed payments may result in temporary suspension of your account.</li>
          <li>You authorize us to charge your payment method on a recurring basis.</li>
          <li>Disputed charges must be raised within 30 days of the transaction date.</li>
          <li>We accept major credit cards and other payment methods as displayed at checkout.</li>
        </ul>
      </Section>

      <Section title="6. Account Termination">
        <p>
          We reserve the right to suspend or terminate your account without notice if:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>You violate any provision of these Terms.</li>
          <li>We detect fraudulent or unauthorized use of your account.</li>
          <li>Your subscription payment fails and is not resolved within 7 days.</li>
          <li>We reasonably believe your activity harms other users or the platform.</li>
        </ul>
        <p>
          You may terminate your account at any time by contacting <a href="mailto:support@mindsettracker.app" className="text-accent hover:underline">support@mindsettracker.app</a>. Upon termination, your data may be deleted in accordance with our Privacy Policy.
        </p>
      </Section>

      <Section title="7. Intellectual Property">
        <p>
          All content, design, logos, and software on MindSetTracker are the property of MindSetTracker and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
        </p>
        <p>
          Your personal data (habits, notes, mindset entries) remains your own. You grant us a limited license to process and store your data solely to provide the Service.
        </p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>
          MindSetTracker is provided "as is" without warranties of any kind. To the fullest extent permitted by law, we disclaim all liability for indirect, incidental, or consequential damages arising from your use of the Service.
        </p>
      </Section>

      <Section title="9. Governing Law">
        <p>
          These Terms are governed by applicable law. Any disputes arising from these Terms shall be resolved through good-faith negotiation or, if necessary, binding arbitration.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          For questions regarding these Terms, contact us at:{' '}
          <a href="mailto:support@mindsettracker.app" className="text-accent hover:underline">support@mindsettracker.app</a>
        </p>
      </Section>
    </LegalPage>
  );
}
