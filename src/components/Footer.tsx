import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, COMPANY_INFO } from '../constants/company';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer className="bg-[#0B1C3D] text-slate-200 border-t border-[#132B57]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <BrandLogo variant="light" />
            <p className="text-sm leading-relaxed text-slate-300 max-w-xs">
              {COMPANY_INFO.description}
            </p>
            <p className="text-xs text-[#D9BA74] font-medium">
              {COMPANY_INFO.website}
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/" className="hover:text-[#D9BA74] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#D9BA74] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#D9BA74] transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-[#D9BA74] transition-colors">
                  Properties in Abuja
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#D9BA74] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide mb-4">
              Property Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link
                  to="/properties?category=Houses"
                  className="hover:text-[#D9BA74] transition-colors"
                >
                  Houses for Sale in Abuja
                </Link>
              </li>
              <li>
                <Link
                  to="/properties?category=Land"
                  className="hover:text-[#D9BA74] transition-colors"
                >
                  Land for Sale in Abuja
                </Link>
              </li>
              <li>
                <Link
                  to="/properties?category=Apartments"
                  className="hover:text-[#D9BA74] transition-colors"
                >
                  Luxury Apartments
                </Link>
              </li>
              <li>
                <Link
                  to="/properties?category=Commercial%20Properties"
                  className="hover:text-[#D9BA74] transition-colors"
                >
                  Commercial Properties
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide mb-4">
              Abuja Office
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#C6A254] shrink-0 mt-1" />
                <span className="leading-relaxed">{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#C6A254] shrink-0" />
                <a
                  href={`tel:${COMPANY_INFO.phoneRaw}`}
                  className="hover:text-[#D9BA74] transition-colors tabular-nums"
                >
                  {COMPANY_INFO.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-[#C6A254] shrink-0" />
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D9BA74] transition-colors tabular-nums"
                >
                  WhatsApp: {COMPANY_INFO.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#C6A254] shrink-0" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="hover:text-[#D9BA74] transition-colors break-all"
                >
                  {COMPANY_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/properties" className="hover:text-white transition-colors">
              Property Listings
            </Link>
            <Link to="/admin/login" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
