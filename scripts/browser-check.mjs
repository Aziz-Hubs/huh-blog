import { chromium } from "playwright"

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000"
const paths = [
  "/",
  "/blog",
  "/search",
  "/blog/i-automated-the-task-i-was-avoiding",
  "/login",
  "/register",
  "/dashboard",
  "/dashboard/posts/new",
  "/account/profile",
]

const issues = []
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1366, height: 900 } })

for (const path of paths) {
  const page = await context.newPage()

  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      issues.push(`${path} console ${message.type()}: ${message.text()}`)
    }
  })
  page.on("pageerror", (error) => issues.push(`${path} page error: ${error.message}`))

  const response = await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" })
  if (!response || response.status() >= 400) {
    issues.push(`${path} returned status ${response?.status()}`)
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  )
  if (overflow) issues.push(`${path} has horizontal overflow`)

  if (path === "/search") {
    await page.fill('input[name="q"]', "AI")
    await page.click('button:has-text("Search")')
    await page.waitForLoadState("networkidle")
    const hasResult = await page.getByText("AI agents and the art of supervised laziness").count()
    if (!hasResult) issues.push("/search did not show expected AI result")
  }

  if (path === "/login") {
    await page.fill('input[name="email"]', "not-an-email")
    await page.click('button[type="submit"]')
    const hasError = await page.getByText("Enter a valid email address").count()
    if (!hasError) issues.push("/login did not show email validation error")
  }

  if (path === "/register") {
    await page.fill('input[name="email"]', "reader@example.com")
    await page.fill('input[name="password"]', "short")
    await page.fill('input[name="username"]', "Bad User")
    await page.fill('input[name="displayName"]', "A")
    await page.click('button[type="submit"]')
    const hasPasswordError = await page.getByText("Password must be at least 8 characters").count()
    const hasUsernameError = await page.getByText("Use lowercase letters").count()
    if (!hasPasswordError || !hasUsernameError) {
      issues.push("/register did not show expected validation errors")
    }
  }

  if (path === "/blog/i-automated-the-task-i-was-avoiding") {
    await page.fill("#comment", "A browser-filled test comment")
    await page.click('button:has-text("Post comment")')
    await page.waitForTimeout(500)
    const toast = await page.getByText("Connect Supabase environment variables").count()
    if (!toast) issues.push("/post comment form did not show setup toast without Supabase")
  }

  if (path === "/dashboard/posts/new") {
    await page.fill('input[name="title"]', "Browser test draft")
    await page.fill('textarea[name="excerpt"]', "A short browser test excerpt.")
    await page.fill('textarea[name="content"]', "# Browser test\n\nThis verifies the editor.")
    await page.click('button:has-text("Save post")')
    await page.waitForTimeout(500)
    const toast = await page.getByText("Connect Supabase to save posts").count()
    if (!toast) issues.push("/dashboard/posts/new did not show setup toast without Supabase")
  }

  await page.close()
}

await browser.close()

if (issues.length) {
  console.error(issues.join("\n"))
  process.exit(1)
}

console.log("Browser interaction checks passed")
