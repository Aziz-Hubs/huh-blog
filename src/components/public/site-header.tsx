import Link from "next/link"
import { Menu, Rss } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { UserMenu } from "@/components/shared/user-menu"
import { siteConfig } from "@/lib/env"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/blog", label: "Blog" },
  { href: "/search", label: "Search" },
  { href: "/tags", label: "Tags" },
  { href: "/about", label: "About" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-heading text-lg font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn(buttonVariants({ variant: "ghost" }), "text-muted-foreground")}> 
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link href="/rss.xml" className={buttonVariants({ variant: "ghost", size: "icon" })} aria-label="RSS feed">
            <Rss className="size-4" />
          </Link>
          <AnimatedThemeToggler className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8")} />
          <UserMenu />
          <Sheet>
            <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")} aria-label="Open menu">
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6">
              <div className="flex flex-col gap-4 pt-8">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="text-lg font-medium">
                    {item.label}
                  </Link>
                ))}
                <Link href="/login" className="text-lg font-medium">Sign in</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
