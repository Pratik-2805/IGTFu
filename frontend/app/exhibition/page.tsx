"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { ChatBot } from "@/components/chat-bot";
import { Calendar, Clock, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { Footer } from "@/components/footer";

interface FormData {
  company_name: string;
  contact_person_name: string;
  designation: string;
  email_address: string;
  contact_number: string;
  product_category: string;
  company_address: string;
  event_location: string;
}

interface EventData {
  id: number;
  title: string;
  location: string;
  venue: string;
  start_date: string;
  end_date: string;
  time_schedule: string;
  exhibitors_count: string;
  buyers_count: string;
  countries_count: string;
  sectors_count: string;
  is_active: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${BASE_URL}/exhibitor-registrations/`;
const EVENTS_API_URL = `${BASE_URL}/events/`;

export default function ExhibitionPage() {
  const [formData, setFormData] = useState<FormData>({
    company_name: "",
    contact_person_name: "",
    designation: "",
    email_address: "",
    contact_number: "",
    product_category: "",
    company_address: "",
    event_location: "",
  });

  const [events, setEvents] = useState<EventData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // ------------------------------------------------------------------
  // 1. Handle Hash Scroll Logic (Ensures we land on form when navigated)
  // ------------------------------------------------------------------
  useEffect(() => {
    // Check if url has hash
    if (window.location.hash === "#registration-form") {
      // Small timeout to allow DOM to paint
      setTimeout(() => {
        const element = document.getElementById("registration-form");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  }, [loadingEvents]); // Re-run check after events load (which changes page height)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);

        const response = await fetch(EVENTS_API_URL, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          setEvents([]);
          return;
        }

        let data = await response.json();

        if (data && data.results) {
          data = data.results;
        }

        if (!Array.isArray(data)) {
          setEvents([]);
          return;
        }

        const activeEvents = data.filter(
          (ev: EventData) => ev.is_active === true
        );
        setEvents(activeEvents);
      } catch (error) {
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const upcomingEvents = events.filter((ev) => ev.is_active);
  const pastEvents = events.filter((ev) => !ev.is_active);
  const locations = Array.from(new Set(events.map((ev) => ev.location)));

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration submitted successfully!");

        setFormData({
          company_name: "",
          contact_person_name: "",
          designation: "",
          email_address: "",
          contact_number: "",
          product_category: "",
          company_address: "",
          event_location: "",
        });

        window.scrollTo({
          top: document.getElementById("registration-form")?.offsetTop! - 100,
          behavior: "smooth",
        });
      } else {
        const errorMsg = Object.values(data).flat().join(", ");
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error("Failed to submit registration. Check connection.");
    } finally {
      // 👇 NEW: keep the loading state for 0.5 second
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    if (s.getMonth() === e.getMonth()) {
      return `${s.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })}-${e.getDate()}, ${e.getFullYear()}`;
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-20">
        {/* HERO */}
        <section className="relative py-32 px-4 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-5xl md:text-6xl mb-6">
              Exhibitions
            </h1>
            <p className="text-xl text-muted-foreground">
              Join us at our upcoming trade fairs
            </p>
          </div>
        </section>

        {/* EVENTS SECTION */}
        {/* ---------------------------------------------------
            UPCOMING EVENTS
        ---------------------------------------------------- */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl text-center mb-16">
              Upcoming Events
            </h2>

            {loadingEvents ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading events...</p>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-xl">
                  No upcoming events available.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8 mb-20">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-muted/30 p-8 rounded-lg shadow-lg hover:scale-105 transition-transform duration-500"
                  >
                    <h3 className="font-serif text-3xl mb-2">{event.title}</h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </p>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium">
                            {formatDateRange(event.start_date, event.end_date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-medium">{event.time_schedule}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-muted-foreground mt-6 border-t pt-6">
                      <div className="flex justify-between">
                        <span>Exhibitors</span>
                        <span className="font-medium">
                          {event.exhibitors_count}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trade Buyers</span>
                        <span className="font-medium">
                          {event.buyers_count}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Countries</span>
                        <span className="font-medium">
                          {event.countries_count}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sectors</span>
                        <span className="font-medium">
                          {event.sectors_count}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        document
                          .getElementById("registration-form")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md mt-6 hover:bg-primary/90 transition"
                    >
                      Register as Exhibitor
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ---------------------------------------------------
                PAST EVENTS SECTION
            ---------------------------------------------------- */}
            {pastEvents.length > 0 && (
              <>
                <h2 className="font-serif text-4xl md:text-5xl text-center mb-16 mt-20">
                  Past Events
                </h2>

                <div className="grid md:grid-cols-2 gap-8 opacity-90">
                  {pastEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-muted/30 p-8 rounded-lg shadow-lg hover:opacity-100 transition"
                    >
                      <h3 className="font-serif text-3xl mb-2">
                        {event.title}
                      </h3>

                      <p className="text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </p>

                      <div className="mt-6 space-y-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-primary mt-1" />
                          <div>
                            <p className="font-medium">
                              {formatDateRange(
                                event.start_date,
                                event.end_date
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Past Event
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm text-muted-foreground mt-6 border-t pt-6">
                        <div className="flex justify-between">
                          <span>Exhibitors</span>
                          <span className="font-medium">
                            {event.exhibitors_count}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Trade Buyers</span>
                          <span className="font-medium">
                            {event.buyers_count}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Countries</span>
                          <span className="font-medium">
                            {event.countries_count}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sectors</span>
                          <span className="font-medium">
                            {event.sectors_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Attractions Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">
                Exhibition Highlights
              </h2>
              <p className="text-xl text-muted-foreground italic">
                What makes IGTF the premier trade fair in India
              </p>
            </div>

            {/* I kept animations here as they are less critical than the form */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* ... (Highlights Content remains the same) ... */}
              {/* For brevity, assuming the content here is the same as your code */}
              <div className="bg-background p-8 rounded-lg shadow-lg hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
                <h4 className="font-serif text-xl mb-4">Prime Location</h4>
                <p className="text-muted-foreground">
                  Strategically hosted at Bombay Exhibitions Center...
                </p>
              </div>
              <div className="bg-background p-8 rounded-lg shadow-lg hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
                <h4 className="font-serif text-xl mb-4">16 Dynamic Sectors</h4>
                <p className="text-muted-foreground">
                  Hardware & Tools, Toys, Chemical, Electronics...
                </p>
              </div>
              <div className="bg-background p-8 rounded-lg shadow-lg hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
                <h4 className="font-serif text-xl mb-4">
                  Global Participation
                </h4>
                <p className="text-muted-foreground">
                  Drawing exhibitors and buyers from more than 40 countries,
                  offering opportunities for cross-border collaborations.
                </p>
              </div>

              <div className="bg-background p-8 rounded-lg shadow-lg hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
                <h4 className="font-serif text-xl mb-4">Extensive B2B Focus</h4>
                <p className="text-muted-foreground">
                  Premier platform bringing together manufacturers, exporters,
                  distributors, and key decision-makers for meaningful business
                  connections.
                </p>
              </div>

              <div className="bg-background p-8 rounded-lg shadow-lg hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
                <h4 className="font-serif text-xl mb-4">
                  Hosted Buyer Program
                </h4>
                <p className="text-muted-foreground">
                  Exclusive initiative matching exhibitors with qualified
                  buyers, ensuring focused meetings and higher conversion
                  opportunities.
                </p>
              </div>

              <div className="bg-background p-8 rounded-lg shadow-lg hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
                <h4 className="font-serif text-xl mb-4">
                  Networking Opportunities
                </h4>
                <p className="text-muted-foreground">
                  Platform for industry professionals to connect, collaborate,
                  and grow their business through strategic partnerships.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section
          id="registration-form"
          className="py-20 px-4 bg-background scroll-mt-20"
        >
          <div className="max-w-3xl mx-auto">
            {/* FIX: Removed 'scroll-animate' from this div 
               This ensures the title is visible even if animation JS fails 
            */}
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">
                Register as Exhibitor
              </h2>
              <p className="text-lg text-muted-foreground">
                Fill out the form below to register your company for the Indo
                Global Trade Fair
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-muted/30 p-8 rounded-lg shadow-xl space-y-6"
            >
              <div>
                <label
                  htmlFor="event_location"
                  className="block text-sm font-medium mb-2"
                >
                  Exhibition Location <span className="text-red-500">*</span>
                </label>

                <select
                  id="event_location"
                  name="event_location"
                  value={formData.event_location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md bg-background border border-border 
               focus:border-primary focus:ring-2 focus:ring-primary/20 
               transition-all duration-500 outline-none"
                >
                  <option value="">Select a location</option>

                  {locations.map((loc, index) => (
                    <option key={index} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="company_name"
                  className="block text-sm font-medium mb-2"
                >
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-500 outline-none"
                  placeholder="Enter your company name"
                />
              </div>

              {/* ... Rest of the inputs (Company Person, Designation, etc.) ... */}
              {/* I'm including the rest of the inputs here for copy-paste ease */}

              <div>
                <label
                  htmlFor="contact_person_name"
                  className="block text-sm font-medium mb-2"
                >
                  Contact Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contact_person_name"
                  name="contact_person_name"
                  value={formData.contact_person_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-500 outline-none"
                  placeholder="Enter contact person name"
                />
              </div>

              <div>
                <label
                  htmlFor="designation"
                  className="block text-sm font-medium mb-2"
                >
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-500 outline-none"
                  placeholder="Enter designation"
                />
              </div>

              <div>
                <label
                  htmlFor="email_address"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email_address"
                  name="email_address"
                  value={formData.email_address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-500 outline-none"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label
                  htmlFor="contact_number"
                  className="block text-sm font-medium mb-2"
                >
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="contact_number"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-500 outline-none"
                  placeholder="Enter contact number"
                />
              </div>

              <div>
                <label
                  htmlFor="product_service"
                  className="block text-sm font-medium mb-2"
                >
                  Product/Service <span className="text-red-500">*</span>
                </label>
                <select
                  id="product_service"
                  name="product_category"
                  value={formData.product_category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-500 outline-none"
                >
                  <option value="">Select your industry sector</option>
                  <option value="Hardware & Tools">Hardware & Tools</option>
                  <option value="Toys">Toys</option>
                  <option value="Chemical">Chemical</option>
                  <option value="Electronics & Components">
                    Electronics & Components
                  </option>
                  <option value="Auto Parts">Auto Parts</option>
                  <option value="Construction Material">
                    Construction Material
                  </option>
                  <option value="Agriculture & Equipment's">
                    Agriculture & Equipment's
                  </option>
                  <option value="Plastic & Packaging">
                    Plastic & Packaging
                  </option>
                  <option value="Sports">Sports</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Pharma">Pharma</option>
                  <option value="Surgical Devices">Surgical Devices</option>
                  <option value="Gifting & Stationary">
                    Gifting & Stationary
                  </option>
                  <option value="Furniture">Furniture</option>
                  <option value="Kitchen Wear">Kitchen Wear</option>
                  <option value="Spices">Spices</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Home Décor">Home Décor</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="company_address"
                  className="block text-sm font-medium mb-2"
                >
                  Company Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="company_address"
                  name="company_address"
                  value={formData.company_address}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-500 outline-none resize-none"
                  placeholder="Enter complete company address"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-8 py-4 rounded-md transition-all duration-500 font-medium text-lg ${
                  isSubmitting
                    ? "bg-primary/50 text-primary-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </button>
            </form>
          </div>
        </section>
      </div>

      <ChatBot />
      <Footer />
    </div>
  );
}
