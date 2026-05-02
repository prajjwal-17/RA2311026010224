import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import { NotificationsProvider } from "@/state/notification-context";
import "@/app/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Campus Notifications Dashboard",
  description: "Frontend evaluation app for prioritizing campus notifications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${ibmPlexMono.variable}`}>
        <NotificationsProvider>{children}</NotificationsProvider>
      </body>
    </html>
  );
}
