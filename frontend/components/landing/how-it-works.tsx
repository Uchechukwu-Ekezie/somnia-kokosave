"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Connect your wallet",
    time: "~1 minute",
    description:
      "Choose WalletConnect or MetaMask. We surface the right RPC endpoints for Celo or Base so you can switch in one click.",
  },
  {
    number: "02",
    title: "Launch an Ajo",
    time: "~3 minutes",
    description:
      "Pick rotational, target, or flexible mode. Configure deposits, frequency, yields, and treasury routing before deploying the pool contract.",
  },
  {
    number: "03",
    title: "Invite your members",
    time: "Ongoing",
    description:
      "Share the pool address for friends to join. As members approve the token, we track on-chain receipts in Supabase for dashboards.",
  },
  {
    number: "04",
    title: "Automate the cycle",
    time: "Every round",
    description:
      "Deposits, turn order, payouts, and reminders fire automatically. Late members get flagged, and payouts hit wallets when it’s their turn.",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/20 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Four steps to launch your <span className="text-primary">community savings</span> circle
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Non-technical organizers can spin up an on-chain Ajo with guided forms and pre-built templates.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative grid gap-6 lg:grid-cols-4 lg:gap-8"
        >
          {steps.map((step, index) => (
            <motion.div key={step.number} variants={item}>
              <Card className="relative h-full overflow-hidden border-border/40 bg-background/80 p-7 shadow-sm backdrop-blur">
                <span className="absolute -top-8 right-4 text-8xl font-black text-primary/5">{step.number}</span>
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {step.number}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{step.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}

          <div className="pointer-events-none absolute inset-x-10 top-1/2 hidden h-px rounded-full bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block" />
        </motion.div>
      </div>
    </section>
  )
}
