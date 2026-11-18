import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Eye, MessageCircle, ShieldCheck } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { SeoHead } from '../components/SeoHead';
import {
  buildWhatsAppUrl,
  COMPANY_INFO,
  DEFAULT_SITE_CONTENT,
  GENERATED_IMAGES,
} from '../constants/company';
import { fetchSiteContent } from '../services/api';
import type { SiteContent } from '../types';

const COMPANY_VALUES = [
  {
    title: 'Transparency',
    description:
      'Clear communication regarding property location, availability, documentation steps, and acquisition terms.',
  },
  {
    title: 'Dependability',
    description:
      'Consistent professional guidance from initial property enquiry through site inspection and closing.',
  },
  {
    title: 'Thoughtful Planning',
    description:
      'Focus on residential estates and property opportunities designed for functional living and long-term value.',
  },
  {
    title: 'Client Care',
    description:
      'Responsive support tailored to families, homeowners, and investors across Abuja and the diaspora.',
  },
];

export function AboutPage() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    fetchSiteContent().then(setContent).catch(() => {});
  }, []);

  return (
    <>
      <SeoHead
        title="About Us | Ojoa Global Homes Limited — Abuja Real Estate Developer"
        description="Learn about Ojoa Global Homes Limited, an Abuja-based real estate development company focused on premium estates and property opportunities."
      />

      {/* Page Header */}
      <section className="bg-[#0B1C3D] text-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#D9BA74] mb-3">
            About {COMPANY_INFO.name}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white leading-tight max-w-3xl text-balance mb-6">
            {content.about_heading}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            {content.about_intro}
          </p>
        </div>
      </section>

      {/* Company Introduction + Photography */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <div className="lg:col-span-6">
              <div className="h-full min-h-[340px] rounded-sm overflow-hidden border border-slate-200 bg-slate-100">
                <SafeImage
                  src={GENERATED_IMAGES.aboutEstate}
                  alt="Residential estate architecture developed in Abuja"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#A37E2C] mb-3">
                Who We Are
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1C3D] mb-5 text-balance">
                An Abuja-Based Real Estate Developer Focused on Long-Term Value
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-4">
                {content.welcome_body}
              </p>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                Operating from our office at {COMPANY_INFO.address}, we work closely with homebuyers and property investors seeking residential homes, serviced estate plots, and commercial real estate opportunities within Abuja.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/properties"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-[#0B1C3D] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#132B57] transition-colors"
                >
                  <span>Browse Properties</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-slate-300 px-6 py-2.5 text-sm font-semibold text-[#0B1C3D] hover:border-[#15803D] hover:text-[#15803D] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Speak With Our Team</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 lg:py-20 bg-[#F7F8FA] border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-sm border border-slate-200 bg-white p-8">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-[#0B1C3D] text-[#D9BA74] mb-5">
                <Eye className="h-5 w-5" />
              </div>
              <h2 className="font-display text-3xl font-semibold text-[#0B1C3D] mb-3">
                Our Vision
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                {content.about_vision}
              </p>
            </div>

            <div className="rounded-sm border border-slate-200 bg-white p-8">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-[#0B1C3D] text-[#D9BA74] mb-5">
                <Compass className="h-5 w-5" />
              </div>
              <h2 className="font-display text-3xl font-semibold text-[#0B1C3D] mb-3">
                Our Mission
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                {content.about_mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#A37E2C] mb-2">
                Guiding Principles
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1C3D] mb-8 text-balance">
                Company Values That Guide Every Project
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {COMPANY_VALUES.map((value) => (
                  <div
                    key={value.title}
                    className="rounded-sm border border-slate-200 p-6 bg-white"
                  >
                    <ShieldCheck className="h-5 w-5 text-[#C6A254] mb-3" />
                    <h3 className="text-base font-semibold text-[#0B1C3D] mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-[4/3] rounded-sm overflow-hidden border border-slate-200 bg-slate-100">
                <SafeImage
                  src={GENERATED_IMAGES.detachedHouse}
                  alt="Modern luxury residential architecture in Abuja"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
