import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Kindred - Social Development Events Platform",
  description: "Empowering communities through grassroots social service, winter drives, blood camps, and tree plantations in Dhaka.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="min-h-screen flex flex-col justify-between bg-stone-900 text-stone-100 dark:bg-[#16100c] dark:text-[#f3ede6] light:bg-[#faf7f2] light:text-[#231710] transition-colors duration-300 font-sans selection:bg-[#c85a32] selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#231812",
                  color: "#f8f5ee",
                  border: "1px solid rgba(226, 118, 74, 0.2)",
                  borderRadius: "16px",
                  fontSize: "14px",
                },
                success: {
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#ffffff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#ffffff",
                  },
                },
              }}
            />
            <div className="flex flex-col min-h-screen">
              <Suspense fallback={<div className="h-20 bg-stone-900/90 border-b border-stone-800/60" />}>
                <Navbar />
              </Suspense>
              <main className="grow">
                <Suspense
                  fallback={
                    <div className="min-h-[50vh] flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-2 border-[#c85a32] border-t-transparent animate-spin" />
                    </div>
                  }
                >
                  {children}
                </Suspense>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
