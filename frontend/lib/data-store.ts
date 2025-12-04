export interface Registration {
  id: number;
  companyName: string;
  contactPerson: string;
  designation: string;
  email: string;
  contactNumber: string;
  product: string;
  address: string;
  companyLogo?: string;
  status: "pending" | "contacted" | "paid" | "rejected";
  createdAt: string;
}

export interface Event {
  id: number;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  time: string;
  exhibitors: number;
  buyers: number;
  countries: number;
  sectors: number;
  description: string;
  isPast: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface GalleryImage {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  type: "carousel" | "banner" | "gallery" | "exhibitor";
  displayOrder?: number;
}

export interface SiteSettings {
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroVideoUrl: string;
  heroCtaText: string;

  // About Section
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string;

  // Contact Information
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;

  // Footer
  footerTagline: string;
  socialMediaLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };

  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export const defaultSiteSettings: SiteSettings = {
  heroTitle: "INDO GLOBAL TRADE FAIR 2025",
  heroSubtitle: "Connecting Indian Enterprise with Global Markets",
  heroVideoUrl: "/background-video.mp4",
  heroCtaText: "Register Now",
  aboutTitle: "About Indo Global Trade Fair",
  aboutDescription:
    "India's premier B2B trade platform connecting local excellence with global markets. Inspired by PM Modi's vision of Local to Global.",
  aboutImage: "/about-hero.jpg",
  contactEmail: "info@indoglobaltradefair.com",
  contactPhone: "+91 77381 04011",
  contactAddress: "Mumbai & Dubai",
  footerTagline:
    "Connecting Indian Enterprise with the World through strategic B2B trade platforms.",
  socialMediaLinks: {
    facebook: "https://facebook.com/igtf",
    twitter: "https://twitter.com/igtf",
    linkedin: "https://linkedin.com/company/igtf",
    instagram: "https://instagram.com/igtf",
  },
  metaTitle: "Indo Global Trade Fair 2025 | B2B Trade Platform",
  metaDescription:
    "Join India's premier B2B trade fair connecting manufacturers with global buyers across 16 sectors.",
  keywords: ["trade fair", "B2B exhibition", "India exports", "global trade"],
};



export function getSiteSettings(): SiteSettings {
  return defaultSiteSettings;
}
