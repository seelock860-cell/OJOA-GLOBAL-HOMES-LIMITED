import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Star, Trash2, Upload } from 'lucide-react';
import { SafeImage } from '../../components/SafeImage';
import { SeoHead } from '../../components/SeoHead';
import { DEFAULT_CATEGORIES } from '../../constants/company';
import {
  createProperty,
  deletePropertyImage,
  fetchCategories,
  fetchPropertyById,
  setPrimaryPropertyImage,
  updateProperty,
  uploadPropertyImage,
} from '../../services/api';
import type { PropertyCategory, PropertyImage, PropertyStatus } from '../../types';

export function AdminPropertyFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<PropertyCategory[]>(DEFAULT_CATEGORIES);
  const [title, setTitle] = useState('');
  const [categoryName, setCategoryName] = useState('Houses');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [priceLabel, setPriceLabel] = useState('');
  const [status, setStatus] = useState<PropertyStatus>('Available');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [sizeSqm, setSizeSqm] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [isSample, setIsSample] = useState(false);

  const [existingImages, setExistingImages] = useState<PropertyImage[]>([]);
  const [queuedFiles, setQueuedFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      const cats = await fetchCategories();
      if (!active) return;
      setCategories(cats);

      if (id) {
        setLoading(true);
        const prop = await fetchPropertyById(id);
        if (!active) return;
        if (prop) {
          setTitle(prop.title);
          setCategoryName(prop.category_name);
          setLocation(prop.location);
          setPrice(prop.price > 0 ? String(prop.price) : '');
          setPriceLabel(prop.price_label || '');
          setStatus(prop.status);
          setBedrooms(prop.bedrooms !== null && prop.bedrooms !== undefined ? String(prop.bedrooms) : '');
          setBathrooms(prop.bathrooms !== null && prop.bathrooms !== undefined ? String(prop.bathrooms) : '');
          setSizeSqm(prop.size_sqm || '');
          setShortDescription(prop.short_description);
          setDescription(prop.description);
          setFeaturesText((prop.features || []).join('\n'));
          setIsFeatured(prop.is_featured);
          setIsPublished(prop.is_published);
          setIsSample(prop.is_sample);
          setExistingImages(prop.images || []);
        } else {
          setError('Property not found.');
        }
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setQueuedFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
  }

  function removeQueuedFile(index: number) {
    setQueuedFiles((prev) => prev.filter((_, idx) => idx !== index));
  }

  async function handleRemoveExistingImage(img: PropertyImage) {
    try {
      await deletePropertyImage(img);
      setExistingImages((prev) => prev.filter((item) => item.id !== img.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete image.');
    }
  }

  async function handleSetPrimary(img: PropertyImage) {
    if (!id) return;
    try {
      await setPrimaryPropertyImage(id, img.id);
      setExistingImages((prev) =>
        prev.map((item) => ({ ...item, is_primary: item.id === img.id }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update primary image.');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !location.trim() || !shortDescription.trim()) {
      setError('Property title, location, and short description are required.');
      return;
    }

    const matchedCat = categories.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    const cleanFeatures = featuresText
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      category_id:
        matchedCat?.id && /^[0-9a-f-]{36}$/i.test(matchedCat.id) ? matchedCat.id : null,
      category_name: categoryName,
      location: location.trim(),
      price: price ? Number(price) : 0,
      price_label: priceLabel.trim(),
      status,
      short_description: shortDescription.trim(),
      description: description.trim() || shortDescription.trim(),
      bedrooms: bedrooms ? Number(bedrooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      size_sqm: sizeSqm.trim(),
      features: cleanFeatures,
      is_featured: isFeatured,
      is_published: isPublished,
      is_sample: isSample,
    };

    setSaving(true);
    try {
      let targetPropertyId = id;
      if (isEditing && id) {
        await updateProperty(id, payload);
      } else {
        const created = await createProperty(payload);
        targetPropertyId = created.id;
      }

      if (targetPropertyId && queuedFiles.length > 0) {
        const hasPrimary = existingImages.some((i) => i.is_primary);
        for (let i = 0; i < queuedFiles.length; i++) {
          const uploaded = await uploadPropertyImage(
            targetPropertyId,
            queuedFiles[i],
            !hasPrimary && i === 0,
            title.trim()
          );
          setExistingImages((prev) => [...prev, uploaded]);
        }
        setQueuedFiles([]);
      }

      setSuccess(
        isEditing ? 'Property updated successfully.' : 'Property created successfully.'
      );
      if (!isEditing && targetPropertyId) {
        navigate(`/admin/properties/edit/${targetPropertyId}`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save property.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SeoHead
        title={`${isEditing ? 'Edit Property' : 'Add Property'} | Ojoa Admin`}
        description="Create or update property listings and images in Supabase."
      />

      <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#0B1C3D] mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="font-display text-3xl font-semibold text-[#0B1C3D]">
              {isEditing ? 'Edit Property Listing' : 'Add New Property'}
            </h1>
          </div>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-sm border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
              <h2 className="text-base font-semibold text-[#0B1C3D] border-b border-slate-100 pb-3">
                Property Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 5-Bedroom Detached Residence — Kubwa"
                    className="w-full min-h-[44px] rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                    Property Type / Category
                  </label>
                  <select
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full min-h-[44px] rounded-sm border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                    Availability Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                    className="w-full min-h-[44px] rounded-sm border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Under Offer">Under Offer</option>
                    <option value="Sold">Sold</option>
                    <option value="Sample Listing">Sample Listing</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                    Location (Abuja) *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kubwa, Abuja"
                    className="w-full min-h-[44px] rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                    Price in Nigerian Naira (NGN)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 85000000"
                    className="w-full min-h-[44px] rounded-sm border border-slate-300 px-3.5 py-2 text-sm font-mono focus:border-[#0B1C3D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                    Optional Price Label (if numeric price is 0)
                  </label>
                  <input
                    type="text"
                    value={priceLabel}
                    onChange={(e) => setPriceLabel(e.target.value)}
                    placeholder="e.g. Price Upon Enquiry"
                    className="w-full min-h-[44px] rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="Leave blank for land"
                    className="w-full min-h-[44px] rounded-sm border border-slate-300 px-3.5 py-2 text-sm font-mono focus:border-[#0B1C3D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    placeholder="Leave blank for land"
                    className="w-full min-h-[44px] rounded-sm border border-slate-300 px-3.5 py-2 text-sm font-mono focus:border-[#0B1C3D] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                    Property Size
                  </label>
                  <input
                    type="text"
                    value={sizeSqm}
                    onChange={(e) => setSizeSqm(e.target.value)}
                    placeholder="e.g. 500 sqm"
                    className="w-full min-h-[44px] rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                    Short Description (Card Summary) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                    Full Property Description
                  </label>
                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#0B1C3D] mb-1.5">
                    Property Features (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    placeholder="24-hour perimeter security&#10;Paved estate roads&#10;Fitted kitchen"
                    className="w-full rounded-sm border border-slate-300 px-3.5 py-2 text-sm focus:border-[#0B1C3D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-3 border-t border-slate-100">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 accent-[#0B1C3D]"
                  />
                  <span>Published on Website</span>
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 accent-[#0B1C3D]"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSample}
                    onChange={(e) => setIsSample(e.target.checked)}
                    className="h-4 w-4 accent-[#0B1C3D]"
                  />
                  <span>Mark as Sample Listing</span>
                </label>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="rounded-sm border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
              <h2 className="text-base font-semibold text-[#0B1C3D] border-b border-slate-100 pb-3">
                Property Images (Supabase Storage)
              </h2>

              {existingImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {existingImages.map((img) => (
                    <div
                      key={img.id}
                      className="rounded-sm border border-slate-200 overflow-hidden bg-slate-50"
                    >
                      <div className="aspect-[4/3]">
                        <SafeImage
                          src={img.image_url}
                          alt={img.alt_text || title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-2 flex items-center justify-between gap-1 border-t border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(img)}
                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-sm ${
                            img.is_primary
                              ? 'bg-[#0B1C3D] text-[#D9BA74]'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Star className="h-3 w-3" />
                          <span>{img.is_primary ? 'Primary' : 'Set Main'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(img)}
                          aria-label="Remove image"
                          className="p-1 text-red-600 hover:bg-red-50 rounded-sm"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-slate-300 bg-[#F7F8FA] p-6 cursor-pointer hover:border-[#0B1C3D] transition-colors">
                  <Upload className="h-6 w-6 text-[#0B1C3D] mb-2" />
                  <span className="text-sm font-medium text-[#0B1C3D]">
                    Select Property Images to Upload
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    JPG, PNG, or WEBP (uploaded to Supabase Storage on save)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>

                {queuedFiles.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {queuedFiles.map((file, idx) => (
                      <li
                        key={`${file.name}-${idx}`}
                        className="flex items-center justify-between rounded-sm border border-slate-200 px-3 py-2 text-xs text-slate-700"
                      >
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeQueuedFile(idx)}
                          className="text-red-600 hover:underline ml-3 shrink-0"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <Link
                to="/admin"
                className="inline-flex min-h-[44px] items-center justify-center rounded-sm border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#0B1C3D] px-7 py-2.5 text-sm font-semibold text-white hover:bg-[#132B57] transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>
                  {saving
                    ? 'Saving Property...'
                    : isEditing
                      ? 'Save Changes'
                      : 'Create Property'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
