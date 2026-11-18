import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  MapPin,
  Maximize2,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { SeoHead } from '../components/SeoHead';
import {
  buildPropertyWhatsAppUrl,
  buildWhatsAppUrl,
  COMPANY_INFO,
  formatNairaPrice,
} from '../constants/company';
import { fetchPropertyById, submitEnquiry } from '../services/api';
import type { Property } from '../types';

export function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showContactForm, setShowContactForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      if (!id) return;
      setLoading(true);
      const result = await fetchPropertyById(id);
      if (!active) return;
      setProperty(result);
      setActiveImageIndex(0);
      if (result) {
        setMessage(
          `Hello Ojoa Global Homes Limited. I would like more details and inspection availability for "${result.title}".`
        );
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleAgentEnquiry(e: FormEvent) {
    e.preventDefault();
    if (!property) return;
    setFormError('');
    setFormFeedback('');

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setFormError('Please provide your full name, phone number, and email address.');
      return;
    }

    setSubmitting(true);
    try {
      await submitEnquiry({
        full_name: fullName,
        phone,
        email,
        property_id: property.id,
        property_interest: property.title,
        message,
      });

      const waMessage = `Hello Ojoa Global Homes Limited. My name is ${fullName.trim()} (${phone.trim()}, ${email.trim()}). I am enquiring about "${property.title}". ${message.trim()}`;
      setFormFeedback('Enquiry prepared. Opening WhatsApp to connect you with our team.');
      window.location.href = buildWhatsAppUrl(waMessage);
    } catch {
      setFormError('Unable to send enquiry. Please try our direct WhatsApp button.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="h-96 w-full rounded-sm bg-slate-100 animate-pulse mb-8" />
        <div className="h-8 w-1/2 rounded-sm bg-slate-100 animate-pulse mb-4" />
        <div className="h-24 w-full rounded-sm bg-slate-100 animate-pulse" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-[#0B1C3D] mb-3">
          Property Not Found
        </h1>
        <p className="text-slate-600 mb-6">
          The requested property listing may have been removed or updated.
        </p>
        <Link
          to="/properties"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-[#0B1C3D] px-6 py-2.5 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Properties</span>
        </Link>
      </div>
    );
  }

  const images = property.images || [];
  const activeImage = images[activeImageIndex]?.image_url;

  return (
    <>
      <SeoHead
        title={`${property.title} | Ojoa Global Homes Limited`}
        description={property.short_description}
      />

      <div className="bg-[#F7F8FA] min-h-screen py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0B1C3D] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Properties</span>
            </Link>
          </div>

          {property.is_sample && (
            <div className="mb-6 rounded-sm border border-[#C6A254]/40 bg-[#F7F1E1]/70 px-5 py-3.5 text-sm text-[#0B1C3D]">
              <strong>Illustrative Sample Listing:</strong> Sample specifications and pricing are shown for demonstration until verified Abuja property details are published.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Gallery + Details Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Image Gallery */}
              <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
                <div className="aspect-[16/10] bg-slate-100">
                  <SafeImage
                    src={activeImage}
                    alt={`${property.title} gallery photo ${activeImageIndex + 1}`}
                    fallbackLabel={property.title}
                    loading="eager"
                    className="h-full w-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-3 overflow-x-auto">
                    {images.map((img, idx) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        aria-label={`View photo ${idx + 1}`}
                        className={`h-16 w-24 shrink-0 overflow-hidden rounded-sm border-2 transition-colors ${
                          idx === activeImageIndex
                            ? 'border-[#C6A254]'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <SafeImage
                          src={img.image_url}
                          alt={img.alt_text || `${property.title} thumbnail ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Overview */}
              <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-3">
                  <span className="text-[#0B1C3D]">{property.category_name}</span>
                  <span aria-hidden="true">·</span>
                  <span>{property.status}</span>
                  {property.is_sample && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#A37E2C]">Illustrative Sample</span>
                    </>
                  )}
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1C3D] mb-3 text-balance">
                  {property.title}
                </h1>

                <p className="flex items-center gap-2 text-sm text-slate-600 mb-6">
                  <MapPin className="h-4 w-4 text-[#C6A254] shrink-0" />
                  <span>{property.location}</span>
                </p>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-slate-200 mb-7">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Property Type</p>
                    <p className="text-sm font-semibold text-[#0B1C3D]">
                      {property.category_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Bedrooms</p>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-[#0B1C3D] tabular-nums">
                      <BedDouble className="h-4 w-4 text-[#C6A254]" />
                      <span>{property.bedrooms ?? 'N/A'}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Bathrooms</p>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-[#0B1C3D] tabular-nums">
                      <Bath className="h-4 w-4 text-[#C6A254]" />
                      <span>{property.bathrooms ?? 'N/A'}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Property Size</p>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-[#0B1C3D] tabular-nums">
                      <Maximize2 className="h-4 w-4 text-[#C6A254]" />
                      <span>{property.size_sqm || 'On Request'}</span>
                    </p>
                  </div>
                </div>

                <h2 className="font-display text-2xl font-semibold text-[#0B1C3D] mb-3">
                  Property Description
                </h2>
                <p className="text-base text-slate-600 leading-relaxed whitespace-pre-line mb-8">
                  {property.description}
                </p>

                {property.features && property.features.length > 0 && (
                  <>
                    <h2 className="font-display text-2xl font-semibold text-[#0B1C3D] mb-4">
                      Key Features & Highlights
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {property.features.map((feat, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-slate-700"
                        >
                          <Check className="h-4 w-4 text-[#C6A254] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Sticky Action & Enquiry Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-7 lg:sticky lg:top-24">
                <p className="text-xs font-medium text-slate-500 mb-1">
                  Price (Nigerian Naira)
                </p>
                <p className="font-mono text-2xl font-semibold text-[#0B1C3D] tabular-nums mb-2">
                  {formatNairaPrice(property.price, property.price_label, property.is_sample)}
                </p>
                <p className="text-xs text-slate-600 mb-6">
                  Availability: <span className="font-semibold text-[#0B1C3D]">{property.status}</span>
                </p>

                <div className="space-y-3">
                  <a
                    href={buildPropertyWhatsAppUrl(property.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-sm bg-[#15803D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#166534] transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp Enquiry</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setShowContactForm((prev) => !prev)}
                    className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-sm bg-[#0B1C3D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#132B57] transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    <span>Contact Agent</span>
                  </button>

                  <a
                    href={`tel:${COMPANY_INFO.phoneRaw}`}
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm border border-slate-300 px-5 py-2.5 text-sm font-semibold text-[#0B1C3D] hover:border-[#0B1C3D] transition-colors tabular-nums"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call {COMPANY_INFO.phoneDisplay}</span>
                  </a>
                </div>

                {showContactForm && (
                  <form
                    onSubmit={handleAgentEnquiry}
                    className="mt-6 pt-6 border-t border-slate-200 space-y-4"
                  >
                    <h3 className="text-sm font-semibold text-[#0B1C3D]">
                      Request Details or Inspection
                    </h3>
                    {formError && (
                      <p className="text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-sm">
                        {formError}
                      </p>
                    )}
                    {formFeedback && (
                      <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-sm">
                        {formFeedback}
                      </p>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Message
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full min-h-[42px] rounded-sm bg-[#C6A254] px-4 py-2 text-xs font-semibold text-[#061024] hover:bg-[#D9BA74] transition-colors disabled:opacity-60"
                    >
                      {submitting ? 'Preparing WhatsApp...' : 'Send via WhatsApp'}
                    </button>
                  </form>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
