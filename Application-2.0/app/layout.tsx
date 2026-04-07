import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* -------------------------------------------------------------------------- */
/* SECTION 1: CONTEXT PROVIDERS (Backend/State Wrappers)                      */
/* These wrap the app to provide real-time data and state globally            */
/* -------------------------------------------------------------------------- */
import { PresenceProvider } from "@/context/PresenceContext";
import { ChatProvider } from "@/context/ChatContext";

/* -------------------------------------------------------------------------- */
/* SECTION 2: GLOBAL UI COMPONENTS (Frontend Layout)                          */
/* Elements that persist across all pages (Nav, Chat, Footer)                 */
/* -------------------------------------------------------------------------- */
import GlobalNav from "@/components/GlobalNav";
import FloatingChatShell from "@/components/messaging/FloatingChatShell";
import ConditionalFooter from "@/components/ConditionalFooter";
import { Suspense } from "react";

/* -------------------------------------------------------------------------- */
/* SECTION 3: ASSETS & METADATA (Configuration)                               */
/* Font definitions and SEO metadata                                          */
/* -------------------------------------------------------------------------- */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Outty | Adventure Awaits",
  description: "Find your next adventure partner.",
};

/* -------------------------------------------------------------------------- */
/* SECTION 4: ROOT RENDER (Main Architecture)                                 */
/* Defines the HTML structure and component nesting order                     */
/* -------------------------------------------------------------------------- */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-[#022c22] overflow-x-hidden">
        {/* 4.1 State Layer: Presence and Chat data flow starts here */}
        <PresenceProvider>
          <ChatProvider>
            {/* 4.2 Global Navigation: Fixed at the very top */}
            <Suspense fallback={<div className="h-20" />}>
              <GlobalNav />
            </Suspense>

            {/* 4.3 Page Wrapper: Flex column ensures footer is pushed to bottom */}
            <div className="relative min-h-screen flex flex-col">
              <main className="flex-grow">{children}</main>

              {/* 4.4 Conditional Footer: Part of the flex flow */}
              <Suspense fallback={null}>
                <ConditionalFooter />
              </Suspense>
            </div>

            {/* 4.5 Global Overlays: Floating Chat stays on top of everything */}
            <Suspense fallback={null}>
              <FloatingChatShell />
            </Suspense>
          </ChatProvider>
        </PresenceProvider>
      </body>
    </html>
  );
}
