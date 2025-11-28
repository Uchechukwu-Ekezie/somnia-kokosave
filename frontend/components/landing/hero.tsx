"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useAppKit } from "@reown/appkit/react"
import { useAccount } from "wagmi"
import Link from "next/link"

export function Hero() {
  const { open } = useAppKit()
  const { isConnected } = useAccount()

  return (
    <section className="relative overflow-hidden pt-28 pb-24 sm:pt-36 sm:pb-32">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#0c1f1c_0%,_transparent_55%)]">
        <div className="absolute -top-32 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[22rem] w-[22rem] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-sm font-medium text-primary/90 shadow-sm shadow-primary/10 backdrop-blur animate-in fade-in slide-in-from-top-3 duration-700">
            <Sparkles className="h-4 w-4" />
            Now live on Somnia testnets
          </div>

          {/* Main heading */}
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Build powerful <span className="text-primary">Ajo circles</span> with
            automated trust
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl lg:text-2xl">
            Kokosave helps communities launch transparent savings groups in minutes.
            Automate contributions, rotations, and payouts with smart contracts secured on Celo and Base.
          </p>

          {/* Feature chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            {[
              "Rotational, Target & Flexible pools",
              "WalletConnect + MetaMask support",
              "Treasury & activity dashboards",
              "Supabase-powered records",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/70 px-4 py-2 shadow-sm backdrop-blur"
              >
                <span className="h-2 w-2 rounded-full bg-primary/70" />
                {item}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {isConnected ? (
              <Button size="lg" className="group h-14 rounded-full px-8 text-base shadow-lg shadow-primary/20" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                className="group h-14 rounded-full px-8 text-base shadow-lg shadow-primary/20"
                onClick={() => open()}
              >
                Launch App
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-primary/30 bg-background/60 px-8 text-base backdrop-blur hover:border-primary hover:bg-primary/10"
              asChild
            >
              <Link href="#how-it-works">Explore how it works</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-14 grid gap-6 rounded-3xl border border-white/10 bg-background/60 p-6 text-left shadow-xl backdrop-blur lg:grid-cols-3">
            {[
              {
                title: "2 smart contracts live",
                description: "BaseToken (BST) and BaseSafeFactory deployed & verified on Celo Sepolia.",
              },
              {
                title: "8082406 gas optimized",
                description: "Deployment tuned with via-ir for cost efficiency across pool types.",
              },
              {
                title: "Treasury secured",
                description: "Funds routed through multi-chain treasury 0xa91D...338ef for accountability.",
              },
            ].map((stat) => (
              <div key={stat.title} className="space-y-2">
                <p className="text-lg font-semibold text-foreground">{stat.title}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
