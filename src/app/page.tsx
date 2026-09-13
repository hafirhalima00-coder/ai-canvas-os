"use client";

import Link from "next/link";
import {
  ArrowRight,
  MessageSquare,
  LayoutGrid,
  Workflow,
  Eye,
  Zap,
  Shield,
  Brain,
  Users,
  Mail,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CHAT_MESSAGES = [
  { role: "user", text: "Send a follow-up email to our enterprise leads" },
  { role: "bot", text: "Sure! Here's a template for your follow-up email..." },
  { role: "user", text: "Can you personalize it for each segment?" },
  { role: "bot", text: "Of course! Here's the personalized version for each segment..." },
  { role: "user", text: "Now add tracking pixels and schedule for Tuesday" },
  { role: "bot", text: "Done! I've added tracking and scheduled all 12 emails for Tuesday 9am." },
];

const WORKFLOW_STEPS = [
  { label: "CRM", color: "from-pink-500 to-rose-500", icon: Users },
  { label: "Writer", color: "from-purple-500 to-violet-500", icon: Mail },
  { label: "Email", color: "from-blue-500 to-cyan-500", icon: Send },
];

const ARCHITECTURE_STEPS = [
  { icon: BarChart3, label: "Data", description: "CRM pulls 12 enterprise contacts", color: "text-blue-400" },
  { icon: Brain, label: "Intent", description: "AI infers: personalize for each segment", color: "text-purple-400" },
  { icon: Eye, label: "Decision", description: 'Surface: "Approve personalized emails?"', color: "text-amber-400" },
  { icon: Zap, label: "Action", description: "Send with tracking", color: "text-green-400" },
];

const HOW_IT_WORKS = [
  {
    icon: LayoutGrid,
    title: "Visual Canvas",
    description: "Drag AI blocks, connect them, watch them execute. No code. No config files. Just intent.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Brain,
    title: "Intent Inference",
    description: "AI decides what to do next, surfaces only what you need to decide. You approve, it executes.",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: Shield,
    title: "Human-in-the-Loop",
    description: "Approval blocks pause until you review. Critical decisions always require your sign-off.",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
];

function Send({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-cyan-500/8 blur-3xl" />
      </div>

      {/* Section 1: Hero */}
      <section className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-24 sm:pt-32 lg:pt-40">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs text-zinc-400 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          AI Canvas OS — One real workflow, not a thousand screens
        </div>

        <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Beyond the Chatbot
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-center text-base leading-relaxed text-zinc-400 sm:text-lg">
          What replaces the dashboard and chatbot in an AI-native world? A visual
          intent engine.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/canvas">
            <Button
              size="lg"
              className="h-11 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20"
            >
              See the Workflow
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          AI Canvas OS — One real workflow, not a thousand screens
        </p>
      </section>

      {/* Section 2: Side-by-Side Comparison */}
      <section className="relative mx-auto max-w-6xl px-4 pt-24 sm:pt-32">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: Chat (dim/gray) */}
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6 backdrop-blur-sm opacity-70">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-zinc-500" />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                What you&apos;re used to
              </span>
            </div>
            <div className="space-y-3">
              {CHAT_MESSAGES.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-zinc-800 text-zinc-300"
                        : "bg-zinc-800/50 text-zinc-400"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-zinc-800/40 bg-zinc-900/40 px-4 py-2.5">
              <p className="text-xs text-zinc-500">
                5 messages. 3 tool calls. You drive every step.
              </p>
            </div>
          </div>

          {/* RIGHT: Visual Workflow (bright) */}
          <div className="rounded-2xl border border-blue-500/20 bg-zinc-900/40 p-6 backdrop-blur-sm shadow-lg shadow-blue-500/5">
            <div className="mb-4 flex items-center gap-2">
              <Workflow className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-blue-400">
                What this replaces
              </span>
            </div>

            {/* Visual workflow blocks */}
            <div className="flex items-center justify-center gap-3 py-6">
              {WORKFLOW_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} shadow-lg`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-zinc-300">
                        {step.label}
                      </span>
                    </div>
                    {i < WORKFLOW_STEPS.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-zinc-600" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400">
                  Executing step 2/3
                </span>
              </div>
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2">
                <p className="text-xs text-blue-300">
                  Intent: Personalizing for 12 enterprise contacts
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-2.5">
              <p className="text-xs text-blue-300">
                3 blocks. Self-driving. AI infers the next step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Architecture */}
      <section className="relative mx-auto max-w-6xl px-4 pt-24 sm:pt-32">
        <h2 className="text-center text-2xl font-semibold text-zinc-100 sm:text-3xl">
          Data → Intent → Decision → Action
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-zinc-400">
          The four-stage pipeline that replaces both dashboards and chatbots.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ARCHITECTURE_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="relative">
                <Card className="border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm">
                  <CardContent className="p-5 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800/60">
                      <Icon className={`h-6 w-6 ${step.color}`} />
                    </div>
                    <div className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Step {i + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-100">
                      {step.label}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                {i < ARCHITECTURE_STEPS.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 sm:block">
                    <ArrowRight className="h-4 w-4 text-zinc-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="relative mx-auto max-w-6xl px-4 pt-24 sm:pt-32">
        <h2 className="text-center text-2xl font-semibold text-zinc-100 sm:text-3xl">
          How It Works
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-zinc-400">
          Three principles that make visual intent engines better than chat or
          dashboards.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="group border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm transition-all hover:border-zinc-700/60 hover:bg-zinc-900/60"
              >
                <CardContent className="p-6">
                  <div
                    className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient}`}
                  >
                    <Icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Section 5: The Thesis */}
      <section className="relative mx-auto max-w-6xl px-4 pt-24 sm:pt-32">
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-8 backdrop-blur-sm sm:p-12">
          <h2 className="text-center text-2xl font-semibold text-zinc-100 sm:text-3xl">
            The Thesis
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-zinc-400">
            Why visual intent engines replace chat and dashboards
          </p>
          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-zinc-400">
            <p>
              Chat is a fallback. When the system doesn&apos;t know what you need,
              it asks you to type it out — over and over. Every message is an
              admission that the interface couldn&apos;t infer your intent. The
              chatbot puts you in the driver&apos;s seat, but only because it
              can&apos;t drive itself.
            </p>
            <p>
              Dashboards are passive. They surface data and wait for you to
              notice something. They show you 47 metrics and trust you to find
              the 2 that matter. They&apos;re the filing cabinet of the software
              world — organized, perhaps, but requiring you to do the work.
            </p>
            <p>
              The future is intent-driven. The system observes your data, infers
              what you&apos;re trying to accomplish, and acts — then surfaces
              only the decisions that require human judgment. You don&apos;t tell
              it what to do. You tell it what you want. It figures out the rest.
            </p>
            <p>
              Visual workflows replace both paradigms. Unlike dashboards, they
              move. Unlike chatbots, they don&apos;t need you to drive every
              step. A visual canvas shows you what&apos;s happening, what&apos;s
              next, and where your input is needed — nothing more.
            </p>
            <p>
              Human review happens at critical points, not every step. Approval
              blocks pause execution until you sign off. The AI handles the
              routine; you handle the judgment. This is the collaboration model
              that actually works.
            </p>
            <p className="text-zinc-300 font-medium">
              Two-year prediction: AI interfaces will be visual intent engines,
              not chat windows. The chatbot era was a transitional phase —
              necessary while models learned to reason, but obsolete once systems
              learned to act.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: CTA */}
      <section className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-center text-3xl font-semibold text-zinc-100 sm:text-4xl">
            Ready to see it in action?
          </h2>
          <p className="max-w-lg text-center text-sm text-zinc-400">
            Build your first workflow. Three blocks. One intent. Zero chat
            messages.
          </p>
          <Link href="/canvas">
            <Button
              size="lg"
              className="h-12 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20 px-8"
            >
              Build your first workflow
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
