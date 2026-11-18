import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/properties', label: 'Properties' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A254] rounded-sm"
          aria-label="Ojoa Global Homes Limited Home"
        >
          <BrandLogo variant="dark" />
        </Link>

        {/* Zone 2: 5 Clean Single-Line Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  isActive
                    ? 'text-[#0B1C3D] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C6A254]'
                    : 'text-slate-600 hover:text-[#0B1C3D]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center justify-center rounded-sm bg-[#0B1C3D] px-5 py-2.5 text-xs font-semibold tracking-wide text-white hover:bg-[#132B57] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A254]"
          >
            Enquire Now
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex lg:hidden h-11 w-11 items-center justify-center rounded-sm border border-slate-200 text-[#0B1C3D] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A254]"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pb-5 pt-3">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex min-h-[44px] items-center px-3 text-sm font-medium rounded-sm transition-colors ${
                    isActive
                      ? 'bg-[#F4F6F9] text-[#0B1C3D] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#0B1C3D]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-3 mt-2 border-t border-slate-100">
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] w-full items-center justify-center rounded-sm bg-[#0B1C3D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#132B57] transition-colors"
              >
                Enquire Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
