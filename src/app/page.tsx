"use client";

import Link from "next/link";
import {
  ArrowRight,
  LayoutGrid,
  Bot,
  Workflow,
  BarChart3,
  Code2,
  PenLine,
  Search,
  Users,
  Mail,
  Image,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    title: "Infinite Canvas",
    description:
      "A boundless visual workspace to design, connect, and orchestrate AI agents and tools with drag-and-drop simplicity.",
    icon: LayoutGrid,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "AI Agents",
    description:
      "Deploy specialized agents for research, writing, coding, analysis, and more — all working together in real time.",
    icon: Bot,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Workflow Engine",
    description:
      "Build powerful multi-step workflows with branching, approvals, memory, and version control built in.",
    icon: Workflow,
    gradient: "from-amber-500 to-orange-500",
  },
];

const STATS = [
  { value: "8", label: "Block Types" },
  { value: "4", label: "Workflow Templates" },
  { value: "Real-time", label: "Execution" },
  { value: "Version", label: "Control" },
];

const BLOCK_ICONS = [
  { icon: Search, label: "Research", color: "#3b82f6" },
  { icon: PenLine, label: "Writer", color: "#8b5cf6" },
  { icon: BarChart3, label: "Analyst", color: "#f59e0b" },
  { icon: Code2, label: "Coder", color: "#10b981" },
  { icon: Users, label: "CRM", color: "#ec4899" },
  { icon: Mail, label: "Email", color: "#ef4444" },
  { icon: Image, label: "Image", color: "#14b8a6" },
  { icon: ShieldCheck, label: "Approval", color: "#f97316" },
];

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-cyan-500/8 blur-3xl" />
      </div>

      <section className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-24 sm:pt-32 lg:pt-40">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs text-zinc-400 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Visual AI-native workspace
        </div>

        <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Beyond the Chatbot
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-center text-base leading-relaxed text-zinc-400 sm:text-lg">
          AI Canvas OS — A visual workspace where you orchestrate AI agents,
          tools, documents, and workflows. No more dashboards. No more chatbots.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/canvas">
            <Button size="lg" className="h-11 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20">
              Open Canvas
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="lg"
              className="h-11 border-zinc-700 text-zinc-300 hover:bg-zinc-800/50"
            >
              View Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-200">{stat.value}</span>
              <span className="text-xs text-zinc-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 pt-20 pb-12 sm:pt-28">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm transition-all hover:border-zinc-700/60 hover:bg-zinc-900/60"
              >
                <CardContent className="p-6">
                  <div
                    className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient} bg-opacity-10`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-zinc-100">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 pb-24 sm:pb-32">
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-8 backdrop-blur-sm sm:p-12">
          <h2 className="text-center text-2xl font-semibold text-zinc-100 sm:text-3xl">
            Eight block types to compose anything
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-zinc-400">
            From web research to image generation, every block snaps together
            visually. No code required.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BLOCK_ICONS.map((block) => {
              const Icon = block.icon;
              return (
                <div
                  key={block.label}
                  className="flex items-center gap-3 rounded-lg border border-zinc-800/40 bg-zinc-900/40 px-4 py-3 transition-colors hover:border-zinc-700/40"
                >
                  <Icon className="h-4 w-4 shrink-0" style={{ color: block.color }} />
                  <span className="text-sm font-medium text-zinc-300">
                    {block.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
