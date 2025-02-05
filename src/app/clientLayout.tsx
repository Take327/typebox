"use client";

import { ProcessingProvider } from "@/context/ProcessingContext";
import { SessionProvider } from "next-auth/react";
import Footer from "./components/Footer";
import { Flowbite } from "flowbite-react";
import customTheme from "./components/Flowbit/customTheme";
import Header from "./components/Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ProcessingProvider>
        <Header />
        <Flowbite theme={{ theme: customTheme }}>
          <main className="min-h-[calc(100vh-42px)] flex-grow bg-gray-100">{children}</main>
        </Flowbite>
        <Footer />
      </ProcessingProvider>
    </SessionProvider>
  );
}
