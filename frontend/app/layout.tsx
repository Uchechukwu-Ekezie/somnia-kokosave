import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Web3Provider } from "@/components/web3-provider"
import { SomniaStreamsProvider } from "@/contexts/somnia-streams-context"
import { Suspense } from "react"

// Suppress non-critical analytics and network errors
if (typeof window !== "undefined") {
  // Suppress unhandled promise rejections for analytics
  const originalUnhandledRejection = window.onunhandledrejection
  window.onunhandledrejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason
    const message = typeof reason === 'string' ? reason : 
                   reason?.message || 
                   reason?.toString() || 
                   JSON.stringify(reason)
    
    if (
      message.includes("Analytics SDK") ||
      message.includes("AnalyticsSDKApiError") ||
      message.includes("Failed to fetch") ||
      message.includes("TypeError: Failed to fetch")
    ) {
      event.preventDefault() // Suppress the error
      return
    }
    
    if (originalUnhandledRejection) {
      originalUnhandledRejection.call(window, event)
    }
  }

  const originalError = console.error
  const originalWarn = console.warn
  
  console.error = (...args: unknown[]) => {
    // Check all arguments for suppression patterns
    const message = args.map(arg => {
      if (typeof arg === 'string') return arg
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg)
        } catch {
          return String(arg)
        }
      }
      return String(arg)
    }).join(' ')
    
    // Suppress analytics-related errors
    if (
      message.includes("Analytics SDK") ||
      message.includes("AnalyticsSDKApiError") ||
      message.includes("TypeError: Failed to fetch") ||
      (message.includes("Failed to fetch") && (message.includes("Analytics") || message.includes("metrics") || message.includes("TypeError"))) ||
      message.includes("coinbase.com/metrics") ||
      message.includes("ERR_BLOCKED_BY_CLIENT") ||
      message.includes("ERR_NAME_NOT_RESOLVED") ||
      message.includes("cca-lite.coinbase.com") ||
      message.includes("MetaMask Tx Signature: User denied") ||
      message.includes("uBOL:") ||
      message.includes("StorageUtil.js") ||
      message.includes("lit-html.mjs") ||
      message.includes("Vercel Web Analytics") ||
      message.includes("Vercel Analytics") ||
      // Suppress non-critical MetaMask RPC errors (internal errors that don't affect functionality)
      (message.includes("MetaMask") && message.includes("RPC Error") && message.includes("Internal JSON-RPC error"))
    ) {
      return // Suppress these errors silently
    }
    originalError.apply(console, args)
  }

  console.warn = (...args: unknown[]) => {
    const message = args.map(arg => {
      if (typeof arg === 'string') return arg
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg)
        } catch {
          return String(arg)
        }
      }
      return String(arg)
    }).join(' ')
    
    // Suppress analytics warnings
    if (
      message.includes("Analytics") ||
      message.includes("coinbase.com") ||
      message.includes("Vercel") ||
      (message.includes("MetaMask") && message.includes("RPC Error"))
    ) {
      return
    }
    originalWarn.apply(console, args)
  }
}

export const metadata: Metadata = {
  title: "KokoSave - Community Savings on Somnia",
  description: "Save together, grow together. Decentralized community savings powered by Somnia Data Streams for real-time on-chain activity.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <Web3Provider>
            <SomniaStreamsProvider>
              {children}
            </SomniaStreamsProvider>
          </Web3Provider>
        </Suspense>
      </body>
    </html>
  )
}
