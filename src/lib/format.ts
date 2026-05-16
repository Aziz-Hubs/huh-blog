import { format, formatDistanceToNowStrict } from "date-fns"

export function formatDate(value: string | null | undefined) {
  if (!value) return "Unpublished"
  return format(new Date(value), "MMM d, yyyy")
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "Not set"
  return format(new Date(value), "MMM d, yyyy 'at' h:mm a")
}

export function timeAgo(value: string | null | undefined) {
  if (!value) return "recently"
  return `${formatDistanceToNowStrict(new Date(value))} ago`
}

export function absoluteUrl(path: string, baseUrl: string) {
  return new URL(path, baseUrl).toString()
}
