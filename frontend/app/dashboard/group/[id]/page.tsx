"use client"

import { use } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { GroupDetails } from "@/components/group/group-details"
import { GroupMembers } from "@/components/group/group-members"
import { GroupActivity } from "@/components/group/group-activity"
import { GroupActions } from "@/components/group/group-actions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '0x2A4690ec1Ef5d97A1366eB69e30C5a2a13E91773') as `0x${string}`

// Check if string is a contract address (0x followed by 40 hex chars)
function isContractAddress(str: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/i.test(str)
}

export default function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  // ID is now the contract address (on-chain pools)
  const poolAddress = isContractAddress(id) ? id : null
  const tokenAddress = TOKEN_ADDRESS

  // For now, we'll need to determine pool type from contract
  // Default to 'flexible' - components will read from blockchain
  const poolType: 'rotational' | 'target' | 'flexible' = 'flexible'

  if (!poolAddress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Pool Address</h1>
          <p className="text-muted-foreground">The pool address is invalid.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GroupDetails groupId={poolAddress} />
            <GroupActivity groupId={poolAddress} />
          </div>
          <div className="space-y-6">
            <GroupActions 
              groupId={poolAddress}
              poolAddress={poolAddress}
              poolType={poolType}
              tokenAddress={tokenAddress}
            />
            <GroupMembers groupId={poolAddress} />
          </div>
        </div>
      </main>
    </div>
  )
}