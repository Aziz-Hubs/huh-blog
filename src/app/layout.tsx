import type { Metadata } from "next"
import { Geist, Geist_Mono, Noto_Serif } from "next/font/google"
import { Providers } from "@/components/providers"
import { SiteFooter } from "@/components/public/site-footer"
import { SiteHeader } from "@/components/public/site-header"
import { ProgressiveBlur } from "@/components/ui/progressive-blur"
import { NoiseTexture } from "@/components/ui/noise-texture"
import { siteConfig } from "@/lib/env"
import { cn } from "@/lib/utils"
import "./globals.css"

const notoSerif = Noto_Serif({ subsets: ["latin"], variable: "--font-serif" })
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full antialiased", geistSans.variable, geistMono.variable, notoSerif.variable)}
    >
      <body className="min-h-full bg-background font-sans text-foreground relative">
        <Providers>
          {/* Subtle global noise overlay with very low opacity to feel editorial but completely transparent */}
          <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.015] dark:opacity-[0.022]">
            <NoiseTexture frequency={0.75} octaves={4} slope={0.12} noiseOpacity={0.4} />
          </div>
          <div className="relative flex min-h-dvh flex-col pb-16">
            <SiteHeader />
            {/* Top progressive blur sticking right below the header */}
            <div className="pointer-events-none sticky top-16 z-30 h-10 w-full overflow-hidden">
              <ProgressiveBlur height="100%" position="top" />
            </div>
            <main className="flex-1 mt-[-40px]">{children}</main>
            <SiteFooter />
            {/* Bottom progressive blur staying fixed at the bottom viewport edge */}
            <ProgressiveBlur height="48px" position="bottom" className="fixed bottom-0 z-30 h-12" />
          </div>
        </Providers>
      </body>
    </html>
  )
}
