"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Clock, Loader2 } from "lucide-react"
import { useAccount } from "wagmi"
import { useSomniaStreams } from "@/contexts/somnia-streams-context"
import { SchemaEncoder } from "@somnia-chain/streams"
import { POOL_ACTIVITY_SCHEMA } from "@/lib/somnia/schemas"
import { useState, useEffect } from "react"

interface Activity {
  id: string
  activity_type: string
  user_address: string | null
  amount: number | null
  description: string | null
  created_at: string
  pool_id: string
}

export function Transactions() {
  const { address } = useAccount()
  const { subscribeToAllActivities, isInitialized } = useSomniaStreams()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isInitialized || !subscribeToAllActivities) {
      setLoading(false)
      return
    }

    let unsubscribeFn: (() => void) | undefined

    const setupSubscription = async () => {
      try {
        unsubscribeFn = await subscribeToAllActivities((data) => {
          try {
            const fields = data.data || data
            const activity: Activity = {
              id: `${fields.find((f: any) => f.name === "txHash")?.value || ""}-${fields.find((f: any) => f.name === "nonce")?.value || 0}`,
              activity_type: fields.find((f: any) => f.name === "activityType")?.value?.toString() || "",
              user_address: fields.find((f: any) => f.name === "userAddress")?.value?.toString() || null,
              amount: fields.find((f: any) => f.name === "amount")?.value ? parseFloat(fields.find((f: any) => f.name === "amount")?.value) / 1e18 : null,
              description: fields.find((f: any) => f.name === "description")?.value?.toString() || null,
              created_at: new Date(Number(fields.find((f: any) => f.name === "timestamp")?.value || 0) * 1000).toISOString(),
              pool_id: fields.find((f: any) => f.name === "poolId")?.value?.toString() || "",
            }

            setActivities((prev) => {
              const exists = prev.some((a) => a.id === activity.id)
              if (exists) return prev
              return [activity, ...prev].slice(0, 20) // Keep last 20
            })
            setLoading(false)
          } catch (err) {
            console.error("Error processing activity:", err)
          }
        })

        setLoading(false)
      } catch (err) {
        console.error("Error setting up subscription:", err)
        setLoading(false)
      }
    }

    setupSubscription()

    // Cleanup: unsubscribe when component unmounts
    return () => {
      if (unsubscribeFn) {
        unsubscribeFn()
      }
    }
  }, [isInitialized, subscribeToAllActivities])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Transaction History</h2>
        <p className="text-muted-foreground mt-1">View all deposits and payouts</p>
      </div>

      <Card className="divide-y divide-border">
        {activities.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No transactions yet
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    activity.activity_type === 'deposit' ? 'bg-primary/10' : 'bg-accent/10'
                  }`}>
                    {activity.activity_type === 'deposit' ? (
                      <ArrowUpRight className="h-6 w-6 text-primary" />
                    ) : (
                      <ArrowDownLeft className="h-6 w-6 text-accent" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold capitalize">{activity.activity_type}</h3>
                      <Badge variant="default" className="bg-primary/10 text-primary">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <p className="text-xl font-bold">{activity.amount.toFixed(2)} ETH</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  )
}
