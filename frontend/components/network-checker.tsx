"use client"

import { useAccount, useChainId } from "wagmi"
import { AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const SOMNIA_CHAIN_ID = 50312

export function NetworkChecker() {
  const { isConnected, chain } = useAccount()
  const chainId = useChainId()

  // Only show if connected and on wrong network
  if (!isConnected || chainId === SOMNIA_CHAIN_ID) {
    return null
  }

  const handleSwitchNetwork = async () => {
    try {
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SOMNIA_CHAIN_ID.toString(16)}` }],
      })
    } catch (error: any) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${SOMNIA_CHAIN_ID.toString(16)}`,
              chainName: 'Somnia Dream Testnet',
              nativeCurrency: {
                name: 'STT',
                symbol: 'STT',
                decimals: 18
              },
              rpcUrls: ['https://dream-rpc.somnia.network'],
              blockExplorerUrls: ['https://dream-explorer.somnia.network']
            }]
          })
        } catch (addError) {
          console.error('Failed to add network:', addError)
        }
      } else {
        console.error('Failed to switch network:', error)
      }
    }
  }

  return (
    <Card className="p-4 mb-6 bg-destructive/10 border-destructive">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-destructive mb-1">Wrong Network</h3>
          <p className="text-sm text-muted-foreground mb-3">
            You're currently on <strong>{chain?.name || 'Unknown'}</strong> (Chain ID: {chainId}).
            This app requires <strong>Somnia Dream Testnet</strong> (Chain ID: {SOMNIA_CHAIN_ID}).
          </p>
          <Button 
            onClick={handleSwitchNetwork}
            variant="destructive"
            size="sm"
          >
            Switch to Somnia Testnet
          </Button>
        </div>
      </div>
    </Card>
  )
}

