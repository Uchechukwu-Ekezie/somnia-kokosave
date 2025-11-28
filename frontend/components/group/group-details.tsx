"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, TrendingUp, Users, Clock, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { usePoolData } from "@/hooks/usePoolData"
import { useReadContract } from "wagmi"
import { formatEther } from "viem"
import { NetworkChecker } from "@/components/network-checker"

// Check if string is a contract address
function isContractAddress(str: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/i.test(str)
}

const POOL_ABI = [
  {
    name: "totalBalance",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalContributed",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "targetAmount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "deadline",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "active",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
] as const

export function GroupDetails({ groupId }: { groupId: string }) {
  // If groupId is a contract address, read from blockchain
  const isAddress = isContractAddress(groupId)
  const { poolData, loading: poolLoading } = usePoolData(isAddress ? groupId : null)

  // Read additional pool data with error handling
  const { data: totalBalance } = useReadContract({
    address: isAddress ? (groupId as `0x${string}`) : undefined,
    abi: POOL_ABI,
    functionName: "totalBalance",
    query: { 
      enabled: isAddress && !!poolData,
      retry: false,
      // Ignore errors - not all pools have this function
      throwOnError: false,
    },
  })

  const { data: totalContributed } = useReadContract({
    address: isAddress ? (groupId as `0x${string}`) : undefined,
    abi: POOL_ABI,
    functionName: "totalContributed",
    query: { 
      enabled: isAddress && !!poolData,
      retry: false,
      throwOnError: false,
    },
  })

  const { data: targetAmount } = useReadContract({
    address: isAddress ? (groupId as `0x${string}`) : undefined,
    abi: POOL_ABI,
    functionName: "targetAmount",
    query: { 
      enabled: isAddress && !!poolData && poolData.type === 'target',
      retry: false,
      throwOnError: false,
    },
  })

  const { data: deadline } = useReadContract({
    address: isAddress ? (groupId as `0x${string}`) : undefined,
    abi: POOL_ABI,
    functionName: "deadline",
    query: { 
      enabled: isAddress && !!poolData && poolData.type === 'target',
      retry: false,
      throwOnError: false,
    },
  })

  const { data: active } = useReadContract({
    address: isAddress ? (groupId as `0x${string}`) : undefined,
    abi: POOL_ABI,
    functionName: "active",
    query: { 
      enabled: isAddress && !!poolData,
      retry: false,
      throwOnError: false,
    },
  })

  const loading = poolLoading
  const error = !isAddress ? "Invalid pool address" : null

  // Calculate values
  const totalSaved = totalBalance ? Number(formatEther(totalBalance as bigint)) : 
                     totalContributed ? Number(formatEther(totalContributed as bigint)) : 0
  const target = targetAmount ? Number(formatEther(targetAmount as bigint)) : null
  const progress = target ? (totalSaved / target) * 100 : 0
  const status = active ? 'active' : 'completed'

  if (loading) {
    return (
      <Card className="p-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    )
  }

  if (error || !poolData) {
    return (
      <Card className="p-6 bg-destructive/10 text-destructive">
        <p>{error || "Pool not found. Make sure you're on the correct network."}</p>
      </Card>
    )
  }

  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getStats = () => {
    const baseStats = [
      { icon: TrendingUp, label: "Total Saved", value: `${totalSaved.toFixed(4)} ETH` },
      { icon: Users, label: "Members", value: poolData.totalMembers || 0 },
    ]

    if (poolData.type === 'rotational' && poolData.depositAmount) {
      baseStats.push({ icon: Clock, label: "Deposit Amount", value: `${poolData.depositAmount} ETH` })
      baseStats.push({ icon: Calendar, label: "Round Duration", value: poolData.roundDuration ? `${poolData.roundDuration}s` : "N/A" })
    } else if (poolData.type === 'target' && target) {
      baseStats.push({ icon: Calendar, label: "Target", value: `${target.toFixed(4)} ETH` })
      baseStats.push({ icon: Clock, label: "Deadline", value: deadline ? new Date(Number(deadline) * 1000).toLocaleDateString() : "N/A" })
    } else if (poolData.type === 'flexible' && poolData.minimumDeposit) {
      baseStats.push({ icon: Clock, label: "Min Deposit", value: `${poolData.minimumDeposit} ETH` })
      baseStats.push({ icon: Calendar, label: "Status", value: status })
    }

    return baseStats
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <NetworkChecker />
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pool {formatAddress(poolData.address)}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{formatType(poolData.type)}</Badge>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2 font-mono">{poolData.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {getStats().map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <stat.icon className="h-4 w-4" />
                <span className="text-sm">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {target && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to Target</span>
              <span className="font-medium">
                {totalSaved.toFixed(4)} / {target.toFixed(4)} ETH
              </span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {Math.min(progress, 100).toFixed(1)}% complete
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  )
}