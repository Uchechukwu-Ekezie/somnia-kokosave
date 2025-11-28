"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Users, Clock, Loader2 } from "lucide-react"
import { useSomniaStreams } from "@/contexts/somnia-streams-context"
import { useState, useEffect } from "react"
import { toHex } from "viem"

interface Activity {
  id: string
  activity_type: string
  user_address: string | null
  amount: number | null
  description: string | null
  created_at: string
  pool_id: string
}

interface GroupActivityProps {
  groupId: string
}

export function GroupActivity({ groupId }: GroupActivityProps) {
  const { subscribeToPoolActivities, isInitialized } = useSomniaStreams()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isInitialized || !subscribeToPoolActivities || !groupId) {
      setLoading(false)
      return
    }

    let unsubscribeFn: (() => void) | undefined

    const setupSubscription = async () => {
      try {
        // groupId is already a hex address (0x...), use it directly
        // No need to convert to bytes32 as it's already the correct format
        unsubscribeFn = await subscribeToPoolActivities(groupId, (data) => {
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
              return [activity, ...prev].sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )
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
  }, [isInitialized, subscribeToPoolActivities, groupId])

  const getActivityIcon = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'deposit':
        return <ArrowUpRight className="h-6 w-6 text-primary" />
      case 'payout':
      case 'withdrawal':
        return <ArrowDownLeft className="h-6 w-6 text-accent" />
      case 'member_joined':
      case 'pool_created':
        return <Users className="h-6 w-6 text-blue-500" />
      default:
        return <Clock className="h-6 w-6 text-muted-foreground" />
    }
  }

  const getActivityColor = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'deposit':
        return 'bg-primary/10'
      case 'payout':
      case 'withdrawal':
        return 'bg-accent/10'
      case 'member_joined':
      case 'pool_created':
        return 'bg-blue-500/10'
      default:
        return 'bg-muted'
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Activity</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Activity</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            No activity yet. Activities will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getActivityColor(activity.activity_type)}`}>
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold capitalize">
                      {activity.activity_type.replace(/_/g, ' ')}
                    </h4>
                    <Badge variant="default" className="bg-primary/10 text-primary">
                      Completed
                    </Badge>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  )}
                  {activity.user_address && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.user_address.slice(0, 6)}...{activity.user_address.slice(-4)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {activity.amount !== null && (
                  <p className="text-lg font-bold">{activity.amount.toFixed(4)} ETH</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
