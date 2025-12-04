import { useAuth } from "@/hooks/useAuth";

// --- Configuration ---
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const URLS = {
  EXHIBITORS: `${BASE_URL}/exhibitor-registrations/`,
  VISITORS: `${BASE_URL}/visitor-registrations/`,
  EVENTS: `${BASE_URL}/events/`,
  CATEGORIES: `${BASE_URL}/categories/`,
  GALLERY: `${BASE_URL}/gallery/`,
};

// --- Helper ---
export const useAuthHeaders = () => {
  const { access } = useAuth();

  return () => {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (access) {
      headers.Authorization = `Bearer ${access}`;
    }

    return headers;
  };
};

// --- Interfaces ---

// Exhibitor
export interface ExhibitorRegistration {
  id: number;
  company_name: string;
  contact_person_name: string;
  designation: string;
  email_address: string;
  contact_number: string;
  product_category: string;
  company_address: string;
  event_location: string;
  status: "pending" | "contacted" | "paid" | "rejected";
  created_at: string;
}

// Visitor
export interface VisitorRegistration {
  id: number;
  first_name: string;
  last_name: string;
  company_name: string;
  email_address: string;
  phone_number: string;
  industry_interest: string;
  created_at: string;
  event_location: string;
  status: "pending" | "contacted" | "paid" | "rejected";
}

// Event
export interface Event {
  id: number;
  title: string;
  location: string;
  start_date: string;
  end_date: string;
  time: string;
  exhibitors: number;
  buyers: number;
  countries: number;
  sectors: number;
  description: string;
  is_active: boolean;
}

// Category (clean)
export interface Category {
  id: number;
  name: string;
  image: string;
  created_at: string;
}

// Gallery (clean)
export interface GalleryImage {
  id: number;
  image: string;

  page: "about" | "gallery";
  section:
    | "banner"
    | "why_exhibit"
    | "why_choose_igtf"
    | "main"
    | "exhibition_moments";

  display_order: number;
  created_at: string;
}
