import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Skaakee - 3D Chess",
  description: "Play Chess in 3D, across browser and Apple Vision Pro!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body>{children}</body>
        <Toaster />
      </ThemeProvider>
    </html>
  );
}
