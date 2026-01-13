import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WaterDataProvider } from "@/context/WaterDataContext";

export const metadata: Metadata = {
  title: "Water Reminder",
  description: "Track your daily hydration",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hydrate",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#007AFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WaterDataProvider>
          {children}
        </WaterDataProvider>
      </body>
    </html>
  );
}
