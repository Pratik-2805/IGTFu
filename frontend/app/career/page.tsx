"use client";
import { Navbar } from "@/components/navbar";
import { ChatBot } from "@/components/chat-bot";
import { Footer } from "@/components/footer";

export default function CareerPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative py-32 px-4 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-5xl md:text-6xl mb-6 animate-fade-in">
              Careers
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in-delay-1">
              Join our team and help connect Indian enterprises with the world
            </p>
          </div>
        </section>

        {/* About Working at IGTF */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-4xl mx-auto scroll-animate">
            <h2 className="font-serif text-3xl md:text-4xl mb-6 text-center">
              Why Work With Us?
            </h2>
            <p className="text-muted-foreground leading-relaxed text-center mb-12">
              Be part of a dynamic team that's shaping the future of B2B trade
              in India and beyond. We're looking for passionate individuals who
              want to make a real impact in connecting businesses globally.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-muted/30 p-6 rounded-lg text-center">
                <h4 className="font-serif text-xl mb-3">
                  Growth Opportunities
                </h4>
                <p className="text-sm text-muted-foreground">
                  Continuous learning and career advancement in the
                  international trade industry
                </p>
              </div>
              <div className="bg-muted/30 p-6 rounded-lg text-center">
                <h4 className="font-serif text-xl mb-3">Global Exposure</h4>
                <p className="text-sm text-muted-foreground">
                  Work with international clients and partners from 40+
                  countries
                </p>
              </div>
              <div className="bg-muted/30 p-6 rounded-lg text-center">
                <h4 className="font-serif text-xl mb-3">Dynamic Environment</h4>
                <p className="text-sm text-muted-foreground">
                  Fast-paced, innovative workplace with a collaborative team
                  culture
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl mb-12 text-center scroll-animate">
              Open Positions
            </h2>

            <div className="space-y-6">
              <div className="bg-background p-6 rounded-lg scroll-animate hover:shadow-lg transition-all duration-300">
                <h3 className="font-serif text-xl mb-2">Event Coordinator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Full-time • Mumbai, India
                </p>
                <p className="text-muted-foreground text-sm">
                  Coordinate and manage exhibition events, work with exhibitors
                  and vendors, ensure smooth operations
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg scroll-animate animation-delay-100 hover:shadow-lg transition-all duration-300">
                <h3 className="font-serif text-xl mb-2">
                  Business Development Manager
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Full-time • Mumbai / Dubai
                </p>
                <p className="text-muted-foreground text-sm">
                  Develop business relationships, onboard exhibitors, manage
                  client accounts and partnerships
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg scroll-animate animation-delay-200 hover:shadow-lg transition-all duration-300">
                <h3 className="font-serif text-xl mb-2">
                  Marketing Specialist
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Full-time • Mumbai, India
                </p>
                <p className="text-muted-foreground text-sm">
                  Create marketing campaigns, manage social media, coordinate
                  promotional activities for exhibitions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 scroll-animate">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">
                Apply Now
              </h2>
              <p className="text-lg text-muted-foreground">
                Send us your details and we'll get back to you shortly
              </p>
            </div>

            <form className="bg-muted/30 p-8 rounded-lg shadow-xl scroll-animate space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-2"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-500 outline-none"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-2"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-500 outline-none"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-500 outline-none"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-500 outline-none"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="position"
                  className="block text-sm font-medium mb-2"
                >
                  Position Applied For <span className="text-red-500">*</span>
                </label>
                <select
                  id="position"
                  name="position"
                  required
                  className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-500 outline-none"
                >
                  <option value="">Select position</option>
                  <option value="Event Coordinator">Event Coordinator</option>
                  <option value="Business Development Manager">
                    Business Development Manager
                  </option>
                  <option value="Marketing Specialist">
                    Marketing Specialist
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium mb-2"
                >
                  Resume/CV <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  required
                  className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-500 outline-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  PDF or Word document (max 5MB)
                </p>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Cover Letter/Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-500 outline-none resize-none"
                  placeholder="Tell us why you'd be a great fit..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-md hover:bg-primary/90 transition-all duration-500 font-medium text-lg"
              >
                Submit Application
              </button>
            </form>
          </div>
        </section>
      </div>
      <Footer />
      <ChatBot />
    </div>
  );
}
