import { useEffect, useState, type FormEvent } from 'react';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { buildWhatsAppUrl, COMPANY_INFO } from '../constants/company';
import { fetchProperties, submitEnquiry } from '../services/api';
import type { Property } from '../types';

export function ContactPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [propertyInterest, setPropertyInterest] = useState('General Property Enquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProperties(false)
      .then((res) => setProperties(res.properties))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || !phone.trim() || !email.trim() || !message.trim()) {
      setError('Please complete all required fields before submitting.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const matchedProp = properties.find((p) => p.title === propertyInterest);
      await submitEnquiry({
        full_name: fullName,
        phone,
        email,
        property_id: matchedProp?.id || null,
        property_interest: propertyInterest,
        message,
      });

      const preparedWhatsAppText = [
        `Hello Ojoa Global Homes Limited. I visited your website and submitted an enquiry.`,
        `Name: ${fullName.trim()}`,
        `Phone: ${phone.trim()}`,
        `Email: ${email.trim()}`,
        `Property of Interest: ${propertyInterest}`,
        `Message: ${message.trim()}`,
      ].join('\n');

      setSuccess('Your enquiry is ready. Redirecting you to WhatsApp...');
      window.location.href = buildWhatsAppUrl(preparedWhatsAppText);
    } catch {
      setError('Something went wrong. Please contact us directly via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SeoHead
        title="Contact Us | Ojoa Global Homes Limited — Kubwa, Abuja"
        description="Contact Ojoa Global Homes Limited at 1 1st Avenue, behind Ecopie Plaza, Arab Road, Kubwa, Abuja, Nigeria or reach us on +234 806 290 0791."
      />

      {/* Page Header */}
      <section className="bg-[#0B1C3D] text-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#D9BA74] mb-3">
            Get In Touch
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white leading-tight text-balance mb-4">
            Contact Ojoa Global Homes Limited
          </h1>
          <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
            Reach our Abuja office for property inspections, estate investment enquiries, or consultation requests.
          </p>
        </div>
      </section>

      {/* Contact Information & Enquiry Form (No Maps) */}
      <section className="py-16 lg:py-24 bg-[#F7F8FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Company Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-sm border border-slate-200 bg-white p-8">
                <h2 className="font-display text-3xl font-semibold text-[#0B1C3D] mb-2">
                  {COMPANY_INFO.name}
                </h2>
                <p className="text-sm text-slate-600 mb-8">
                  {COMPANY_INFO.description}
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-[#F4F6F9] text-[#0B1C3D] shrink-0">
                      <MapPin className="h-5 w-5 text-[#A37E2C]" />
                    </span>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        Office Address
                      </h3>
                      <p className="text-sm font-medium text-[#0B1C3D] leading-relaxed">
                        {COMPANY_INFO.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-[#F4F6F9] text-[#0B1C3D] shrink-0">
                      <Phone className="h-5 w-5 text-[#A37E2C]" />
                    </span>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        Phone
                      </h3>
                      <a
                        href={`tel:${COMPANY_INFO.phoneRaw}`}
                        className="text-sm font-medium text-[#0B1C3D] hover:text-[#A37E2C] tabular-nums"
                      >
                        {COMPANY_INFO.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-[#F4F6F9] text-[#0B1C3D] shrink-0">
                      <MessageCircle className="h-5 w-5 text-[#15803D]" />
                    </span>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        WhatsApp
                      </h3>
                      <a
                        href={buildWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#0B1C3D] hover:text-[#15803D] tabular-nums"
                      >
                        {COMPANY_INFO.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-[#F4F6F9] text-[#0B1C3D] shrink-0">
                      <Mail className="h-5 w-5 text-[#A37E2C]" />
                    </span>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        Email
                      </h3>
                      <a
                        href={`mailto:${COMPANY_INFO.email}`}
                        className="text-sm font-medium text-[#0B1C3D] hover:text-[#A37E2C] break-all"
                      >
                        {COMPANY_INFO.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-sm bg-[#15803D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#166534] transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat Directly on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="rounded-sm border border-slate-200 bg-white p-8">
                <h2 className="font-display text-3xl font-semibold text-[#0B1C3D] mb-2">
                  Send a Property Enquiry
                </h2>
                <p className="text-sm text-slate-600 mb-7">
                  Complete the form below and we will open WhatsApp with your enquiry details automatically prepared for our team.
                </p>

                {error && (
                  <div className="mb-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-6 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-full-name"
                        className="block text-xs font-semibold text-[#0B1C3D] mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        id="contact-full-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full min-h-[44px] rounded-sm border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0B1C3D] focus:outline-none focus:ring-1 focus:ring-[#0B1C3D]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-semibold text-[#0B1C3D] mb-1.5"
                      >
                        Phone Number *
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 ..."
                        className="w-full min-h-[44px] rounded-sm border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0B1C3D] focus:outline-none focus:ring-1 focus:ring-[#0B1C3D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold text-[#0B1C3D] mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full min-h-[44px] rounded-sm border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0B1C3D] focus:outline-none focus:ring-1 focus:ring-[#0B1C3D]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-property"
                        className="block text-xs font-semibold text-[#0B1C3D] mb-1.5"
                      >
                        Property of Interest
                      </label>
                      <select
                        id="contact-property"
                        value={propertyInterest}
                        onChange={(e) => setPropertyInterest(e.target.value)}
                        className="w-full min-h-[44px] rounded-sm border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0B1C3D] focus:outline-none focus:ring-1 focus:ring-[#0B1C3D]"
                      >
                        <option value="General Property Enquiry">
                          General Property Enquiry
                        </option>
                        <option value="Houses for Sale in Abuja">
                          Houses for Sale in Abuja
                        </option>
                        <option value="Land for Sale in Abuja">
                          Land for Sale in Abuja
                        </option>
                        <option value="Estate Development & Investment">
                          Estate Development & Investment
                        </option>
                        {properties.map((p) => (
                          <option key={p.id} value={p.title}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-[#0B1C3D] mb-1.5"
                    >
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about the property type, preferred Abuja location, or inspection date you would like..."
                      className="w-full rounded-sm border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0B1C3D] focus:outline-none focus:ring-1 focus:ring-[#0B1C3D]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-sm bg-[#0B1C3D] px-8 py-3 text-sm font-semibold text-white hover:bg-[#132B57] transition-colors disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    <span>
                      {submitting
                        ? 'Preparing WhatsApp Enquiry...'
                        : 'Submit & Open WhatsApp'}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
