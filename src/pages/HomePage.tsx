import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Compass,
  Home,
  KeyRound,
  MessageCircle,
  MessageSquareText,
  Quote,
} from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { SafeImage } from '../components/SafeImage';
import { SeoHead } from '../components/SeoHead';
import {
  buildWhatsAppUrl,
  COMPANY_INFO,
  DEFAULT_SITE_CONTENT,
  GENERATED_IMAGES,
} from '../constants/company';
import { SERVICES_LIST, WHY_CHOOSE_US_ITEMS } from '../constants/services';
import { fetchProperties, fetchSiteContent, fetchTestimonials } from '../services/api';
import type { Property, SiteContent, Testimonial } from '../types';

const SERVICE_ICONS = {
  Building2,
  KeyRound,
  Home,
  Compass,
  Briefcase,
  MessageSquareText,
};

export function HomePage() {
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isSampleProps, setIsSampleProps] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isSampleTestimonials, setIsSampleTestimonials] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [contentRes, propRes, testRes] = await Promise.all([
          fetchSiteContent(),
          fetchProperties(false),
          fetchTestimonials(false),
        ]);
        if (!active) return;
        setSiteContent(contentRes);
        const featured = propRes.properties.filter((p) => p.is_featured);
        setFeaturedProperties(
          (featured.length > 0 ? featured : propRes.properties).slice(0, 3)
        );
        setIsSampleProps(propRes.isSampleFallback);
        setTestimonials(testRes.testimonials.slice(0, 3));
        setIsSampleTestimonials(testRes.isSampleFallback);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <SeoHead
        title="Ojoa Global Homes Limited | Real Estate Developer in Abuja"
        description="Discover premium estates, houses for sale, and serviced land opportunities in Abuja with Ojoa Global Homes Limited."
      />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[600px] lg:min-h-[680px] flex items-center bg-[#0B1C3D] overflow-hidden">
        <div className="absolute inset-0">
          <SafeImage
            src={GENERATED_IMAGES.heroVilla}
            alt="Luxury contemporary residential estate villa in Abuja by Ojoa Global Homes Limited"
            loading="eager"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#061024]/90 via-[#0B1C3D]/75 to-[#0B1C3D]/35"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-[#D9BA74] mb-4">
              {COMPANY_INFO.name} · Abuja, Nigeria
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.08] tracking-tight text-balance mb-6">
              {siteContent.hero_heading}
            </h1>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl mb-9">
              {siteContent.hero_subheading}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/properties"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-[#C6A254] px-7 py-3 text-sm font-semibold text-[#061024] hover:bg-[#D9BA74] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Explore Properties</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-[48px] items-center justify-center rounded-sm border border-white/60 bg-white/10 backdrop-blur-sm px-7 py-3 text-sm font-semibold text-white hover:bg-white hover:text-[#0B1C3D] transition-colors whitespace-nowrap shrink-0"
              >
                Contact Us
              </Link>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-[#15803D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0 animate-whatsapp-pump"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Direct</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WELCOME & ABOUT COMPANY */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#A37E2C] mb-3">
                Abuja Estate Developer
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1C3D] leading-tight text-balance mb-5">
                {siteContent.welcome_title}
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-5">
                {siteContent.welcome_body}
              </p>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                {siteContent.about_intro}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-y border-slate-200 mb-8">
                <div>
                  <h3 className="text-sm font-semibold text-[#0B1C3D] mb-1">
                    Our Abuja Office
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {COMPANY_INFO.address}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0B1C3D] mb-1">
                    Direct Consultation
                  </h3>
                  <p className="text-sm text-slate-600 tabular-nums">
                    {COMPANY_INFO.phoneDisplay}
                  </p>
                  <p className="text-sm text-slate-600">{COMPANY_INFO.email}</p>
                </div>
              </div>

              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1C3D] hover:text-[#A37E2C] transition-colors"
                >
                  <span>Read more about Ojoa Global Homes Limited</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[340px] overflow-hidden rounded-sm border border-slate-200 bg-slate-100">
                <SafeImage
                  src={GENERATED_IMAGES.aboutEstate}
                  alt="Well-planned residential estate streetscape in Abuja"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES */}
      <section className="py-16 lg:py-24 bg-[#F7F8FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#A37E2C] mb-2">
                Property Portfolio
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1C3D] text-balance">
                Featured Property Opportunities
              </h2>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1C3D] hover:text-[#A37E2C] transition-colors whitespace-nowrap shrink-0"
            >
              <span>View All Properties</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isSampleProps && (
            <div className="mb-8 rounded-sm border border-[#C6A254]/40 bg-[#F7F1E1]/60 px-5 py-3.5 text-sm text-[#0B1C3D]">
              Showing clearly labelled illustrative sample listings. Verified Abuja listings and official Nigerian Naira prices are published directly via the Administrator Dashboard.
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[440px] rounded-sm border border-slate-200 bg-white animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. OUR SERVICES */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#A37E2C] mb-2">
                What We Do
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1C3D] text-balance">
                Comprehensive Real Estate Services in Abuja
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1C3D] hover:text-[#A37E2C] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Explore All Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_LIST.map((service) => {
              const Icon = SERVICE_ICONS[service.iconName];
              return (
                <div
                  key={service.id}
                  className="flex flex-col justify-between rounded-sm border border-slate-200 bg-white p-7 hover:border-[#C6A254] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-[#0B1C3D] text-[#D9BA74]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-mono text-xs text-slate-400 tabular-nums">
                        {service.index}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-[#0B1C3D] mb-2.5">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {service.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1C3D] hover:text-[#A37E2C] transition-colors"
                    >
                      <span>Make an Enquiry</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="py-16 lg:py-24 bg-[#0B1C3D] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D9BA74] mb-2">
              Our Commitment
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white text-balance">
              Why Choose Ojoa Global Homes Limited
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {WHY_CHOOSE_US_ITEMS.map((item) => (
              <div key={item.index} className="border-t border-white/15 pt-6">
                <div className="flex items-center gap-2.5 text-[#D9BA74] mb-3">
                  <Check className="h-4 w-4 shrink-0" />
                  <span className="font-mono text-xs tabular-nums">{item.index}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER TESTIMONIALS */}
      <section className="py-16 lg:py-24 bg-[#F7F8FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#A37E2C] mb-2">
              Client Feedback
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1C3D] text-balance">
              Customer Testimonials
            </h2>
          </div>

          {isSampleTestimonials && (
            <p className="mb-6 text-sm text-slate-600">
              Verified client testimonials published by the administrator appear here. Below is a clearly labelled illustrative placeholder until verified reviews are added.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <blockquote
                key={item.id}
                className="flex flex-col justify-between rounded-sm border border-slate-200 bg-white p-7"
              >
                <div>
                  <Quote className="h-6 w-6 text-[#C6A254] mb-4" />
                  <p className="text-sm text-slate-700 leading-relaxed mb-6">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <footer className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-semibold text-[#0B1C3D]">
                    {item.client_name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.client_role}
                    {item.is_sample ? ' · Illustrative Sample' : ''}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="py-16 lg:py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#A37E2C] mb-3">
            Start a Conversation
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1C3D] text-balance mb-4">
            Ready to Discuss Abuja Property Opportunities?
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Speak directly with Ojoa Global Homes Limited for verified property availability, site inspection bookings, or estate investment enquiries.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-[#15803D] px-7 py-3 text-sm font-semibold text-white hover:bg-[#166534] transition-colors animate-whatsapp-pump whitespace-nowrap shrink-0"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <Link
              to="/contact"
              className="inline-flex min-h-[48px] items-center justify-center rounded-sm bg-[#0B1C3D] px-7 py-3 text-sm font-semibold text-white hover:bg-[#132B57] transition-colors whitespace-nowrap shrink-0"
            >
              Schedule an Enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
