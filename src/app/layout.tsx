import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider"

import { Footer } from "@/components/layout/footer"
import { FloatingNav } from "@/components/layout/floating-nav"
import { CustomCursor } from "@/components/ui/custom-cursor"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { CommandPalette } from "@/components/ui/command-palette"
import ClickSpark from "@/components/ui/click-spark"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} bg-black antialiased`}
      >
        <ClickSpark
          sparkColor="#A5C9CA"
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          <ThemeProvider>
            <SmoothScrollProvider>
              <CustomCursor />
              <ScrollProgress />
              <CommandPalette />
              <FloatingNav />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </SmoothScrollProvider>
          </ThemeProvider>
        </ClickSpark>
      </body>
    </html>
  )
}
