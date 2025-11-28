"use client"

import { useReadContract, usePublicClient } from "wagmi"
import { formatEther } from "viem"
import { useState, useEffect } from "react"

// Common ABI for all pool types
const POOL_ABI = [
  {
    name: "members",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "totalMembers",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "membersList",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }],
  },
  {
    name: "token",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
] as const

// Rotational pool specific
const ROTATIONAL_ABI = [
  ...POOL_ABI,
  {
    name: "depositAmount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "roundDuration",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "currentRound",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "roundStartTime",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const

// Target pool specific
const TARGET_ABI = [
  ...POOL_ABI,
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
    name: "totalContributed",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const

// Flexible pool specific
const FLEXIBLE_ABI = [
  ...POOL_ABI,
  {
    name: "minimumDeposit",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "withdrawalFeeBps",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "yieldEnabled",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
] as const

export interface PoolData {
  address: string
  type: 'rotational' | 'target' | 'flexible'
  members: string[]
  totalMembers: number
  tokenAddress: string
  // Rotational specific
  depositAmount?: string
  roundDuration?: number
  currentRound?: number
  roundStartTime?: number
  // Target specific
  targetAmount?: string
  deadline?: number
  totalContributed?: string
  // Flexible specific
  minimumDeposit?: string
  withdrawalFeeBps?: number
  yieldEnabled?: boolean
}

/**
 * Hook to read pool data from blockchain
 * Tries all pool types to determine which one it is
 */
export function usePoolData(poolAddress: string | null) {
  const [poolData, setPoolData] = useState<PoolData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Try to read common fields from all pool types with error handling
  const { data: membersList } = useReadContract({
    address: poolAddress as `0x${string}` | undefined,
    abi: POOL_ABI,
    functionName: "membersList",
    query: { 
      enabled: !!poolAddress,
      retry: false,
      throwOnError: false,
    },
  })

  const { data: totalMembers } = useReadContract({
    address: poolAddress as `0x${string}` | undefined,
    abi: POOL_ABI,
    functionName: "totalMembers",
    query: { 
      enabled: !!poolAddress,
      retry: false,
      throwOnError: false,
    },
  })

  const { data: tokenAddress } = useReadContract({
    address: poolAddress as `0x${string}` | undefined,
    abi: POOL_ABI,
    functionName: "token",
    query: { 
      enabled: !!poolAddress,
      retry: false,
      throwOnError: false,
    },
  })

  // Try to determine pool type by reading type-specific fields
  // These will fail silently if the function doesn't exist
  const { data: depositAmount } = useReadContract({
    address: poolAddress as `0x${string}` | undefined,
    abi: ROTATIONAL_ABI,
    functionName: "depositAmount",
    query: { 
      enabled: !!poolAddress,
      retry: false,
      throwOnError: false,
    },
  })

  const { data: targetAmount } = useReadContract({
    address: poolAddress as `0x${string}` | undefined,
    abi: TARGET_ABI,
    functionName: "targetAmount",
    query: { 
      enabled: !!poolAddress,
      retry: false,
      throwOnError: false,
    },
  })

  const { data: minimumDeposit } = useReadContract({
    address: poolAddress as `0x${string}` | undefined,
    abi: FLEXIBLE_ABI,
    functionName: "minimumDeposit",
    query: { 
      enabled: !!poolAddress,
      retry: false,
      throwOnError: false,
    },
  })

  useEffect(() => {
    if (!poolAddress) {
      setLoading(false)
      return
    }

    // Determine pool type based on which field exists
    let poolType: 'rotational' | 'target' | 'flexible' = 'flexible'
    if (depositAmount !== undefined && depositAmount !== null) {
      poolType = 'rotational'
    } else if (targetAmount !== undefined && targetAmount !== null) {
      poolType = 'target'
    } else if (minimumDeposit !== undefined && minimumDeposit !== null) {
      poolType = 'flexible'
    }

    // Build pool data
    const data: PoolData = {
      address: poolAddress,
      type: poolType,
      members: (membersList as string[]) || [],
      totalMembers: totalMembers ? Number(totalMembers) : 0,
      tokenAddress: (tokenAddress as string) || '',
    }

    if (poolType === 'rotational' && depositAmount) {
      data.depositAmount = formatEther(depositAmount as bigint)
    } else if (poolType === 'target' && targetAmount) {
      data.targetAmount = formatEther(targetAmount as bigint)
    } else if (poolType === 'flexible' && minimumDeposit) {
      data.minimumDeposit = formatEther(minimumDeposit as bigint)
    }

    setPoolData(data)
    setLoading(false)
  }, [poolAddress, membersList, totalMembers, tokenAddress, depositAmount, targetAmount, minimumDeposit])

  return { poolData, loading, error }
}

