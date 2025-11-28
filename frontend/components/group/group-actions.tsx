"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowUpRight, ArrowDownLeft, Check, AlertCircle } from "lucide-react"
import { useAccount } from "wagmi"
import {
  useApproveToken,
  useRotationalDeposit,
  useTargetContribute,
  useTargetWithdraw,
  useFlexibleDeposit,
  useFlexibleWithdraw,
} from "@/hooks/useBaseSafeContracts"

interface GroupActionsProps {
  groupId: string
  poolAddress: string
  poolType: "rotational" | "target" | "flexible"
  tokenAddress: string
}

export function GroupActions({
  groupId,
  poolAddress,
  poolType,
  tokenAddress,
}: GroupActionsProps) {
  const { address } = useAccount()
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isApproving, setIsApproving] = useState(false)
  const [approved, setApproved] = useState(false)
  const [error, setError] = useState("")

  // Approval hook
  const approveToken = useApproveToken(poolAddress, depositAmount)

  // Pool-specific hooks
  const rotationalDeposit = useRotationalDeposit(poolAddress)
  const targetContribute = useTargetContribute(poolAddress, depositAmount)
  const targetWithdraw = useTargetWithdraw(poolAddress)
  const flexibleDeposit = useFlexibleDeposit(poolAddress, depositAmount)
  const flexibleWithdraw = useFlexibleWithdraw(poolAddress, withdrawAmount)

  // Handle errors from deposit hooks
  useEffect(() => {
    const depositError = 
      poolType === "rotational" ? rotationalDeposit.error :
      poolType === "target" ? targetContribute.error :
      flexibleDeposit.error

    if (depositError) {
      // Custom serializer to handle BigInt
      const serializeError = (obj: any): string => {
        try {
          return JSON.stringify(obj, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
          , 2)
        } catch (e) {
          return String(obj)
        }
      }

      console.error("❌ DEPOSIT ERROR DETECTED:", {
        poolType,
        poolAddress,
        depositAmount,
        error: depositError,
        errorMessage: depositError instanceof Error ? depositError.message : String(depositError),
        errorStack: depositError instanceof Error ? depositError.stack : undefined,
        errorCause: (depositError as any)?.cause,
        errorDetails: (depositError as any)?.details,
        errorShortMessage: (depositError as any)?.shortMessage,
        fullError: serializeError(depositError)
      })

      const errorMessage = depositError instanceof Error 
        ? depositError.message 
        : String(depositError)
      
      const shortMessage = (depositError as any)?.shortMessage || ""
      const details = (depositError as any)?.details || ""
      
      // Provide user-friendly error messages
      if (errorMessage.includes("RPC") || errorMessage.includes("JSON-RPC")) {
        setError("Network error. Please check your connection and try again.")
      } else if (errorMessage.includes("insufficient funds") || errorMessage.includes("balance")) {
        setError("Insufficient balance. Please check your token balance.")
      } else if (errorMessage.includes("user rejected") || errorMessage.includes("denied")) {
        setError("Transaction cancelled by user.")
      } else if (errorMessage.includes("execution reverted") || details.includes("execution reverted")) {
        // Contract reverted - provide specific reasons
        if (errorMessage.includes("Not a member") || details.includes("Not a member")) {
          setError("You are not a member of this pool. Only members can deposit.")
        } else if (errorMessage.includes("Pool not active") || details.includes("Pool not active")) {
          setError("This pool is not active. Cannot deposit at this time.")
        } else if (errorMessage.includes("Insufficient allowance") || details.includes("Insufficient allowance")) {
          setError("Token approval failed. Please try approving again.")
        } else {
          setError(`Contract error: ${shortMessage || errorMessage}. Check console for details.`)
        }
      } else {
        setError(`Transaction failed: ${shortMessage || errorMessage}`)
      }
    }
  }, [rotationalDeposit.error, targetContribute.error, flexibleDeposit.error, poolType, poolAddress, depositAmount])

  // Handle approval + transaction flow
  const hasTriggeredDeposit = useRef(false)
  
  useEffect(() => {
    if (approveToken.isSuccess && !hasTriggeredDeposit.current) {
      hasTriggeredDeposit.current = true
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setApproved(true)
        setIsApproving(false)
        // Auto-trigger deposit after approval
        if (depositAmount && address) {
          setTimeout(() => {
            if (poolType === "rotational") {
              rotationalDeposit.deposit?.()
            } else if (poolType === "target") {
              targetContribute.contribute?.()
            } else if (poolType === "flexible") {
              flexibleDeposit.deposit?.()
            }
          }, 500) // Small delay to ensure approval state is updated
        }
      }, 0)
    }
  }, [approveToken.isSuccess, depositAmount, address, poolType])
  
  // Reset the trigger when approval status changes
  useEffect(() => {
    if (!approveToken.isSuccess) {
      hasTriggeredDeposit.current = false
    }
  }, [approveToken.isSuccess])

  const handleApproveAndDeposit = async () => {
    setError("")
    if (!address) {
      setError("Please connect your wallet first")
      return
    }
    setIsApproving(true)
    if (approveToken.approve) {
      approveToken.approve()
    }
  }

  const handleDeposit = async () => {
    setError("")
    if (!depositAmount || !address) {
      setError("Please enter an amount")
      return
    }

    // Validate amount
    const amountNum = parseFloat(depositAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount")
      return
    }

    // If not approved yet, approve first (deposit will auto-trigger after approval)
    if (!approved) {
      await handleApproveAndDeposit()
      return
    }

    // Call appropriate deposit function with error handling
    try {
      if (poolType === "rotational") {
        rotationalDeposit.deposit?.()
      } else if (poolType === "target") {
        targetContribute.contribute?.()
      } else if (poolType === "flexible") {
        flexibleDeposit.deposit?.()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(`Failed to initiate deposit: ${errorMessage}`)
    }
  }

  const handleWithdraw = async () => {
    setError("")
    if (!withdrawAmount || !address) {
      setError("Please enter an amount")
      return
    }

    if (poolType === "target") {
      targetWithdraw.withdraw?.()
    } else if (poolType === "flexible") {
      flexibleWithdraw.withdraw?.()
    }
  }

  const isDepositLoading =
    poolType === "rotational"
      ? rotationalDeposit.isLoading
      : poolType === "target"
        ? targetContribute.isLoading
        : flexibleDeposit.isLoading

  const isWithdrawLoading =
    poolType === "target"
      ? targetWithdraw.isLoading
      : flexibleWithdraw.isLoading

  const isRotational = poolType === "rotational"
  const isTarget = poolType === "target"
  const isFlexible = poolType === "flexible"

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

      {error && (
        <div className="flex gap-2 p-3 rounded-lg bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* DEPOSIT SECTION */}
        <div className="space-y-3">
          <Label htmlFor="deposit">
            {isRotational
              ? "Deposit Fixed Amount (ETH)"
              : isTarget
                ? "Contribute Amount (ETH)"
                : "Deposit Amount (ETH)"}
          </Label>
          <Input
            id="deposit"
            type="number"
            step="0.01"
            placeholder="0.5"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            disabled={isDepositLoading || isApproving}
          />
          <p className="text-xs text-muted-foreground">
            {isRotational &&
              "Deposit the fixed pool amount. Same amount for all members."}
            {isTarget && "Contribute any amount toward the target goal."}
            {isFlexible &&
              "Deposit any amount (must meet minimum). Withdraw anytime."}
          </p>
          {!approved ? (
            <Button
              className="w-full bg-amber-600 hover:bg-amber-700"
              onClick={handleApproveAndDeposit}
              disabled={isApproving || !depositAmount || !address}
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving Token...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Approve & {isRotational ? "Deposit" : isTarget ? "Contribute" : "Deposit"}
                </>
              )}
            </Button>
          ) : (
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleDeposit}
              disabled={isDepositLoading || !depositAmount || !address}
            >
              {isDepositLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRotational ? "Depositing..." : isTarget ? "Contributing..." : "Depositing..."}
                </>
              ) : (
                <>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  {isRotational ? "Deposit" : isTarget ? "Contribute" : "Deposit"}
                </>
              )}
            </Button>
          )}
        </div>

        {/* WITHDRAW SECTION */}
        {!isRotational && (
          <div className="border-t border-border pt-6 space-y-3">
            <Label htmlFor="withdraw">
              {isTarget ? "Withdraw Share (ETH)" : "Withdraw Amount (ETH)"}
            </Label>
            <Input
              id="withdraw"
              type="number"
              step="0.01"
              placeholder="0.5"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              disabled={isWithdrawLoading}
            />
            <p className="text-xs text-muted-foreground">
              {isTarget &&
                "Withdraw after target reached or deadline passed."}
              {isFlexible && "Withdraw anytime. Exit fee will be deducted."}
            </p>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleWithdraw}
              disabled={isWithdrawLoading || !withdrawAmount || !address}
            >
              {isWithdrawLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowDownLeft className="mr-2 h-4 w-4" />
                  Withdraw
                </>
              )}
            </Button>
          </div>
        )}

        {isRotational && (
          <div className="border-t border-border pt-6 bg-blue-50 dark:bg-blue-950 p-3 rounded">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Rotational Pool:</strong> No direct withdrawals.
              Payouts are automatic when your turn comes. A relayer triggers
              payouts on schedule.
            </p>
          </div>
        )}

        {/* WALLET INFO */}
        <div className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground mb-2">Your wallet</p>
          <p className="text-sm font-mono bg-muted/30 p-2 rounded break-all">
            {address || "Not connected"}
          </p>
        </div>
      </div>
    </Card>
  )
}
