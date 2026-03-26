// @ts-nocheck
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { Loader2, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react'
import { adminApi } from '@/api/admin.api'
import { motion } from 'framer-motion'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'text-brand-gold', icon: Clock },
  verified: { label: 'Verified', color: 'text-brand-green', icon: CheckCircle2 },
  paid: { label: 'Paid', color: 'text-brand-green', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'text-red-400', icon: XCircle },
}

export default function AdminWinnersPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['adminWinners'], queryFn: adminApi.getAllWinners })
  const winners = data?.winners || []

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.verifyWinner(id, { status }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminWinners'] }); toast.success('Winner status updated!') },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Update failed'),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Winners Management</h1>
        <p className="text-gray-400 mt-1">Verify proof and manage prize payouts.</p>
      </div>

      {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand-green animate-spin" /></div> : (
        <div className="space-y-4">
          {winners.map((w: any, i: number) => {
            const sc = STATUS_CONFIG[w.status] || STATUS_CONFIG.pending
            const Icon = sc.icon
            return (
              <motion.div key={w._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-brand-card border border-white/5 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-black text-white">{w.userId?.firstName} {w.userId?.lastName}</p>
                      <span className={`flex items-center gap-1 text-xs font-bold ${sc.color}`}>
                        <Icon className="w-3.5 h-3.5" />{sc.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{w.matchType || w.prizeType} Match — £{w.prizeAmount?.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{new Date(w.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    {w.proofUrl && (
                      <a href={w.proofUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-brand-accent hover:underline mt-2">
                        <ExternalLink className="w-3 h-3" /> View Proof
                      </a>
                    )}
                  </div>
                  {w.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => verifyMutation.mutate({ id: w._id, status: 'verified' })}
                        disabled={verifyMutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-2 bg-brand-green text-black rounded-xl text-sm font-bold hover:bg-brand-green/90 transition-all disabled:opacity-60">
                        <CheckCircle2 className="w-4 h-4" /> Verify
                      </button>
                      <button onClick={() => verifyMutation.mutate({ id: w._id, status: 'rejected' })}
                        disabled={verifyMutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all disabled:opacity-60">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                  {w.status === 'verified' && (
                    <button onClick={() => verifyMutation.mutate({ id: w._id, status: 'paid' })}
                      disabled={verifyMutation.isPending}
                      className="px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-xl text-sm font-bold hover:bg-brand-gold/20 transition-all disabled:opacity-60 shrink-0">
                      Mark as Paid
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
          {winners.length === 0 && (
            <div className="py-16 text-center text-gray-400">No winners to display yet.</div>
          )}
        </div>
      )}
    </div>
  )
}
