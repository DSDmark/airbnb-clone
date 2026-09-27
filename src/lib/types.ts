import type { IconName } from "@/components/icons/registry";

export interface Photo {
  id: string;
  /** CDN URL without a size parameter; the image loader appends `im_w`. */
  url: string;
  caption: string;
  orientation: "landscape" | "portrait";
}

/** A room in the photo tour: its own thumbnail tile and section. */
export interface PhotoRoom {
  id: string;
  title: string;
  /** Amenities shown under the room title in the tour ("Sofa · TV · …"). */
  highlights: string[];
  photoIds: string[];
}

export interface Highlight {
  icon: IconName;
  title: string;
  subtitle: string;
}

export interface DescriptionSection {
  /** Omitted for the untitled summary paragraph. */
  title?: string;
  body: string;
}

export interface SleepingSpace {
  title: string;
  subtitle: string;
  photoId: string;
  /** Photo-tour room the card jumps to when opened. */
  roomId: string;
}

export interface Amenity {
  title: string;
  subtitle?: string;
  icon: IconName;
  available: boolean;
}

export interface AmenityGroup {
  title: string;
  items: Amenity[];
}

export type RatingCategoryKey =
  | "cleanliness"
  | "accuracy"
  | "checkIn"
  | "communication"
  | "location"
  | "value";

export interface RatingCategory {
  key: RatingCategoryKey;
  label: string;
  value: number;
}

export interface ReviewMention {
  label: string;
  count: number;
  iconUrl: string;
}

export interface Person {
  name: string;
  /** Profile photo; when absent an initial on a tinted disc is shown. */
  avatarUrl?: string;
}

export interface Review {
  id: string;
  author: Person;
  tenure: string;
  rating: number;
  date: string;
  text: string;
  /** The review is longer than the card shows (translation, host reply…). */
  hasMore: boolean;
}

export interface Reviews {
  overall: number;
  count: number;
  isGuestFavourite: boolean;
  /** Share of reviews per star, index 0 = 5 stars … index 4 = 1 star (0–1). */
  distribution: [number, number, number, number, number];
  categories: RatingCategory[];
  mentions: ReviewMention[];
  items: Review[];
}

export interface Host {
  name: string;
  avatarUrl: string;
  isSuperhost: boolean;
  isVerified: boolean;
  yearsHosting: number;
  reviewCount: number;
  rating: number;
  facts: { icon: IconName; text: string }[];
  coHosts: Person[];
  responseRate: string;
  responseTime: string;
}

export interface PolicyBlock {
  icon: IconName;
  title: string;
  lines: string[];
  linkLabel: string;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface Listing {
  id: string;
  title: string;
  /** "Serviced apartments for Rent in Candolim, Goa, India" — used in <title>. */
  seoSubtitle: string;
  propertyType: string;
  locationLabel: string;
  capacity: string[];
  photos: Photo[];
  /** Five photo ids for the hero mosaic, in reading order. */
  heroPhotoIds: [string, string, string, string, string];
  rooms: PhotoRoom[];
  host: Host;
  highlights: Highlight[];
  translated: boolean;
  description: DescriptionSection[];
  sleeping: SleepingSpace[];
  amenities: {
    preview: Amenity[];
    groups: AmenityGroup[];
    total: number;
  };
  reviews: Reviews;
  location: {
    label: string;
    lat: number;
    lng: number;
    note: string;
    neighbourhood: string;
  };
  policies: PolicyBlock[];
  booking: {
    maxGuests: number;
    /** Placeholder nightly rate used for totals once dates are picked (no pricing API). */
    nightlyRate: number;
    promo: { text: string; linkLabel: string; action: string };
  };
  breadcrumbs: LinkItem[];
  exploreNearby: { title: string; subtitle: string; href: string }[];
  otherStays: LinkItem[];
}
