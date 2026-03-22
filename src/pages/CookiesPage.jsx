import { LegalPage, Section } from '../components/LegalLayout';

const COOKIE_TABLE = [
  { name: 'auth_token', type: 'Essential', purpose: 'Keeps you logged in during your session.', duration: 'Session / 30 days' },
  { name: 'preferences', type: 'Functional', purpose: 'Stores your UI preferences (theme, language).', duration: '12 months' },
  { name: '_ga', type: 'Analytics', purpose: 'Google Analytics — tracks usage patterns anonymously.', duration: '24 months' },
  { name: 'stripe_sid', type: 'Payment', purpose: 'Stripe session identifier for secure payment processing.', duration: 'Session' },
  { name: 'csrf_token', type: 'Security', purpose: 'Prevents cross-site request forgery attacks.', duration: 'Session' },
];

export default function CookiesPage() {
  return (
    <LegalPage
      badge="Legal"
      badgeColor="teal"
      title="Cookie Policy"
      lastUpdated="March 19, 2026"
      intro="This Cookie Policy explains what cookies are, how MindSetTracker uses them, and how you can manage your cookie preferences."
    >
      <Section title="1. What Are Cookies?">
        <p>
          Cookies are small text files stored on your device (computer, tablet, or smartphone) when you visit a website. They allow the website to recognize your device and remember information about your visit — such as your preferences or login status.
        </p>
        <p>
          Cookies are not harmful and do not contain personally identifiable information by themselves. They are a standard tool used by virtually all modern websites to improve user experience and gather analytics.
        </p>
      </Section>

      <Section title="2. Types of Cookies We Use">
        <p>MindSetTracker uses the following categories of cookies:</p>

        <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-bg3">
                <th className="text-left px-4 py-3 text-txt3 font-semibold uppercase tracking-wider">Cookie</th>
                <th className="text-left px-4 py-3 text-txt3 font-semibold uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-txt3 font-semibold uppercase tracking-wider">Purpose</th>
                <th className="text-left px-4 py-3 text-txt3 font-semibold uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody>
              {COOKIE_TABLE.map((row, i) => (
                <tr key={row.name} className={i % 2 === 0 ? 'bg-bg2' : 'bg-bg3/50'}>
                  <td className="px-4 py-3 font-mono text-teal">{row.name}</td>
                  <td className="px-4 py-3 text-txt2">{row.type}</td>
                  <td className="px-4 py-3 text-txt2">{row.purpose}</td>
                  <td className="px-4 py-3 text-txt3">{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="3. Essential Cookies">
        <p>
          These cookies are strictly necessary for the Service to function. They enable core functionality such as authentication and security. Without them, the Service cannot operate properly.
        </p>
        <p>
          Essential cookies cannot be disabled. They do not track you for marketing purposes and are not used to infer preferences about you.
        </p>
      </Section>

      <Section title="4. Functional Cookies">
        <p>
          Functional cookies remember your preferences to personalize your experience. For example, they store your dashboard theme preference so you don't have to reset it each visit.
        </p>
        <p>
          These cookies can be disabled, but doing so may affect the functionality and user experience of the platform.
        </p>
      </Section>

      <Section title="5. Analytics Cookies">
        <p>
          We use analytics cookies to understand how users interact with MindSetTracker — which features are used most, where users encounter friction, and how we can improve the platform.
        </p>
        <p>
          Analytics data is collected in an <strong className="text-txt">aggregated and anonymized</strong> form. We use Google Analytics for this purpose. You can opt out of Google Analytics by installing the{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="text-teal hover:underline">Google Analytics Opt-out Browser Add-on</a>.
        </p>
      </Section>

      <Section title="6. Payment Cookies">
        <p>
          Cookies set by our payment processor (Stripe) are used solely to secure and facilitate payment transactions. These cookies ensure that payments are processed safely and help prevent fraud. They are governed by{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer" className="text-teal hover:underline">Stripe's Privacy Policy</a>.
        </p>
      </Section>

      <Section title="7. How to Manage Cookies">
        <p>You can control and manage cookies in several ways:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <strong className="text-txt">Browser Settings:</strong> Most browsers allow you to view, block, or delete cookies via their privacy or settings menu. Refer to your browser's help documentation for instructions.
          </li>
          <li>
            <strong className="text-txt">Opt-Out Links:</strong> Use the Google Analytics opt-out tool linked above to prevent analytics tracking.
          </li>
          <li>
            <strong className="text-txt">Do Not Track:</strong> Some browsers send a "Do Not Track" signal. While we respect user privacy, our platform may not fully respond to DNT signals for all non-essential cookies.
          </li>
        </ul>
        <p>
          Note: Blocking all cookies may prevent some features of MindSetTracker from working correctly, particularly login and preference persistence.
        </p>
      </Section>

      <Section title="8. Third-Party Cookies">
        <p>
          Some cookies on our platform are set by third-party services (such as Google Analytics and Stripe). We do not control these cookies. Please refer to the respective third-party privacy policies for more information:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-teal hover:underline">Google Analytics Privacy Policy</a></li>
          <li><a href="https://stripe.com/privacy" target="_blank" rel="noreferrer" className="text-teal hover:underline">Stripe Privacy Policy</a></li>
        </ul>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>
          We may update this Cookie Policy from time to time. Any material changes will be communicated via in-app notification or email at least 14 days before taking effect.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          For questions about our cookie practices:{' '}
          <a href="mailto:privacy@mindsettracker.app" className="text-teal hover:underline">privacy@mindsettracker.app</a>
        </p>
      </Section>
    </LegalPage>
  );
}
