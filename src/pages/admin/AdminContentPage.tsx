import { useEffect, useState, type FormEvent } from 'react';
import { Save } from 'lucide-react';
import { SeoHead } from '../../components/SeoHead';
import { DEFAULT_SITE_CONTENT } from '../../constants/company';
import { fetchSiteContent, updateSiteContent } from '../../services/api';
import type { SiteContent } from '../../types';

export function AdminContentPage() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSiteContent()
      .then(setContent)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateSiteContent(content);
      setSuccess('Website copy updated in Supabase.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save website content.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SeoHead
        title="Website Content | Ojoa Admin"
        description="Update homepage and about page copy for Ojoa Global Homes Limited."
      />

      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#0B1C3D]">
            Website Content
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Update primary headings, welcome copy, and About Us statements displayed on the public website.
          </p>
        </div>

        {error && (
          <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {success}
          </div>
        )}

        {loading ? (
          <div className="h-96 bg-white border border-slate-200 rounded-sm animate-pulse" />
        ) : (
          <form
            onSubmit={handleSave}
            className="rounded-sm border border-slate-200 bg-white p-6 sm:p-8 space-y-5"
          >
            <div>
              <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                Homepage Hero Heading
              </label>
              <input
                type="text"
                value={content.hero_heading}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, hero_heading: e.target.value }))
                }
                className="w-full min-h-[42px] rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                Homepage Hero Subheading
              </label>
              <textarea
                rows={2}
                value={content.hero_subheading}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, hero_subheading: e.target.value }))
                }
                className="w-full rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                Welcome Section Heading
              </label>
              <input
                type="text"
                value={content.welcome_title}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, welcome_title: e.target.value }))
                }
                className="w-full min-h-[42px] rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                Welcome Message
              </label>
              <textarea
                rows={3}
                value={content.welcome_body}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, welcome_body: e.target.value }))
                }
                className="w-full rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                About Us Page Heading
              </label>
              <input
                type="text"
                value={content.about_heading}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, about_heading: e.target.value }))
                }
                className="w-full min-h-[42px] rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                Company Introduction
              </label>
              <textarea
                rows={3}
                value={content.about_intro}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, about_intro: e.target.value }))
                }
                className="w-full rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                Company Vision
              </label>
              <textarea
                rows={3}
                value={content.about_vision}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, about_vision: e.target.value }))
                }
                className="w-full rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                Company Mission
              </label>
              <textarea
                rows={3}
                value={content.about_mission}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, about_mission: e.target.value }))
                }
                className="w-full rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-[#0B1C3D] px-7 py-2.5 text-sm font-semibold text-white hover:bg-[#132B57] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving Content...' : 'Save Website Content'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
