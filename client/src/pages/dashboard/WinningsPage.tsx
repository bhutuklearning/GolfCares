// @ts-nocheck
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Trophy, Loader2, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { winnerApi } from '@/api/winner.api'
import { Button } from '@/components/ui/button'
import ProofUploadModal from './ProofUploadModal'
import { useState } from 'react'
const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending Verification', color: 'text-brand-gold', icon: Clock },
  verified: { label: 'Verified — Awaiting Payout', color: 'text-brand-green', icon: CheckCircle2 },
  paid: { label: 'Prize Paid', color: 'text-brand-green', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'text-red-400', icon: AlertCircle },
}

export default function WinningsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['myWinnings'], queryFn: winnerApi.getMyWinnings })
  const winnings = data?.winnings || []

  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null)
  const isModalOpen = selectedWinnerId !== null

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">My Winnings</h1>
        <p className="text-gray-400 mt-1">Track your prizes and payout status.</p>
      </div>

      {winnings.length === 0 ? (
        <div className="bg-brand-card border border-white/5 rounded-2xl p-12 text-center">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No winnings yet</h3>
          <p className="text-gray-400">Keep entering your scores each month for a chance to win!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {winnings.map((w: any, i: number) => {
            const status = STATUS_MAP[w.status] || STATUS_MAP.pending
            const StatusIcon = status.icon
            return (
              <motion.div key={w._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-brand-card border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-brand-gold font-black text-lg">{w.matchType || w.prizeType} Match</span>
                    <span className="text-xs text-gray-500">
                      {new Date(w.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                    <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-brand-green">₹{(w.prizeAmount || 0).toFixed(2)}</p>
                  {status.label === 'Pending Verification' && !w.proofImageUrl && (
                    <div className="mt-2 text-right">
                      <Button onClick={() => setSelectedWinnerId(w._id)} variant="outline" size="sm" className="border-brand-green text-brand-green hover:bg-brand-green/10 text-xs py-1 h-8">
                        Upload Proof
                      </Button>
                    </div>
                  )}
                  {status.label === 'Pending Verification' && w.proofImageUrl && (
                    <p className="text-xs text-brand-gold mt-1">Proof under review</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
      
      <ProofUploadModal 
        winnerId={selectedWinnerId} 
        isOpen={isModalOpen} 
        onClose={() => setSelectedWinnerId(null)} 
      />
    </div>
  )
}
