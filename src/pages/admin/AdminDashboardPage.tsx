import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Edit3,
  MessageSquareQuote,
  MessagesSquare,
  PlusSquare,
  Trash2,
} from 'lucide-react';
import { SafeImage } from '../../components/SafeImage';
import { SeoHead } from '../../components/SeoHead';
import { formatNairaPrice } from '../../constants/company';
import {
  deleteProperty,
  fetchAllEnquiries,
  fetchProperties,
  fetchTestimonials,
  updateProperty,
} from '../../services/api';
import type { Property, PropertyStatus } from '../../types';

const STATUS_OPTIONS: PropertyStatus[] = ['Available', 'Under Offer', 'Sold', 'Sample Listing'];

export function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [newEnquiryCount, setNewEnquiryCount] = useState(0);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadDashboard() {
    setLoading(true);
    setError('');
    try {
      const [propRes, enqRes, testRes] = await Promise.all([
        fetchProperties(true),
        fetchAllEnquiries().catch(() => []),
        fetchTestimonials(true),
      ]);
      setProperties(propRes.properties);
      setEnquiryCount(enqRes.length);
      setNewEnquiryCount(enqRes.filter((e) => e.status === 'new').length);
      setTestimonialCount(testRes.testimonials.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleStatusChange(propertyId: string, status: PropertyStatus) {
    setBusyId(propertyId);
    try {
      const updated = await updateProperty(propertyId, { status });
      setProperties((prev) => prev.map((p) => (p.id === propertyId ? updated : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update property status.');
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(property: Property) {
    setBusyId(property.id);
    setError('');
    try {
      await deleteProperty(property.id);
      setProperties((prev) => prev.filter((p) => p.id !== property.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete property.');
    } finally {
      setBusyId(null);
    }
  }

  const availableCount = properties.filter((p) => p.status === 'Available').length;

  return (
    <>
      <SeoHead
        title="Admin Dashboard | Ojoa Global Homes Limited"
        description="Manage property listings, availability, enquiries, and testimonials."
      />

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#0B1C3D]">
              Dashboard Overview
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage Abuja property listings, customer enquiries, and published testimonials.
            </p>
          </div>
          <Link
            to="/admin/properties/new"
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-sm bg-[#0B1C3D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#132B57] transition-colors whitespace-nowrap"
          >
            <PlusSquare className="h-4 w-4" />
            <span>Add New Property</span>
          </Link>
        </div>

        {error && (
          <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* KPI Statistics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-sm border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Total Properties</span>
              <Building2 className="h-4 w-4 text-[#C6A254]" />
            </div>
            <p className="font-mono text-2xl font-semibold text-[#0B1C3D] tabular-nums">
              {properties.length}
            </p>
          </div>

          <div className="rounded-sm border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Available Listings</span>
              <Building2 className="h-4 w-4 text-[#15803D]" />
            </div>
            <p className="font-mono text-2xl font-semibold text-[#0B1C3D] tabular-nums">
              {availableCount}
            </p>
          </div>

          <div className="rounded-sm border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Customer Enquiries</span>
              <MessagesSquare className="h-4 w-4 text-[#C6A254]" />
            </div>
            <p className="font-mono text-2xl font-semibold text-[#0B1C3D] tabular-nums">
              {enquiryCount}{' '}
              <span className="text-xs font-sans font-normal text-slate-500">
                ({newEnquiryCount} new)
              </span>
            </p>
          </div>

          <div className="rounded-sm border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Testimonials</span>
              <MessageSquareQuote className="h-4 w-4 text-[#C6A254]" />
            </div>
            <p className="font-mono text-2xl font-semibold text-[#0B1C3D] tabular-nums">
              {testimonialCount}
            </p>
          </div>
        </div>

        {/* Properties Table */}
        <div className="rounded-sm border border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#0B1C3D]">
              Property Inventory
            </h2>
            <span className="text-xs text-slate-500 tabular-nums">
              {properties.length} records
            </span>
          </div>

          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-sm animate-pulse" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-slate-600 mb-4">
                No properties have been added to Supabase yet.
              </p>
              <Link
                to="/admin/properties/new"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-sm bg-[#0B1C3D] px-5 py-2 text-xs font-semibold text-white"
              >
                <PlusSquare className="h-4 w-4" />
                <span>Add First Property</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#F7F8FA] text-xs font-semibold text-slate-600">
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (NGN)</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {properties.map((prop) => {
                    const thumb =
                      prop.images?.find((img) => img.is_primary)?.image_url ||
                      prop.images?.[0]?.image_url;
                    return (
                      <tr key={prop.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-14 rounded-sm overflow-hidden bg-slate-100 shrink-0">
                              <SafeImage
                                src={thumb}
                                alt={prop.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[#0B1C3D] truncate max-w-[240px]">
                                {prop.title}
                              </p>
                              <p className="text-xs text-slate-500 truncate max-w-[240px]">
                                {prop.location}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                          {prop.category_name}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-[#0B1C3D] tabular-nums whitespace-nowrap">
                          {formatNairaPrice(prop.price, prop.price_label, prop.is_sample)}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            aria-label={`Change availability for ${prop.title}`}
                            value={prop.status}
                            disabled={busyId === prop.id}
                            onChange={(e) =>
                              handleStatusChange(prop.id, e.target.value as PropertyStatus)
                            }
                            className="rounded-sm border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:border-[#0B1C3D] focus:outline-none"
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              to={`/admin/properties/edit/${prop.id}`}
                              className="inline-flex items-center gap-1 rounded-sm border border-slate-300 px-3 py-1.5 text-xs font-medium text-[#0B1C3D] hover:bg-slate-100 transition-colors"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </Link>
                            <button
                              type="button"
                              disabled={busyId === prop.id}
                              onClick={() => handleDelete(prop)}
                              className="inline-flex items-center gap-1 rounded-sm border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
