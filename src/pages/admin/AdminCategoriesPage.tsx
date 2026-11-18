import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { SeoHead } from '../../components/SeoHead';
import { createCategory, deleteCategory, fetchCategories } from '../../services/api';
import type { PropertyCategory } from '../../types';

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const created = await createCategory(name, description);
      setCategories((prev) => [...prev, created]);
      setName('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create category.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete category.');
    }
  }

  return (
    <>
      <SeoHead
        title="Manage Categories | Ojoa Admin"
        description="Manage property categories for Ojoa Global Homes Limited."
      />

      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#0B1C3D]">
            Property Categories
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Organize property types displayed in filters across the marketplace.
          </p>
        </div>

        {error && (
          <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <form
          onSubmit={handleAdd}
          className="rounded-sm border border-slate-200 bg-white p-6 space-y-4"
        >
          <h2 className="text-base font-semibold text-[#0B1C3D]">Add New Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B1C3D] mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Terrace Duplexes"
                className="w-full min-h-[42px] rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0B1C3D] mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short category summary"
                className="w-full min-h-[42px] rounded-sm border border-slate-300 px-3 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-sm bg-[#0B1C3D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#132B57] disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>{saving ? 'Adding...' : 'Add Category'}</span>
            </button>
          </div>
        </form>

        <div className="rounded-sm border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F7F8FA] text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="py-3.5 px-4 font-semibold text-[#0B1C3D]">
                    {cat.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                    {cat.slug}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{cat.description}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      className="inline-flex items-center gap-1 rounded-sm border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
