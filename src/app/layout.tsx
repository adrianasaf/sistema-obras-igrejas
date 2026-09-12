import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import { APP_NAME, APP_SUBTITLE, APP_VERSION } from "@/lib/app";
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
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <Sidebar nome={APP_NAME} subtitulo={APP_SUBTITLE} />
          <div className="flex min-w-0 flex-1 flex-col">
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <div className="mx-auto max-w-6xl">{children}</div>
            </main>
            <footer className="border-t border-border">
              <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <p>{APP_NAME} · Uso interno</p>
                <p className="font-mono">Versão {APP_VERSION}</p>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
