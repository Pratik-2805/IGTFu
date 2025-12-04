"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatBot } from "@/components/chat-bot";
import { CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

interface VisitorFormData {
  first_name: string;
  last_name: string;
  company_name: string;
  email_address: string;
  phone_number: string;
  industry_interest: string;
  event_location: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${BASE_URL}/visitor-registrations/`;

export default function VisitorsPage() {
  const [formData, setFormData] = useState<VisitorFormData>({
    first_name: "",
    last_name: "",
    company_name: "",
    email_address: "",
    phone_number: "",
    industry_interest: "",
    event_location: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/events/`);
        if (!response.ok) return;

        let data = await response.json();
        if (data?.results) data = data.results;

        const activeEvents = Array.isArray(data)
          ? data.filter((ev: any) => ev.is_active)
          : [];

        setEvents(activeEvents);
      } catch (e) {
      }
    };

    fetchEvents();
  }, []);

  const locations = Array.from(new Set(events.map((ev) => ev.location)));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        mode: "cors",
      });

      if (response.ok) {
        toast.success("Registration submitted successfully!");

        setFormData({
          first_name: "",
          last_name: "",
          company_name: "",
          email_address: "",
          phone_number: "",
          industry_interest: "",
          event_location: "",
        });
      } else {
        const data = await response.json();
        const errorMsg = Object.values(data).flat().join(", ");
        toast.error(`Error: ${errorMsg}`);
      }
    } catch (error) {
      toast.error(
        "Failed to submit registration. Please ensure the backend is running."
      );
    } finally {
      // 👇 add artificial delay
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500); // 0.5 second
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        {/* Why Visit */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl text-center mb-16 scroll-animate">
              Why Visit IGTF?
            </h2>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="space-y-6 scroll-animate-left">
                <h3 className="font-serif text-2xl">For Trade Buyers</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      Source directly from 400+ manufacturers and exporters
                      across 16 industry sectors
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      Discover new products, innovations, and cutting-edge
                      solutions for your business
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      Network with industry leaders and establish valuable
                      business partnerships
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      Compare prices, quality, and terms from multiple suppliers
                      in one location
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-6 scroll-animate-right">
                <h3 className="font-serif text-2xl">
                  For Industry Professionals
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      Stay updated with the latest industry trends and market
                      insights
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      Attend seminars and workshops by industry experts
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      Explore career opportunities and business collaborations
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      Connect with global trade professionals from 40+ countries
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Benefits */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl text-center mb-16 scroll-animate">
              Visitor Registration Benefits
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-8 rounded-lg scroll-animate-card hover:-translate-y-2 transition-all duration-300 shadow-lg">
                <h4 className="font-serif text-xl mb-4">Free Entry Pass</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Get complimentary access to all three days of the exhibition
                  with pre-registration
                </p>
              </div>

              <div className="bg-background p-8 rounded-lg scroll-animate-card animation-delay-100 hover:-translate-y-2 transition-all duration-300 shadow-lg">
                <h4 className="font-serif text-xl mb-4">Priority Access</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Skip the queues with fast-track entry and priority access to
                  special sessions
                </p>
              </div>

              <div className="bg-background p-8 rounded-lg scroll-animate-card animation-delay-200 hover:-translate-y-2 transition-all duration-300 shadow-lg">
                <h4 className="font-serif text-xl mb-4">Event Updates</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Receive exclusive updates about exhibitors, floor plans, and
                  special events
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section
          id="visitor-registration"
          className="py-20 px-4 bg-background scroll-mt-20"
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">
                Register as Visitor
              </h2>
              <p className="text-lg text-muted-foreground">
                Fill out the form below to register for the Indo Global Trade
                Fair
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="bg-muted/30 p-8 rounded-lg shadow-xl space-y-6"
            >
              {/* LOCATION */}
              <div>
                <label
                  htmlFor="visitor_location"
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

              {/* FIRST + LAST NAME */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium mb-2"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-md bg-background border border-border 
                    focus:border-primary focus:ring-2 focus:ring-primary/20 
                    transition-all duration-500 outline-none"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium mb-2"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-md bg-background border border-border 
                    focus:border-primary focus:ring-2 focus:ring-primary/20 
                    transition-all duration-500 outline-none"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              {/* COMPANY NAME */}
              <div>
                <label
                  htmlFor="company_name"
                  className="block text-sm font-medium mb-2"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md bg-background border border-border 
                  focus:border-primary focus:ring-2 focus:ring-primary/20 
                  transition-all duration-500 outline-none"
                  placeholder="Enter company name"
                />
              </div>

              {/* EMAIL */}
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
                  className="w-full px-4 py-3 rounded-md bg-background border border-border 
                  focus:border-primary focus:ring-2 focus:ring-primary/20 
                  transition-all duration-500 outline-none"
                  placeholder="Enter email address"
                />
              </div>

              {/* PHONE */}
              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium mb-2"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md bg-background border border-border 
                  focus:border-primary focus:ring-2 focus:ring-primary/20 
                  transition-all duration-500 outline-none"
                  placeholder="Enter phone number"
                />
              </div>

              {/* INDUSTRY INTEREST */}
              <div>
                <label
                  htmlFor="industry_interest"
                  className="block text-sm font-medium mb-2"
                >
                  Industry Interest <span className="text-red-500">*</span>
                </label>
                <select
                  id="industry_interest"
                  name="industry_interest"
                  value={formData.industry_interest}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md bg-background border border-border 
                  focus:border-primary focus:ring-2 focus:ring-primary/20 
                  transition-all duration-500 outline-none"
                >
                  <option value="">Select an industry</option>
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
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Pharma">Pharma</option>
                  <option value="Surgical Devices">Surgical Devices</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>

              {/* SUBMIT BUTTON */}
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
