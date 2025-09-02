import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: "Schema Visualizer - Database Schema Designer",
  description: "Professional database schema designer and visualizer built with Next.js, TypeScript, and React Flow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased`}
      >
        <AppProvider>
          {children}
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 3000,
            }}
          />
        </AppProvider>
      </body>
    </html>
  );
}
