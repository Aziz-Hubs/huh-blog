import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getProfileByUsername } from "@/lib/db/profiles"

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  const profile = await getProfileByUsername(username)

  if (!profile) return {}

  return {
    title: profile.displayName,
    description: profile.bio ?? `Profile for ${profile.displayName}`,
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const profile = await getProfileByUsername(username)

  if (!profile) notFound()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-3xl border bg-card p-8 sm:p-10">
        <Avatar size="lg" className="size-20">
          {profile.avatarUrl ? <AvatarImage src={profile.avatarUrl} alt={`${profile.displayName} avatar`} /> : null}
          <AvatarFallback>{profile.displayName.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-4xl font-semibold tracking-tight">{profile.displayName}</h1>
          {profile.isOwner ? <Badge>Owner</Badge> : null}
        </div>
        <p className="mt-2 text-muted-foreground">@{profile.username}</p>
        {profile.bio ? <p className="mt-6 text-lg leading-8 text-muted-foreground">{profile.bio}</p> : null}
        {profile.websiteUrl ? <a href={profile.websiteUrl} className="mt-6 inline-flex text-sm font-medium text-primary hover:underline" rel="noopener noreferrer" target="_blank">{profile.websiteUrl}</a> : null}
      </div>
    </div>
  )
}
