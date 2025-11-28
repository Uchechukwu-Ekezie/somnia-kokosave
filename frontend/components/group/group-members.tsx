"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react"
import { usePoolData } from "@/hooks/usePoolData"

// Check if string is a contract address
function isContractAddress(str: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/i.test(str)
}

export function GroupMembers({ groupId }: { groupId: string }) {
  // Read members from blockchain
  const isAddress = isContractAddress(groupId)
  const { poolData, loading } = usePoolData(isAddress ? groupId : null)

  const members = poolData?.members || []

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Members ({members.length})</h3>
      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No members found</p>
      ) : (
        <div className="space-y-3">
          {members.map((memberAddress, index) => (
            <div key={memberAddress} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {memberAddress.slice(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm font-mono">{formatAddress(memberAddress)}</p>
                  <p className="text-xs text-muted-foreground">Member #{index + 1}</p>
                </div>
              </div>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}