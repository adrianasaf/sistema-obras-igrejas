import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { APP_NAME, APP_SUBTITLE } from "@/lib/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: APP_SUBTITLE,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider localization={ptBR}>
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
    </ClerkProvider>
  );
}
