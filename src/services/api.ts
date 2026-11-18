import {
  DEFAULT_CATEGORIES,
  DEFAULT_SITE_CONTENT,
  SAMPLE_PROPERTIES,
  SAMPLE_TESTIMONIALS,
} from '../constants/company';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type {
  Enquiry,
  EnquiryStatus,
  Property,
  PropertyCategory,
  PropertyImage,
  PropertyStatus,
  SiteContent,
  Testimonial,
} from '../types';

export interface PropertyInput {
  title: string;
  slug?: string;
  category_id?: string | null;
  category_name: string;
  location: string;
  price: number;
  price_label?: string;
  status: PropertyStatus;
  short_description: string;
  description: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  size_sqm?: string;
  features: string[];
  is_featured: boolean;
  is_published: boolean;
  is_sample: boolean;
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    Math.random().toString(36).slice(2, 6)
  );
}

function normalizeProperty(row: Record<string, unknown>): Property {
  const rawImages = Array.isArray(row.property_images)
    ? (row.property_images as PropertyImage[])
    : Array.isArray(row.images)
      ? (row.images as PropertyImage[])
      : [];

  const sortedImages = [...rawImages].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.display_order || 0) - (b.display_order || 0);
  });

  return {
    id: String(row.id),
    title: String(row.title || ''),
    slug: String(row.slug || row.id),
    category_id: row.category_id ? String(row.category_id) : null,
    category_name: String(row.category_name || 'Houses'),
    location: String(row.location || ''),
    price: Number(row.price || 0),
    price_label: row.price_label ? String(row.price_label) : '',
    status: (row.status as PropertyStatus) || 'Available',
    short_description: String(row.short_description || ''),
    description: String(row.description || ''),
    bedrooms: row.bedrooms !== null && row.bedrooms !== undefined ? Number(row.bedrooms) : null,
    bathrooms: row.bathrooms !== null && row.bathrooms !== undefined ? Number(row.bathrooms) : null,
    size_sqm: row.size_sqm ? String(row.size_sqm) : '',
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
    is_featured: Boolean(row.is_featured),
    is_published: row.is_published !== undefined ? Boolean(row.is_published) : true,
    is_sample: Boolean(row.is_sample),
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
    images: sortedImages,
  };
}

// -----------------------------------------------------------------------------
// PUBLIC DATA READS (With graceful Sample Mode fallback when Supabase is unset)
// -----------------------------------------------------------------------------

export async function fetchProperties(includeUnpublished = false): Promise<{
  properties: Property[];
  isSampleFallback: boolean;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return { properties: SAMPLE_PROPERTIES, isSampleFallback: true };
  }

  let query = supabase
    .from('properties')
    .select('*, property_images(*)')
    .order('created_at', { ascending: false });

  if (!includeUnpublished) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching properties:', error.message);
    if (!includeUnpublished) {
      return { properties: SAMPLE_PROPERTIES, isSampleFallback: true };
    }
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    return {
      properties: includeUnpublished ? [] : SAMPLE_PROPERTIES,
      isSampleFallback: !includeUnpublished,
    };
  }

  return {
    properties: data.map((row) => normalizeProperty(row as Record<string, unknown>)),
    isSampleFallback: false,
  };
}

export async function fetchPropertyById(idOrSlug: string): Promise<Property | null> {
  if (!isSupabaseConfigured || !supabase) {
    return SAMPLE_PROPERTIES.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
  const query = supabase
    .from('properties')
    .select('*, property_images(*)')
    .eq(isUuid ? 'id' : 'slug', idOrSlug)
    .maybeSingle();

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching property:', error.message);
    return SAMPLE_PROPERTIES.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
  }

  if (!data) {
    return SAMPLE_PROPERTIES.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
  }

  return normalizeProperty(data as Record<string, unknown>);
}

export async function fetchCategories(): Promise<PropertyCategory[]> {
  if (!isSupabaseConfigured || !supabase) {
    return DEFAULT_CATEGORIES;
  }

  const { data, error } = await supabase
    .from('property_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error || !data || data.length === 0) {
    return DEFAULT_CATEGORIES;
  }

  return data as PropertyCategory[];
}

export async function fetchTestimonials(includeUnpublished = false): Promise<{
  testimonials: Testimonial[];
  isSampleFallback: boolean;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return { testimonials: SAMPLE_TESTIMONIALS, isSampleFallback: true };
  }

  let query = supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (!includeUnpublished) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;
  if (error) {
    if (!includeUnpublished) {
      return { testimonials: SAMPLE_TESTIMONIALS, isSampleFallback: true };
    }
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    return {
      testimonials: includeUnpublished ? [] : SAMPLE_TESTIMONIALS,
      isSampleFallback: !includeUnpublished,
    };
  }

  return { testimonials: data as Testimonial[], isSampleFallback: false };
}

export async function fetchSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured || !supabase) {
    return DEFAULT_SITE_CONTENT;
  }

  const { data, error } = await supabase.from('site_content').select('key, value');
  if (error || !data || data.length === 0) {
    return DEFAULT_SITE_CONTENT;
  }

  const merged: Record<string, string> = { ...DEFAULT_SITE_CONTENT };
  for (const row of data) {
    if (row.key && typeof row.value === 'string') {
      merged[row.key] = row.value;
    }
  }
  return merged as unknown as SiteContent;
}

