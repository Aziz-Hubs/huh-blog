"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Bell, Bookmark, LayoutDashboard, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

type MenuState = { email: string | null; isOwner: boolean }

export function UserMenu() {
  const [state, setState] = useState<MenuState>({ email: null, isOwner: false })
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!supabase) return
      const { data } = await supabase.auth.getUser()
      if (!data.user || cancelled) return
      const { data: owner } = await supabase.rpc("is_blog_owner")
      if (!cancelled) setState({ email: data.user.email ?? null, isOwner: owner === true })
    }

    load()
    return () => {
      cancelled = true
    }
  }, [supabase])

  if (!state.email) {
    return <Button render={<Link href="/login" />} nativeButton={false} variant="outline" className="animated-button hidden sm:inline-flex">Sign in</Button>
  }

  async function signOut() {
    await supabase?.auth.signOut()
    window.location.href = "/"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <User className="size-4" /> Account
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{state.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/account/profile" />}><User className="size-4" /> Profile settings</DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/account/saved" />}><Bookmark className="size-4" /> Saved posts</DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard/notifications" />}><Bell className="size-4" /> Notifications</DropdownMenuItem>
        {state.isOwner ? <DropdownMenuItem render={<Link href="/dashboard" />}><LayoutDashboard className="size-4" /> Dashboard</DropdownMenuItem> : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}><LogOut className="size-4" /> Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
