import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  const handleHashLink = (e, href) => {
    if (href.startsWith('/#') && location.pathname === '/') {
      e.preventDefault();
      const id = href.replace('/#', '');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-bg/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/30'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple flex items-center justify-center shadow-lg shadow-accent/30">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-base tracking-tight">
              <span className="text-txt">MindSet</span>
              <span className="bg-gradient-to-r from-accent to-purple bg-clip-text text-transparent">Tracker</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => handleHashLink(e, href)}
                className="px-4 py-2 text-sm text-txt2 hover:text-txt rounded-lg hover:bg-white/5 transition-all duration-150"
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-txt2 hover:text-txt rounded-lg hover:bg-white/5 transition-all duration-150"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-all duration-150 shadow-lg shadow-accent/25"
            >
              Sign Up
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-txt2 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-0.5 bg-txt2 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-txt2 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-72 bg-bg2 border-l border-white/10 flex flex-col pt-20 pb-8 px-6 transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={(e) => { handleHashLink(e, href); setMenuOpen(false); }}
                className="px-4 py-3 text-sm text-txt2 hover:text-txt rounded-lg hover:bg-white/5 transition-all"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <Link
              to="/login"
              className="w-full px-4 py-3 text-sm text-center text-txt2 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="w-full px-4 py-3 text-sm text-center font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-all shadow-lg shadow-accent/25"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
