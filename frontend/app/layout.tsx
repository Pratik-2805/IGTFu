import type React from "react";
import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import { ScrollAnimation } from "@/lib/scroll-animation";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastContainer } from "react-toastify";
// @ts-ignore: side-effect import of global CSS
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title:
    "Indo Global Trade Fair 2025 - Where Indian Enterprise Meets the World",
  description:
    "Join the premier B2B platform connecting India's MSMEs with global markets. 16 sectors, 400+ exhibitors, 6000+ buyers from 40+ countries.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${playfair.variable} font-sans antialiased overflow-x-hidden max-w-screen`}
      >
        <AuthProvider>{children}</AuthProvider>

        {/* ✅ REACT-TOASTIFY GLOBAL CONFIG */}
        <ToastContainer
          position="top-right"
          autoClose={4000}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" // options: light, dark, colored
        />

        <ScrollAnimation />
      </body>
    </html>
  );
}
