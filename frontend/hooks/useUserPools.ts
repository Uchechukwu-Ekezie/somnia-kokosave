"use client"

import { useState, useEffect } from "react"
import { usePublicClient } from "wagmi"
import { parseAbiItem } from "viem"

const FACTORY_ADDRESS = (process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '0xa71C861930C0973AE57c577aC19EB7f11e7d74a6') as `0x${string}`

// Optional: Set the block where the factory was deployed to avoid querying unnecessary blocks
// If not set, will query the last 10,000 blocks
const FACTORY_DEPLOYMENT_BLOCK = process.env.NEXT_PUBLIC_FACTORY_DEPLOYMENT_BLOCK 
  ? BigInt(process.env.NEXT_PUBLIC_FACTORY_DEPLOYMENT_BLOCK) 
  : null

// Pool creation events from the factory contract
// Event PoolCreated(address indexed pool, address indexed creator, string poolType)
const POOL_CREATED_EVENT = parseAbiItem('event PoolCreated(address indexed pool, address indexed creator, string poolType)')

export interface OnChainPool {
  address: string
  creator: string
  type: 'rotational' | 'target' | 'flexible'
  blockNumber: bigint
  transactionHash: string
}

export function useUserPools(userAddress: string | undefined) {
  const publicClient = usePublicClient()
  const [pools, setPools] = useState<OnChainPool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userAddress || !publicClient) {
      setLoading(false)
      return
    }

    const fetchPools = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get current block number
        const currentBlock = await publicClient.getBlockNumber()
        
        // RPC has a limit of 1000 blocks per request
        const BLOCK_RANGE = BigInt(1000)
        
        // Determine starting block
        let startBlock: bigint
        if (FACTORY_DEPLOYMENT_BLOCK) {
          // If deployment block is set, start from there
          startBlock = FACTORY_DEPLOYMENT_BLOCK
        } else {
          // Otherwise, query last 10k blocks
          const TOTAL_BLOCKS_TO_QUERY = BigInt(10000)
          const fromBlock = currentBlock - TOTAL_BLOCKS_TO_QUERY
          startBlock = fromBlock > 0 ? fromBlock : BigInt(0)
        }
        
        const allLogs: any[] = []
        
        // Query in chunks of 1000 blocks
        for (let i = startBlock; i <= currentBlock; i += BLOCK_RANGE) {
          const chunkFromBlock = i
          const chunkToBlock = i + BLOCK_RANGE - BigInt(1) > currentBlock 
            ? currentBlock 
            : i + BLOCK_RANGE - BigInt(1)
          
          try {
            const logs = await publicClient.getLogs({
              address: FACTORY_ADDRESS,
              event: POOL_CREATED_EVENT,
              args: {
                creator: userAddress as `0x${string}`,
              },
              fromBlock: chunkFromBlock,
              toBlock: chunkToBlock,
            })
            
            allLogs.push(...logs)
          } catch (chunkErr) {
            console.warn(`Failed to fetch logs for blocks ${chunkFromBlock}-${chunkToBlock}:`, chunkErr)
            // Continue with other chunks even if one fails
          }
        }

        // Parse the logs into pool objects
        const userPools: OnChainPool[] = allLogs.map((log) => {
          const poolType = log.args.poolType?.toLowerCase() || 'flexible'
          
          return {
            address: log.args.pool as string,
            creator: log.args.creator as string,
            type: (poolType === 'rotational' || poolType === 'target' || poolType === 'flexible' 
              ? poolType 
              : 'flexible') as 'rotational' | 'target' | 'flexible',
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
          }
        })

        // Sort by block number (most recent first)
        userPools.sort((a, b) => Number(b.blockNumber - a.blockNumber))

        setPools(userPools)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching user pools:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch pools')
        setLoading(false)
      }
    }

    fetchPools()
  }, [userAddress, publicClient])

  return { pools, loading, error }
}

