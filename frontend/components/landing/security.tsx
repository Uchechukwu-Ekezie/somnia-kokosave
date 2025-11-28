"use client"

import { Card } from "@/components/ui/card"
import { Shield, Lock, Eye, FileCheck, Cpu, FileSearch, Landmark } from "lucide-react"
import { motion } from "framer-motion"

const securityFeatures = [
  {
    icon: Shield,
    badge: "Audited",
    title: "Smart Contract Security",
    description:
      "Funds are locked in open-source Solidity contracts derived from OpenZeppelin and verified on Sourcify.",
  },
  {
    icon: Lock,
    badge: "Non-custodial",
    title: "Non-Custodial",
    description: "You maintain full control of your funds. No treasurer wallets. Contracts enforce the rules.",
  },
  {
    icon: Eye,
    badge: "Transparent",
    title: "Full Transparency",
    description: "Track every deposit and payout on CeloScan or BaseScan. We mirror data in Supabase for dashboards.",
  },
  {
    icon: FileCheck,
    badge: "Reputation",
    title: "Reputation System",
    description: "Every completed rotation builds verifiable savings history for future credit opportunities.",
  },
  {
    icon: Cpu,
    badge: "Automation",
    title: "Safe Automation",
    description: "Anvil-tested scripts deploy with via-ir for minimized bytecode. All jobs run through Foundry scripts.",
  },
  {
    icon: FileSearch,
    badge: "Monitoring",
    title: "Activity Logs",
    description:
      "Supabase activity feed and email hooks provide off-chain monitoring so circles see who’s on time or late.",
  },
  {
    icon: Landmark,
    badge: "Treasury",
    title: "Multi-chain Treasury",
    description: "Fees flow into a dedicated treasury (0xa91D…338ef) ready for DAO governance or multi-sig controls.",
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
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
}

export function Security() {
  return (
    <section id="security" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Built with <span className="text-primary">security</span> in mind
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            On-chain enforcement + off-chain monitoring gives communities complete peace of mind.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8"
        >
          {securityFeatures.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full border-border/50 bg-background/80 p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-7 w-7" />
                </div>
                {feature.badge ? (
                  <span className="mt-4 inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {feature.badge}
                  </span>
                ) : null}
                <h3 className="mt-3 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
