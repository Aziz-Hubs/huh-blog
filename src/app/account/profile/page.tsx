import type { Metadata } from "next"
import { ProfileSettingsForm } from "@/components/account/profile-settings-form"

export const metadata: Metadata = { title: "Profile Settings" }

export default function AccountProfilePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <ProfileSettingsForm />
    </div>
  )
}
