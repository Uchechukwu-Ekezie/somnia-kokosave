"use client"

import { Card } from "@/components/ui/card"
import {
  Users,
  Target,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  Network,
  FileCode2,
} from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Users,
    badge: "Rotational",
    title: "Rotational Savings",
    description:
      "Keep the familiar Ajo/Esusu structure while smart contracts handle turn order, reminders, and payouts.",
  },
  {
    icon: Target,
    badge: "Goal-Based",
    title: "Target Pool",
    description:
      "Invite your circle to fund milestones together. Release funds only when the shared target or deadline is met.",
  },
  {
    icon: Zap,
    badge: "Flexible",
    title: "Flexible Pool",
    description:
      "Allow members to deposit and withdraw at will while still capturing optional DeFi yield for idle funds.",
  },
  {
    icon: Shield,
    badge: "Protection",
    title: "Smart Contract Escrow",
    description:
      "Every pool is governed by audited Solidity contracts—no treasurers, no middlemen, no opportunity for fraud.",
  },
  {
    icon: TrendingUp,
    badge: "Growth",
    title: "Yield Integration",
    description:
      "Automatically route idle balances into proven Base L2 strategies so communities earn while they save.",
  },
  {
    icon: Clock,
    badge: "Automation",
    title: "Auto Enforcement",
    description:
      "Late deposits trigger alerts, grace periods, and optional removal so groups stay consistent without arguments.",
  },
  {
    icon: Network,
    badge: "Multi-Chain",
    title: "Celo & Base Ready",
    description:
      "Deploy once and reach users on mobile-friendly Celo or low-cost Base. Switching networks is seamless.",
  },
  {
    icon: FileCode2,
    badge: "Open Source",
    title: "Transparent Codebase",
    description:
      "Every contract and interface lives in an open-source repo with documentation, tests, and Sourcify verification.",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Everything you need for <span className="text-primary">community savings</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Built for African communities, powered by blockchain technology
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full overflow-hidden border-border/50 bg-background/80 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                {feature.badge ? (
                  <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
                    {feature.badge}
                  </span>
                ) : null}
                <h3 className="mt-3 text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
