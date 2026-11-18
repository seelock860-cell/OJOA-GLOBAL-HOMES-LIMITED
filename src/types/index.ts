export type PropertyStatus = 'Available' | 'Under Offer' | 'Sold' | 'Sample Listing';

export interface PropertyCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  created_at?: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  storage_path?: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
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
  created_at?: string;
  updated_at?: string;
  images?: PropertyImage[];
}

export type EnquiryStatus = 'new' | 'contacted' | 'closed';

export interface Enquiry {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  property_id?: string | null;
  property_interest: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string;
  quote: string;
  is_published: boolean;
  is_sample: boolean;
  created_at?: string;
}

export interface SiteContent {
  hero_heading: string;
  hero_subheading: string;
  welcome_title: string;
  welcome_body: string;
  about_heading: string;
  about_intro: string;
  about_vision: string;
  about_mission: string;
}
