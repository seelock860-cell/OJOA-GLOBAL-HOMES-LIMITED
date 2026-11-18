import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { SeoHead } from '../components/SeoHead';
import { DEFAULT_CATEGORIES } from '../constants/company';
import { fetchCategories, fetchProperties } from '../services/api';
import type { Property, PropertyCategory } from '../types';

export function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Properties';

  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<PropertyCategory[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSampleFallback, setIsSampleFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const paramCat = searchParams.get('category');
    if (paramCat) {
      setSelectedCategory(paramCat);
    }
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [propRes, catRes] = await Promise.all([
          fetchProperties(false),
          fetchCategories(),
        ]);
        if (!active) return;
        setProperties(propRes.properties);
        setIsSampleFallback(propRes.isSampleFallback);
        setCategories(catRes);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Unable to load properties right now.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const filterTabs = useMemo(() => {
    const names = categories.map((c) => c.name);
    return ['All Properties', ...names];
  }, [categories]);

  const filteredProperties = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return properties.filter((prop) => {
      const matchesCat =
        selectedCategory === 'All Properties' ||
        prop.category_name.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !q ||
        prop.title.toLowerCase().includes(q) ||
        prop.location.toLowerCase().includes(q) ||
        prop.category_name.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [properties, selectedCategory, searchQuery]);

  function handleSelectCategory(cat: string) {
    setSelectedCategory(cat);
    if (cat === 'All Properties') {
      searchParams.delete('category');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ category: cat }, { replace: true });
    }
  }

  return (
    <>
      <SeoHead
        title="Properties in Abuja | Houses & Land for Sale — Ojoa Global Homes"
        description="Explore houses for sale, serviced land, luxury apartments, and commercial properties in Abuja with Ojoa Global Homes Limited."
      />

      {/* Page Header */}
      <section className="bg-[#0B1C3D] text-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#D9BA74] mb-3">
            Property Marketplace
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white leading-tight text-balance mb-4">
            Properties in Abuja
          </h1>
          <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
            Browse residential homes, serviced estate plots, modern apartments, and commercial opportunities curated by Ojoa Global Homes Limited.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b border-slate-200 sticky top-[72px] z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Segmented Category Filter Buttons */}
            <div
              className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0"
              role="tablist"
              aria-label="Filter properties by category"
            >
              <SlidersHorizontal className="h-4 w-4 text-slate-400 mr-1 shrink-0 hidden sm:block" />
              {filterTabs.map((tab) => {
                const isActive = selectedCategory === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleSelectCategory(tab)}
                    className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-sm transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#0B1C3D] text-white'
                        : 'bg-[#F4F6F9] text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80 shrink-0">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by property name or location..."
                aria-label="Search properties by name or location"
                className="w-full min-h-[42px] rounded-sm border border-slate-300 bg-white pl-10 pr-9 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0B1C3D] focus:outline-none focus:ring-1 focus:ring-[#0B1C3D]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-12 lg:py-16 bg-[#F7F8FA] min-h-[500px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isSampleFallback && (
            <div className="mb-8 rounded-sm border border-[#C6A254]/40 bg-[#F7F1E1]/65 px-5 py-4 text-sm text-[#0B1C3D]">
              <strong>Sample Listings Notice:</strong> These listings are clearly labelled illustrative samples until verified property listings and Nigerian Naira pricing are published through the Administrator Dashboard.
            </div>
          )}

          {error && (
            <div className="mb-8 rounded-sm border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
            <span className="tabular-nums">
              Showing {filteredProperties.length}{' '}
              {filteredProperties.length === 1 ? 'property' : 'properties'}
              {selectedCategory !== 'All Properties' ? ` in ${selectedCategory}` : ''}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-[440px] rounded-sm border border-slate-200 bg-white animate-pulse"
                />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="rounded-sm border border-slate-200 bg-white p-12 text-center">
              <h2 className="font-display text-2xl font-semibold text-[#0B1C3D] mb-2">
                No Matching Properties Found
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Try adjusting your search keywords or selecting &ldquo;All Properties&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  handleSelectCategory('All Properties');
                }}
                className="inline-flex min-h-[42px] items-center justify-center rounded-sm bg-[#0B1C3D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#132B57] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
