import { useEffect, useState } from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import { SeoHead } from '../../components/SeoHead';
import {
  deleteEnquiry,
  fetchAllEnquiries,
  updateEnquiryStatus,
} from '../../services/api';
import type { Enquiry, EnquiryStatus } from '../../types';

export function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | EnquiryStatus>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchAllEnquiries();
        if (active) setEnquiries(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load enquiries.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  async function handleStatusChange(id: string, status: EnquiryStatus) {
    try {
      await updateEnquiryStatus(id, status);
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status.');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete enquiry.');
    }
  }

  const filtered = enquiries.filter(
    (e) => filterStatus === 'all' || e.status === filterStatus
  );

  function buildReplyWhatsApp(enquiry: Enquiry) {
    const cleanDigits = enquiry.phone.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hello ${enquiry.full_name}, thank you for contacting Ojoa Global Homes Limited regarding ${enquiry.property_interest}. How may we assist you today?`
    );
    return `https://wa.me/${cleanDigits}?text=${text}`;
  }

  return (
    <>
      <SeoHead
        title="Manage Enquiries | Ojoa Admin"
        description="View and respond to customer property enquiries."
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#0B1C3D]">
              Customer Enquiries
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Review property enquiries submitted from the contact form and property pages.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {(['all', 'new', 'contacted', 'closed'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterStatus(tab)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-sm capitalize transition-colors ${
                  filterStatus === tab
                    ? 'bg-[#0B1C3D] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-white border border-slate-200 rounded-sm animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-sm border border-slate-200 bg-white p-12 text-center text-sm text-slate-600">
            No enquiries match the selected filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="rounded-sm border border-slate-200 bg-white p-6 flex flex-col lg:flex-row lg:items-start justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-[#0B1C3D]">{item.full_name}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{item.phone}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.email}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {new Date(item.created_at).toLocaleDateString('en-NG')}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#A37E2C]">
                    Interest: {item.property_interest}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {item.message}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <select
                    aria-label={`Status for ${item.full_name}`}
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item.id, e.target.value as EnquiryStatus)
                    }
                    className="min-h-[38px] rounded-sm border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>

                  <a
                    href={buildReplyWhatsApp(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-sm bg-[#15803D] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#166534]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp Reply</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    aria-label={`Delete enquiry from ${item.full_name}`}
                    className="inline-flex min-h-[38px] items-center gap-1 rounded-sm border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