export async function submitEnquiry(payload: {
  full_name: string;
  phone: string;
  email: string;
  property_id?: string | null;
  property_interest: string;
  message: string;
}): Promise<{ savedToDatabase: boolean }> {
  if (!isSupabaseConfigured || !supabase) {
    return { savedToDatabase: false };
  }

  const cleanPropertyId =
    payload.property_id &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.property_id)
      ? payload.property_id
      : null;

  const { error } = await supabase.from('enquiries').insert({
    full_name: payload.full_name.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim(),
    property_id: cleanPropertyId,
    property_interest: payload.property_interest.trim(),
    message: payload.message.trim(),
    status: 'new',
  });

  if (error) {
    console.error('Supabase enquiry insert error:', error.message);
    return { savedToDatabase: false };
  }

  return { savedToDatabase: true };
}

// -----------------------------------------------------------------------------
// ADMIN AUTHENTICATION
// -----------------------------------------------------------------------------

export async function signInAdmin(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.'
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signOutAdmin() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getAdminSession() {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// -----------------------------------------------------------------------------
// ADMIN PROPERTY MANAGEMENT & STORAGE UPLOADS
// -----------------------------------------------------------------------------

export async function createProperty(input: PropertyInput): Promise<Property> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const payload = {
    ...input,
    slug: input.slug || slugify(input.title),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('properties')
    .insert(payload)
    .select('*, property_images(*)')
    .single();

  if (error) throw new Error(error.message);
  return normalizeProperty(data as Record<string, unknown>);
}

export async function updateProperty(id: string, input: Partial<PropertyInput>): Promise<Property> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('properties')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, property_images(*)')
    .single();

  if (error) throw new Error(error.message);
  return normalizeProperty(data as Record<string, unknown>);
}

export async function deleteProperty(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  // Delete stored images in Storage first if present
  const { data: imgs } = await supabase
    .from('property_images')
    .select('storage_path')
    .eq('property_id', id);

  if (imgs && imgs.length > 0) {
    const paths = imgs.map((i) => i.storage_path).filter((p): p is string => Boolean(p));
    if (paths.length > 0) {
      await supabase.storage.from('property-images').remove(paths);
    }
  }

  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function uploadPropertyImage(
  propertyId: string,
  file: File,
  isPrimary = false,
  altText = ''
): Promise<PropertyImage> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filePath = `${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('property-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

  const { data: publicUrlData } = supabase.storage.from('property-images').getPublicUrl(filePath);

  if (isPrimary) {
    await supabase
      .from('property_images')
      .update({ is_primary: false })
      .eq('property_id', propertyId);
  }

  const { data: record, error: insertError } = await supabase
    .from('property_images')
    .insert({
      property_id: propertyId,
      image_url: publicUrlData.publicUrl,
      storage_path: filePath,
      alt_text: altText || file.name,
      is_primary: isPrimary,
      display_order: isPrimary ? 0 : 1,
    })
    .select('*')
    .single();

  if (insertError) throw new Error(insertError.message);
  return record as PropertyImage;
}

export async function deletePropertyImage(image: PropertyImage): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  if (image.storage_path) {
    await supabase.storage.from('property-images').remove([image.storage_path]);
  }
  const { error } = await supabase.from('property_images').delete().eq('id', image.id);
  if (error) throw new Error(error.message);
}

export async function setPrimaryPropertyImage(propertyId: string, imageId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');

  await supabase.from('property_images').update({ is_primary: false }).eq('property_id', propertyId);
  const { error } = await supabase
    .from('property_images')
    .update({ is_primary: true })
    .eq('id', imageId);
  if (error) throw new Error(error.message);
}

// -----------------------------------------------------------------------------
// ADMIN CATEGORIES, ENQUIRIES, TESTIMONIALS & SITE CONTENT
// -----------------------------------------------------------------------------

export async function createCategory(name: string, description: string): Promise<PropertyCategory> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const { data, error } = await supabase
    .from('property_categories')
    .insert({ name: name.trim(), slug, description: description.trim() })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data as PropertyCategory;
}

export async function deleteCategory(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('property_categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function fetchAllEnquiries(): Promise<Enquiry[]> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []) as Enquiry[];
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteEnquiry(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('enquiries').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function createTestimonial(input: {
  client_name: string;
  client_role: string;
  quote: string;
  is_published: boolean;
  is_sample: boolean;
}): Promise<Testimonial> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.from('testimonials').insert(input).select('*').single();
  if (error) throw new Error(error.message);
  return data as Testimonial;
}

export async function updateTestimonial(
  id: string,
  input: Partial<Omit<Testimonial, 'id'>>
): Promise<Testimonial> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase
    .from('testimonials')
    .update(input)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data as Testimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function updateSiteContent(content: SiteContent): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const entries = Object.entries(content).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('site_content').upsert(entries, { onConflict: 'key' });
  if (error) throw new Error(error.message);
}
