"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const tradeData = {
  event: {
    name: "Indo Global Trade Fair",
    tagline: "Where Indian Enterprise Meets the World",
    location: "Bombay Exhibitions Center",
    date: "December 2025",
    duration: "3 Days",
    timing: "10:00 AM - 7:00 PM",
  },
  stats: {
    exhibitors: "400+",
    buyers: "6000+",
    countries: "40+",
    sectors: "16",
  },
  sectors: [
    "Hardware & Tools",
    "Toys",
    "Chemical",
    "Electronics & Components",
    "Auto Parts",
    "Construction Material",
    "Agriculture & Equipment's",
    "Plastic & Packaging",
    "Sports",
    "Food & Beverage",
    "Pharma",
    "Surgical Devices",
    "Gifting & Stationary",
    "Furniture",
    "Kitchen Wear",
    "Spices",
    "Footwear",
    "Home Décor",
  ],
  attractions: [
    {
      title: "Prime Location",
      description:
        "Strategically hosted at Bombay Exhibitions Center with exceptional visibility and footfall, ensuring maximum exposure for exhibitors.",
    },
    {
      title: "16 Dynamic Sectors",
      description:
        "Hardware & Tools, Toys, Chemical, Electronics, Auto Parts, Construction Material, Agriculture, and more representing diverse industries.",
    },
    {
      title: "Global Participation",
      description:
        "Drawing exhibitors and buyers from more than 40 countries, offering opportunities for cross-border collaborations.",
    },
    {
      title: "Extensive B2B Focus",
      description:
        "Premier platform bringing together manufacturers, exporters, distributors, and key decision-makers for meaningful business connections.",
    },
    {
      title: "Hosted Buyer Program",
      description:
        "Exclusive initiative matching exhibitors with qualified buyers, ensuring focused meetings and higher conversion opportunities.",
    },
    {
      title: "Networking Opportunities",
      description:
        "Platform for industry professionals to connect, collaborate, and grow their business through strategic partnerships.",
    },
  ],
  exhibitions: [
    {
      name: "IGTF Mumbai 2025",
      location: "Bombay Exhibitions Center",
      date: "December 2025",
      duration: "3-Day Exhibition",
    },
    {
      name: "IGTF Dubai 2025",
      location: "Dubai Exhibition Center",
      date: "February 2025",
      duration: "3-Day Exhibition",
    },
  ],
};

function getBotResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  // Greetings
  if (message.match(/^(hi|hello|hey|greetings)/)) {
    return "Hello! Welcome to Indo Global Trade Fair 2025. How can I assist you today? You can ask about event details, exhibitor registration, visitor information, or any of our 16 sectors.";
  }

  // Event details
  if (
    message.includes("when") ||
    message.includes("date") ||
    message.includes("time")
  ) {
    return `The Indo Global Trade Fair will be held in ${tradeData.event.date} at ${tradeData.event.location}. The event runs for ${tradeData.event.duration}, from ${tradeData.event.timing} daily.`;
  }

  if (
    message.includes("where") ||
    message.includes("location") ||
    message.includes("venue")
  ) {
    return `The event will be held at ${tradeData.event.location}. We also have an upcoming exhibition in Dubai at Dubai Exhibition Center in February 2025.`;
  }

  // Registration
  if (message.includes("register") || message.includes("registration")) {
    if (message.includes("exhibitor")) {
      return "To register as an exhibitor, please click on the 'Exhibitor Registration' button on our homepage. You'll gain access to 6000+ trade buyers from 40+ countries and can showcase your products across our 16 sectors.";
    }
    if (message.includes("visitor")) {
      return "To register as a visitor, click the 'Visitors Registration' button on our homepage. Entry is free for trade visitors, and you'll get access to 400+ exhibitors from diverse industries.";
    }
    return "We offer both Exhibitor Registration and Visitor Registration. Exhibitors can showcase their products to a global audience, while visitors can explore 400+ exhibitors across 16 sectors. Which would you like to know more about?";
  }

  // Stats and numbers
  if (message.includes("exhibitor") && message.includes("how many")) {
    return `We're expecting ${tradeData.stats.exhibitors} exhibitors from various industries, showcasing products across ${tradeData.stats.sectors} sectors.`;
  }

  if (message.includes("buyer") || message.includes("visitor")) {
    return `The fair attracts ${tradeData.stats.buyers} trade buyers from ${tradeData.stats.countries} countries, providing excellent networking and business opportunities.`;
  }

  // Sectors
  if (
    message.includes("sector") ||
    message.includes("categor") ||
    message.includes("industr") ||
    message.includes("product")
  ) {
    return `We feature 16 dynamic sectors including: ${tradeData.sectors
      .slice(0, 8)
      .join(", ")}, and more. Which sector are you interested in?`;
  }

  // Benefits
  if (
    message.includes("why") &&
    (message.includes("exhibit") || message.includes("participate"))
  ) {
    return "Exhibiting at IGTF offers: Network with international buyers from 40+ countries, Boost brand visibility with exclusive media coverage, Connect with 6000+ trade buyers and industry leaders, and access to our Hosted Buyer Program for qualified meetings.";
  }

  if (message.includes("benefit") || message.includes("advantage")) {
    return "Key benefits include: Prime location at Bombay Exhibitions Center, Access to 6000+ qualified buyers, 16 diverse sectors under one roof, Extensive B2B networking, Hosted Buyer Program, and Global participation from 40+ countries.";
  }

  // Attractions
  if (
    message.includes("attraction") ||
    message.includes("feature") ||
    message.includes("highlight")
  ) {
    const randomAttraction =
      tradeData.attractions[
        Math.floor(Math.random() * tradeData.attractions.length)
      ];
    return `One of our key attractions is: ${randomAttraction.title} - ${randomAttraction.description} Would you like to know about other attractions?`;
  }

  // About
  if (message.includes("about") || message.includes("what is")) {
    return `${tradeData.event.name} is a premier B2B platform where Indian Enterprise Meets the World. Inspired by PM Narendra Modi's vision of "Local to Global", we connect India's MSMEs with international markets through our comprehensive trade fair featuring ${tradeData.stats.sectors} sectors.`;
  }

  // Contact
  if (
    message.includes("contact") ||
    message.includes("reach") ||
    message.includes("phone") ||
    message.includes("email")
  ) {
    return "For inquiries, please use the registration forms on our website. Our team will contact you shortly. You can also find detailed information about exhibitor packages and visitor registration on the homepage.";
  }

  // Cost/Pricing
  if (
    message.includes("cost") ||
    message.includes("price") ||
    message.includes("fee")
  ) {
    return "For detailed pricing information about exhibitor stalls and sponsorship packages, please fill out the Exhibitor Registration form. Visitor entry is complimentary for trade visitors. Our team will provide you with customized packages based on your requirements.";
  }

  // Dubai event
  if (message.includes("dubai")) {
    return `Yes! We're also hosting IGTF Dubai 2025 at Dubai Exhibition Center in February 2025. It's a 3-day exhibition featuring the same 16 sectors with 400+ exhibitors and 6000+ buyers from 40+ countries.`;
  }

  // Default response
  return "I'd be happy to help you with information about Indo Global Trade Fair! You can ask me about event dates, registration process, sectors, exhibitor benefits, visitor information, or any other details. What would you like to know?";
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Welcome to Indo Global Trade Fair 2025! How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const appHeight = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };

    appHeight();
    window.addEventListener("resize", appHeight);

    return () => window.removeEventListener("resize", appHeight);
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot typing delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 z-50 hover:scale-110 transition-transform duration-700 ease-out flex items-center justify-center text-primary-foreground"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-96 sm:h-[600px] bg-card border-t sm:border border-border sm:rounded-lg shadow-2xl z-[9999] flex flex-col overflow-hidden animate-slide-up"
          style={{
            height: "var(--app-height)",
            maxHeight: "var(--app-height)",
          }}
        >
          <div className="bg-primary text-primary-foreground p-3 sm:p-4 sm:rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base">
                  IGTF Assistant
                </h3>
                <p className="text-xs opacity-90">Ask me anything!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-white/10 rounded-md p-1.5 sm:p-2 transition-colors duration-300"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 sm:py-2.5 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              />
              <button
                onClick={handleSend}
                className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 hover:scale-105 transition-all duration-500 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
