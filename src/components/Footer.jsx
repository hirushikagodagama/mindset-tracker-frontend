import { Link } from 'react-router-dom';

const LEGAL_LINKS = [
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Refund Policy', to: '/refund' },
  { label: 'Cookie Policy', to: '/cookies' },
];

export default function Footer() {
  return (
    <footer className="bg-bg2 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple flex items-center justify-center shadow-lg shadow-accent/30">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-base tracking-tight">
                <span className="text-txt">MindSet</span>
                <span className="bg-gradient-to-r from-accent to-purple bg-clip-text text-transparent">Tracker</span>
              </span>
            </Link>
            <p className="text-txt3 text-sm leading-relaxed max-w-xs">
              Track habits, monitor your mindset, and build a better life — one day at a time.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs text-txt3 uppercase tracking-widest font-semibold mb-4">Legal</h3>
            <ul className="flex flex-col gap-2.5">
              {LEGAL_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-txt2 hover:text-txt transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs text-txt3 uppercase tracking-widest font-semibold mb-4">Contact</h3>
            <a
              href="mailto:support@mindsettracker.app"
              className="text-sm text-txt2 hover:text-accent transition-colors duration-150"
            >
              support@mindsettracker.app
            </a>
            <p className="text-txt3 text-xs mt-4 leading-relaxed">
              Have a question or need help?<br />
              We respond within 24 hours.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-txt3 text-xs">
            &copy; {new Date().getFullYear()} MindSetTracker. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {LEGAL_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-xs text-txt3 hover:text-txt2 transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
