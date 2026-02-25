import type { Metadata } from "next"
import { Geist, Geist_Mono, Cardo } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider"
import { PageTransitionProvider } from "@/components/providers/page-transition-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { GlobalPrefetcher } from "@/components/providers/global-prefetcher"

import { Footer } from "@/components/layout/footer"
import { FloatingNav } from "@/components/layout/floating-nav"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { CommandPalette } from "@/components/ui/command-palette"



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const cardo = Cardo({
  variable: "--font-cardo",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: {
    default: "Portfolio | Full-Stack Developer & Digital Creator",
    template: "%s | Portfolio",
  },
  description:
    "Full-stack developer building modern, high-performance web applications. Specializing in React, Next.js, TypeScript, and cloud technologies.",
  keywords: [
    "Full-Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Portfolio",
  ],
  authors: [{ name: "Portfolio" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Portfolio",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cardo.variable} bg-black antialiased`}
      >
        <QueryProvider>
          {/* Fires all public queries on first load → stores in localStorage */}
          <GlobalPrefetcher />
          <FloatingNav />
          <ThemeProvider>
            <PageTransitionProvider>
              <SmoothScrollProvider>
                {/* <CircleTrailCursor fillColor="#00ADB5" /> Disabled for performance */}
                <ScrollProgress />
                <CommandPalette />
                <main className="min-h-screen">{children}</main>
                <Footer />
              </SmoothScrollProvider>
            </PageTransitionProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
