import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inspire India Founder Circle",
  description: "A premium live voting platform for Inspire India Founder Circle events.",
  icons: {
    icon: "/inspire-logo.png",
    apple: "/inspire-logo.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
