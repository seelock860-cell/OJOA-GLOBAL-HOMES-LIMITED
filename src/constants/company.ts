import type { Property, PropertyCategory, SiteContent, Testimonial } from '../types';

export const COMPANY_INFO = {
  name: 'Ojoa Global Homes Limited',
  shortName: 'Ojoa Global Homes',
  category: 'Real Estate Developer',
  description: "Abuja's trusted real estate developer for premium estates and properties.",
  address: '1 1st Avenue, behind Ecopie Plaza, Arab Road, Kubwa, Abuja, Nigeria.',
  phoneDisplay: '+234 806 290 0791',
  phoneRaw: '+2348062900791',
  whatsappNumber: '2348062900791',
  email: 'ojoaglobalhomes@gmail.com',
  website: 'ojoaglobalhomes.com',
} as const;

export const GENERATED_IMAGES = {
  heroVilla: '/src/assets/images/hero_luxury_villa_1794943029329.jpg',
  aboutEstate: '/src/assets/images/about_architecture_1794943028662.jpg',
  detachedHouse: '/src/assets/images/property_detached_house_1794943030631.jpg',
  apartmentResidence: '/src/assets/images/property_apartment_residence_1794943031751.jpg',
  landEstate: '/src/assets/images/property_land_estate_1794943031932.jpg',
  commercialPlaza: '/src/assets/images/property_commercial_plaza_1794943032353.jpg',
} as const;

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero_heading: 'FIND YOUR PLACE IN A BETTER FUTURE.',
  hero_subheading:
    'Discover premium estates and property opportunities with Ojoa Global Homes Limited.',
  welcome_title: 'Welcome to Ojoa Global Homes Limited',
  welcome_body:
    'Based in Abuja, Ojoa Global Homes Limited develops residential estates and curates dependable property opportunities across the Federal Capital Territory, combining thoughtful planning with transparent client guidance.',
  about_heading: 'BUILDING CONFIDENCE IN EVERY PROPERTY DECISION.',
  about_intro:
    'Ojoa Global Homes Limited is an Abuja-based real estate development company focused on residential estates, homes, and strategic land opportunities built around long-term clarity and buyer confidence.',
  about_vision:
    'To serve as a dependable standard for estate development and property acquisition in Abuja through disciplined planning, quality craftsmanship, and transparent client relationships.',
  about_mission:
    'To connect families and property investors with well-located estates and real estate opportunities in Abuja while maintaining clear communication and dedicated professional assistance.',
};

export const DEFAULT_CATEGORIES: PropertyCategory[] = [
  {
    id: 'cat-houses',
    name: 'Houses',
    slug: 'houses',
    description: 'Detached duplexes, terrace residences, and family homes.',
    display_order: 1,
  },
  {
    id: 'cat-land',
    name: 'Land',
    slug: 'land',
    description: 'Serviced residential and investment land parcels.',
    display_order: 2,
  },
  {
    id: 'cat-apartments',
    name: 'Apartments',
    slug: 'apartments',
    description: 'Modern luxury apartments and multi-unit residences.',
    display_order: 3,
  },
  {
    id: 'cat-commercial',
    name: 'Commercial Properties',
    slug: 'commercial-properties',
    description: 'Office plazas, retail spaces, and commercial developments.',
    display_order: 4,
  },
];

