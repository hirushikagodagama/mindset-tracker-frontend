import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-txt mb-4 pb-3 border-b border-white/10">{title}</h2>
      <div className="text-txt2 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

function LegalPage({ badge, badgeColor = 'accent', title, lastUpdated, intro, children }) {
  const colorMap = {
    accent: 'bg-accent/10 text-accent border-accent/20',
    accent2: 'bg-accent2/10 text-accent2 border-accent2/20',
    purple: 'bg-purple/10 text-purple border-purple/20',
    teal: 'bg-teal/10 text-teal border-teal/20',
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <span className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest rounded-full border mb-4 ${colorMap[badgeColor]}`}>
              {badge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold text-txt tracking-tight mb-4">{title}</h1>
            <p className="text-txt3 text-sm">Last updated: {lastUpdated}</p>
            {intro && <p className="mt-4 text-txt2 text-sm leading-relaxed">{intro}</p>}
          </div>

          {/* Content */}
          <div className="bg-bg2 border border-white/10 rounded-2xl p-8 sm:p-10">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export { LegalPage, Section };
