import { useEffect, useState, type FormEvent } from 'react';
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { SeoHead } from '../../components/SeoHead';
import {
  createTestimonial,
  fetchTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from '../../services/api';
import type { Testimonial } from '../../types';

export function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientRole, setClientRole] = useState('Homebuyer');
  const [quote, setQuote] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isSample, setIsSample] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await fetchTestimonials(true);
      setTestimonials(res.testimonials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load testimonials.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!clientName.trim() || !quote.trim()) {
      setError('Client name and testimonial quote are required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const created = await createTestimonial({
        client_name: clientName.trim(),
        client_role: clientRole.trim() || 'Client',
        quote: quote.trim(),
        is_published: isPublished,
        is_sample: isSample,
      });
      setTestimonials((prev) => [created, ...prev]);
      setClientName('');
      setClientRole('Homebuyer');
      setQuote('');
      setIsSample(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create testimonial.');
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(item: Testimonial) {
    try {
      const updated = await updateTestimonial(item.id, {
        is_published: !item.is_published,
      });
      setTestimonials((prev) => prev.map((t) => (t.id === item.id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update testimonial.');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete testimonial.');
    }
  }

  return (
    <>
      <SeoHead
        title="Manage Testimonials | Ojoa Admin"
        description="Add, publish, and manage verified customer testimonials."
      />

      <div className="space-y-8 max-w-5xl">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#0B1C3D]">
            Customer Testimonials
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Add verified client reviews or manage published testimonials shown on the website.
          </p>
        </div>

        {error && (
          <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Add Testimonial Form */}
        <form
          onSubmit={handleAdd}
          className="rounded-sm border border-slate-200 bg-white p-6 space-y-4"
        >
          <h2 className="text-base font-semibold text-[#0B1C3D]">Add Testimonial</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B1C3D] mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Verified client name"
                className="w-full min-h-[42px] rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0B1C3D] mb-1">
                Client Role / Context
              </label>
              <input
                type="text"
                value={clientRole}
                onChange={(e) => setClientRole(e.target.value)}
                placeholder="e.g. Homebuyer, Kubwa Estate"
                className="w-full min-h-[42px] rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B1C3D] mb-1">
              Testimonial Quote *
            </label>
            <textarea
              rows={3}
              required
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Enter verified client statement..."
              className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-5">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 accent-[#0B1C3D]"
                />
                <span>Publish immediately</span>
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSample}
                  onChange={(e) => setIsSample(e.target.checked)}
                  className="h-4 w-4 accent-[#0B1C3D]"
                />
                <span>Mark as Illustrative Sample</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-sm bg-[#0B1C3D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#132B57] disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Add Testimonial'}</span>
            </button>
          </div>
        </form>

        {/* Testimonials List */}
        {loading ? (
          <div className="h-40 bg-white border border-slate-200 rounded-sm animate-pulse" />
        ) : testimonials.length === 0 ? (
          <div className="rounded-sm border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
            No testimonials saved in Supabase yet.
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="rounded-sm border border-slate-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-[#0B1C3D] text-sm">
                      {item.client_name}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.client_role}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.is_published ? 'Published' : 'Hidden'}</span>
                    {item.is_sample && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#A37E2C]">Sample</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(item)}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-sm border border-slate-300 px-3 py-1.5 text-xs font-medium text-[#0B1C3D] hover:bg-slate-50"
                  >
                    {item.is_published ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span>Publish</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
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