// Clearly labelled illustrative sample listings until verified listings are supplied via Admin Dashboard
export const SAMPLE_PROPERTIES: Property[] = [
  {
    id: 'sample-detached-duplex',
    title: 'Sample 5-Bedroom Detached Residence',
    slug: 'sample-5-bedroom-detached-residence',
    category_id: 'cat-houses',
    category_name: 'Houses',
    location: 'Abuja (Sample Listing — Contact for Verified Locations)',
    price: 0,
    price_label: 'Sample Price Upon Enquiry',
    status: 'Sample Listing',
    short_description:
      'Illustrative residential listing showcasing modern detached architecture, private courtyard, and spacious family living layout.',
    description:
      'This is an illustrative sample property listing prepared for layout demonstration until verified estate specifications and pricing are published by Ojoa Global Homes Limited. Contact our office directly via WhatsApp or the enquiry form for verified available homes in Abuja.',
    bedrooms: 5,
    bathrooms: 6,
    size_sqm: '550 sqm (Sample)',
    features: [
      'Sample Listing — Verified Specs Available on Request',
      'En-suite bedrooms with natural daylight',
      'Private paved driveway and perimeter security',
      'Fitted kitchen layout and guest quarters',
      'Gated estate infrastructure concept',
    ],
    is_featured: true,
    is_published: true,
    is_sample: true,
    images: [
      {
        id: 'img-sample-1a',
        property_id: 'sample-detached-duplex',
        image_url: GENERATED_IMAGES.detachedHouse,
        alt_text: 'Sample modern detached residence exterior in Abuja',
        is_primary: true,
        display_order: 0,
      },
      {
        id: 'img-sample-1b',
        property_id: 'sample-detached-duplex',
        image_url: GENERATED_IMAGES.heroVilla,
        alt_text: 'Sample luxury residential courtyard view',
        is_primary: false,
        display_order: 1,
      },
      {
        id: 'img-sample-1c',
        property_id: 'sample-detached-duplex',
        image_url: GENERATED_IMAGES.aboutEstate,
        alt_text: 'Sample gated estate boulevard',
        is_primary: false,
        display_order: 2,
      },
    ],
  },
  {
    id: 'sample-serviced-estate-land',
    title: 'Sample Serviced Estate Land Parcel',
    slug: 'sample-serviced-estate-land-parcel',
    category_id: 'cat-land',
    category_name: 'Land',
    location: 'Abuja Growth Corridor (Sample Listing)',
    price: 0,
    price_label: 'Sample Price Upon Enquiry',
    status: 'Sample Listing',
    short_description:
      'Illustrative serviced residential plot showcase featuring paved estate access roads, perimeter fencing, and clear allocation layout.',
    description:
      'This is an illustrative sample land listing demonstrating how serviced estate plots are presented. Please contact Ojoa Global Homes Limited to receive current verified plot sizes, title documentation details, and official pricing in Nigerian Naira.',
    bedrooms: null,
    bathrooms: null,
    size_sqm: '500 sqm (Sample)',
    features: [
      'Sample Listing — Official Plot Pricing on Request',
      'Planned paved estate road network',
      'Perimeter wall and gatehouse concept',
      'Suitable for residential development or land banking',
    ],
    is_featured: true,
    is_published: true,
    is_sample: true,
    images: [
      {
        id: 'img-sample-2a',
        property_id: 'sample-serviced-estate-land',
        image_url: GENERATED_IMAGES.landEstate,
        alt_text: 'Sample serviced estate land with paved road network',
        is_primary: true,
        display_order: 0,
      },
      {
        id: 'img-sample-2b',
        property_id: 'sample-serviced-estate-land',
        image_url: GENERATED_IMAGES.aboutEstate,
        alt_text: 'Sample residential estate streetscape',
        is_primary: false,
        display_order: 1,
      },
    ],
  },
  {
    id: 'sample-luxury-apartment',
    title: 'Sample 3-Bedroom Contemporary Apartment',
    slug: 'sample-3-bedroom-contemporary-apartment',
    category_id: 'cat-apartments',
    category_name: 'Apartments',
    location: 'Abuja Residential District (Sample Listing)',
    price: 0,
    price_label: 'Sample Price Upon Enquiry',
    status: 'Sample Listing',
    short_description:
      'Illustrative multi-unit luxury apartment showcase with glass-balustrade balconies, dedicated parking, and serene landscaped grounds.',
    description:
      'This is an illustrative sample apartment listing pending verified apartment inventory publication by the administrator. Reach out to our Abuja team for current apartment availability, floor plans, and Naira payment structures.',
    bedrooms: 3,
    bathrooms: 4,
    size_sqm: '240 sqm (Sample)',
    features: [
      'Sample Listing — Verified Availability on Request',
      'Private glass-balustrade terrace',
      'Dedicated resident parking bays',
      'Landscaped common courtyard',
    ],
    is_featured: true,
    is_published: true,
    is_sample: true,
    images: [
      {
        id: 'img-sample-3a',
        property_id: 'sample-luxury-apartment',
        image_url: GENERATED_IMAGES.apartmentResidence,
        alt_text: 'Sample luxury contemporary apartment building facade',
        is_primary: true,
        display_order: 0,
      },
      {
        id: 'img-sample-3b',
        property_id: 'sample-luxury-apartment',
        image_url: GENERATED_IMAGES.heroVilla,
        alt_text: 'Sample contemporary architectural lighting',
        is_primary: false,
        display_order: 1,
      },
    ],
  },
  {
    id: 'sample-commercial-plaza',
    title: 'Sample Commercial Office & Retail Plaza',
    slug: 'sample-commercial-office-retail-plaza',
    category_id: 'cat-commercial',
    category_name: 'Commercial Properties',
    location: 'Abuja Commercial District (Sample Listing)',
    price: 0,
    price_label: 'Sample Price Upon Enquiry',
    status: 'Sample Listing',
    short_description:
      'Illustrative commercial development showcase designed for corporate offices, showrooms, and high-visibility retail businesses.',
    description:
      'This is an illustrative sample commercial property listing. Contact Ojoa Global Homes Limited directly for verified commercial spaces, investment briefs, and official Nigerian Naira terms.',
    bedrooms: null,
    bathrooms: 6,
    size_sqm: '1,200 sqm (Sample)',
    features: [
      'Sample Listing — Official Commercial Terms on Request',
      'Curtain-wall glass facade and wide forecourt',
      'Flexible open-plan floor plates',
      'Customer and executive parking zones',
    ],
    is_featured: false,
    is_published: true,
    is_sample: true,
    images: [
      {
        id: 'img-sample-4a',
        property_id: 'sample-commercial-plaza',
        image_url: GENERATED_IMAGES.commercialPlaza,
        alt_text: 'Sample modern commercial office and retail plaza',
        is_primary: true,
        display_order: 0,
      },
    ],
  },
];

// Clearly labelled illustrative testimonial preview until administrator publishes verified reviews
export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: 'sample-testimonial-1',
    client_name: 'Sample Client Placeholder',
    client_role: 'Illustrative Preview · Verified Reviews Managed by Admin',
    quote:
      'Client testimonials published by the Ojoa Global Homes Limited administrator will appear in this section. Verified buyer and investor feedback can be added anytime from the Admin Dashboard.',
    is_published: true,
    is_sample: true,
  },
];

export function formatNairaPrice(price: number, priceLabel?: string, isSample?: boolean): string {
  if (price > 0) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price);
  }
  if (priceLabel && priceLabel.trim().length > 0) {
    return priceLabel;
  }
  return isSample ? 'Sample Price Upon Enquiry' : 'Price Upon Enquiry';
}

export function buildWhatsAppUrl(customMessage?: string): string {
  const defaultMsg =
    'Hello Ojoa Global Homes Limited. I visited your website and I am interested in your properties. Please send me more information.';
  const text = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${text}`;
}

export function buildPropertyWhatsAppUrl(propertyTitle: string): string {
  const message = `Hello Ojoa Global Homes Limited. I visited your website and I am interested in "${propertyTitle}". Please send me more information.`;
  return buildWhatsAppUrl(message);
}
