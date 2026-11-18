import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Compass,
  Home,
  KeyRound,
  MessageCircle,
  MessageSquareText,
} from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { buildWhatsAppUrl } from '../constants/company';
import { SERVICES_LIST } from '../constants/services';

const SERVICE_ICONS = {
  Building2,
  KeyRound,
  Home,
  Compass,
  Briefcase,
  MessageSquareText,
};

export function ServicesPage() {
  return (
    <>
      <SeoHead
        title="Our Services | Ojoa Global Homes Limited — Abuja Real Estate"
        description="Estate development, property sales, residential properties, land investment opportunities, consultation, and enquiries in Abuja."
      />

      <section className="bg-[#0B1C3D] text-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#D9BA74] mb-3">
            Our Services
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white leading-tight max-w-3xl text-balance mb-5">
            Structured Real Estate Development & Advisory in Abuja
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            From estate planning and residential sales to strategic land investment and dedicated property enquiries, our services support confident real estate decisions.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[#F7F8FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {SERVICES_LIST.map((service) => {
              const Icon = SERVICE_ICONS[service.iconName];
              const serviceWaUrl = buildWhatsAppUrl(
                `Hello Ojoa Global Homes Limited. I would like to enquire about your ${service.title} service.`
              );

              return (
                <article
                  key={service.id}
                  className="flex flex-col justify-between rounded-sm border border-slate-200 bg-white p-8 hover:border-[#C6A254] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-[#0B1C3D] text-[#D9BA74]">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="font-mono text-xs text-slate-400 tabular-nums">
                        {service.index}
                      </span>
                    </div>

                    <h2 className="font-display text-2xl font-semibold text-[#0B1C3D] mb-3">
                      {service.title}
                    </h2>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed mb-3">
                      {service.summary}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {service.details}
                    </p>
                  </div>

                  <div className="mt-7 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
                    <a
                      href={serviceWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 min-h-[42px] items-center justify-center gap-1.5 rounded-sm bg-[#0B1C3D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#132B57] transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>WhatsApp Enquiry</span>
                    </a>
                    <Link
                      to="/contact"
                      className="inline-flex min-h-[42px] items-center justify-center gap-1 rounded-sm border border-slate-300 px-4 py-2 text-xs font-semibold text-[#0B1C3D] hover:border-[#0B1C3D] transition-colors whitespace-nowrap"
                    >
                      <span>Contact Form</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
