"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import Wobble from "@/components/ui/wobble"

export default function WobbleDemoPage() {
  const cards = [
    { id: "1", title: "Automated Scripts", category: "Programming" },
    { id: "2", title: "Hash Vaults", category: "Cybersecurity" },
    { id: "3", title: "Model Supervisions", category: "AI" },
  ]

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 space-y-12">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">Demo</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Wobble integration</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Premium tactile micro-interactions: subtle cursor-following tilt and scale-settle transition.
        </p>
      </header>

      {/* Button options grid */}
      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-semibold border-b pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button wobbleProps={{ scale: 1.01 }}>Default button (1.01)</Button>
          <Button wobble={false}>Wobble disabled (wobble=false)</Button>
          <Button wobbleProps={{ scale: 1.05 }} variant="outline">Scale 1.05 button</Button>
          <Button wobbleProps={{ scale: 1.08 }} variant="secondary">Scale 1.08 secondary</Button>
        </div>
      </section>

      {/* Other integrated components showcase */}
      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-semibold border-b pb-2">Primitives</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Switch */}
          <div className="rounded-xl border p-5 flex items-center justify-between bg-card">
            <div>
              <h4 className="font-medium text-sm">Switch Primitive</h4>
              <p className="text-xs text-muted-foreground mt-1">Integrated scale=1.05 wobble</p>
            </div>
            <Switch aria-label="Wobble Switch demo" />
          </div>

          {/* Toggle */}
          <div className="rounded-xl border p-5 flex items-center justify-between bg-card">
            <div>
              <h4 className="font-medium text-sm">Toggle Primitive</h4>
              <p className="text-xs text-muted-foreground mt-1">Default interactive trigger wobble</p>
            </div>
            <Toggle variant="outline" aria-label="Toggle wobble demo">💡 Toggle</Toggle>
          </div>

          {/* Toggle Group */}
          <div className="rounded-xl border p-5 flex items-center justify-between bg-card">
            <div>
              <h4 className="font-medium text-sm">Toggle Group</h4>
              <p className="text-xs text-muted-foreground mt-1">Separate group items wobbling</p>
            </div>
            <ToggleGroup value={["prog"]}>
              <ToggleGroupItem value="prog">AI</ToggleGroupItem>
              <ToggleGroupItem value="sec">Sec</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Select trigger */}
          <div className="rounded-xl border p-5 flex items-center justify-between bg-card">
            <div>
              <h4 className="font-medium text-sm">Select Trigger</h4>
              <p className="text-xs text-muted-foreground mt-1">Interactive trigger menu wobble</p>
            </div>
            <Select>
              <SelectTrigger className="w-[140px]" aria-label="Select demo wobble">
                <SelectValue placeholder="AI Model" />
              </SelectTrigger>
            </Select>
          </div>
        </div>
      </section>

      {/* Tabs list with trigger wobble */}
      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-semibold border-b pb-2">Tabs triggers</h2>
        <div className="rounded-xl border p-6 bg-card flex justify-center">
          <Tabs defaultValue="prog">
            <TabsList>
              <TabsTrigger value="prog">Programming</TabsTrigger>
              <TabsTrigger value="sec">Cybersecurity</TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Interactive hover cards wrapped in Wobble */}
      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-semibold border-b pb-2">Card list wrappers</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <Wobble key={card.id} scale={1.02}>
              <div className="cursor-pointer border rounded-2xl bg-card p-6 shadow-sm hover:border-foreground/10 transition-colors h-full flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase text-muted-foreground tracking-wider">{card.category}</span>
                  <h3 className="font-heading text-lg font-semibold tracking-tight mt-2">{card.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Hover to see subtle cursor parallax and scale settle.</p>
              </div>
            </Wobble>
          ))}
        </div>
      </section>
    </div>
  )
}
