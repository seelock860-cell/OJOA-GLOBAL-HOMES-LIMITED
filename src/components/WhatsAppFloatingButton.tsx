import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { buildWhatsAppUrl } from '../constants/company';

export function WhatsAppFloatingButton() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <div className="relative inline-flex items-center justify-center">
        {isHome && (
          <span
            className="pointer-events-none absolute inset-0 rounded-full bg-[#16A34A] animate-whatsapp-ring"
            aria-hidden="true"
          />
        )}
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Ojoa Global Homes Limited on WhatsApp"
          className={`relative inline-flex h-12 sm:h-13 items-center gap-2.5 rounded-full bg-[#15803D] hover:bg-[#166534] text-white px-4 sm:px-5 shadow-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A254] ${
            isHome ? 'animate-whatsapp-pump' : ''
          }`}
        >
          <MessageCircle className="h-5 w-5 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0">
            WhatsApp Us
          </span>
        </a>
      </div>
    </div>
  );
}
