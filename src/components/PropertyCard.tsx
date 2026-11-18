import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, MessageCircle } from 'lucide-react';
import { buildPropertyWhatsAppUrl, formatNairaPrice } from '../constants/company';
import type { Property } from '../types';
import { SafeImage } from './SafeImage';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const primaryImage =
    property.images?.find((img) => img.is_primary)?.image_url ||
    property.images?.[0]?.image_url;

  const statusTextColor =
    property.status === 'Available'
      ? 'text-[#15803D]'
      : property.status === 'Under Offer'
        ? 'text-[#B45309]'
        : property.status === 'Sold'
          ? 'text-slate-500'
          : 'text-[#0B1C3D]';

  return (
    <article className="group flex flex-col bg-white border border-slate-200 rounded-sm overflow-hidden transition-colors duration-150 hover:border-[#C6A254]">
      <Link to={`/properties/${property.id}`} className="block aspect-[4/3] overflow-hidden bg-slate-100">
        <SafeImage
          src={primaryImage}
          alt={`${property.title} — ${property.location}`}
          fallbackLabel={property.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        {/* Zero-pill clean unboxed metadata with typographic separators */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-2">
          <span className="text-[#0B1C3D]">{property.category_name}</span>
          <span aria-hidden="true">·</span>
          <span className={statusTextColor}>{property.status}</span>
          {property.is_sample && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[#A37E2C]">Illustrative Sample</span>
            </>
          )}
        </div>

        <h3 className="font-display text-2xl font-semibold text-[#0B1C3D] leading-snug mb-2">
          <Link
            to={`/properties/${property.id}`}
            className="hover:text-[#A37E2C] transition-colors"
          >
            {property.title}
          </Link>
        </h3>

        <p className="flex items-start gap-1.5 text-xs text-slate-600 mb-3">
          <MapPin className="h-3.5 w-3.5 text-[#C6A254] shrink-0 mt-0.5" />
          <span>{property.location}</span>
        </p>

        <p className="font-mono text-base font-semibold text-[#0B1C3D] tabular-nums mb-3">
          {formatNairaPrice(property.price, property.price_label, property.is_sample)}
        </p>

        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-5 flex-1">
          {property.short_description}
        </p>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <Link
            to={`/properties/${property.id}`}
            className="inline-flex flex-1 min-h-[42px] items-center justify-center gap-1.5 rounded-sm bg-[#0B1C3D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#132B57] transition-colors whitespace-nowrap shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <a
            href={buildPropertyWhatsAppUrl(property.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-sm border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1C3D] hover:border-[#15803D] hover:text-[#15803D] transition-colors whitespace-nowrap shrink-0"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp Enquiry</span>
          </a>
        </div>
      </div>
    </article>
  );
}
