import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider"

import { Footer } from "@/components/layout/footer"
import { FloatingNav } from "@/components/layout/floating-nav"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { CommandPalette } from "@/components/ui/command-palette"
import { BlobCursor } from "@/components/ui/blob-cursor"


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
<ThemeProvider>
            <SmoothScrollProvider>
                <BlobCursor
                  blobType="circle"
                  fillColor="#00ADB5"
                trailCount={3}
                sizes={[60, 125, 75]}
                innerSizes={[20, 35, 25]}
                innerColor="rgba(255,255,255,0.8)"
                opacities={[0.6, 0.6, 0.6]}
                shadowColor="rgba(0,0,0,0.75)"
                shadowBlur={5}
                shadowOffsetX={10}
                shadowOffsetY={10}
                filterStdDeviation={30}
                useFilter={true}
                fastDuration={0.1}
                slowDuration={0.5}
                zIndex={100}
              />
              <ScrollProgress />
              <CommandPalette />
              <FloatingNav />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </SmoothScrollProvider>
          </ThemeProvider>
      </body>
    </html>
  )
}
