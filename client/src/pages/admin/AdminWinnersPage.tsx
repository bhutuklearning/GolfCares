// @ts-nocheck
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, ExternalLink, Check, X, CreditCard } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { adminApi } from '@/api/admin.api'
import { useAuthStore } from '@/store/authStore'
import { mockWinnings } from '@/mocks/mockData'
import { getMonthName, formatCurrency, getStatusColor } from '@/utils/helpers'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export default function AdminWinnersPage() {
  const [search, setSearch] = useState('')
  const [reviewingWinner, setReviewingWinner] = useState<any>(null)
  
  const queryClient = useQueryClient()
  const { useMockData } = useAuthStore()

  const { data, isLoading } = useQuery<any>({ queryKey: ['adminWinners'], queryFn: () => adminApi.getAllWinners(),  enabled: !useMockData  })
  
  // Transform mock or real data
  const winners = useMockData ? mockWinnings : data?.winners || []

  // Filter 
  const filtered = winners.filter((w: any) => 
    w.userId?.firstName?.toLowerCase().includes(search.toLowerCase()) || 
    w.userId?.lastName?.toLowerCase().includes(search.toLowerCase())
  )

  const handleProcessAction = async (action: 'approve_proof' | 'reject_proof' | 'mark_paid') => {
    if (!reviewingWinner) return

    try {
      if (useMockData) {
        toast.success(`Mock: Winner marked as ${action.replace('_', ' ')}`)
        setReviewingWinner(null)
        return
      }

      await adminApi.verifyWinner(reviewingWinner._id, { status: action })
      toast.success(`Action ${action} successful`)
      queryClient.invalidateQueries({ queryKey: ['adminWinners'] })
      setReviewingWinner(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process winner')
    }
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Winner Processing</h1>
          <p className="text-gray-400 mt-1">Review proofs and manage prize payouts.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input 
            placeholder="Search winners..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green w-full" 
          />
        </div>
      </div>

      <div className="bg-brand-card border border-white/5 rounded-2xl shadow-lg overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
                <th className="p-5">User</th>
                <th className="p-5">Draw Period</th>
                <th className="p-5">Match</th>
                <th className="p-5">Prize Amount</th>
                <th className="p-5">Proof</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                 <tr><td colSpan={7} className="p-5"><div className="h-20 bg-white/5 rounded-lg animate-pulse w-full"></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="p-10 text-center text-gray-500">No winners found.</td></tr>
              ) : (
                filtered.map((winner: any) => (
                  <tr key={winner._id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5">
                      <p className="font-bold text-white">{winner.userId?.firstName} {winner.userId?.lastName}</p>
                      <p className="text-xs text-gray-400">{winner.userId?.email}</p>
                    </td>
                    <td className="p-5 text-sm text-gray-300">
                      {winner.drawId ? `${getMonthName(winner.drawId.month)} ${winner.drawId.year}` : 'Unknown'}
                    </td>
                    <td className="p-5">
                      <span className="text-xs font-bold uppercase tracking-wider bg-brand-accent/10 text-brand-accent px-2.5 py-1 rounded border border-brand-accent/20">
                        {winner.matchType}
                      </span>
                    </td>
                    <td className="p-5 font-black text-brand-gold text-lg">
                      {formatCurrency(winner.prizeAmount)}
                    </td>
                    <td className="p-5">
                      {winner.proofImageUrl ? (
                        <a href={winner.proofImageUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 hover:underline">
                          <ExternalLink className="w-3 h-3" /> View Proof
                        </a>
                      ) : (
                        <span className="text-xs text-gray-500 italic">Not Uploaded</span>
                      )}
                    </td>
                    <td className="p-5">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${getStatusColor(winner.paymentStatus)}`}>
                        {winner.paymentStatus}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      {winner.paymentStatus !== 'paid' && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setReviewingWinner(winner)}
                          className={`text-xs font-bold border ${winner.proofImageUrl ? 'border-brand-green text-brand-green hover:bg-brand-green hover:text-black' : 'border-white/10 text-gray-400 hover:text-white'}`}
                        >
                          Review
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Dialog */}
      <Dialog open={reviewingWinner !== null} onOpenChange={(open) => !open && setReviewingWinner(null)}>
        <DialogContent className="bg-brand-card border-white/10 text-white sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Process Winner</DialogTitle>
          </DialogHeader>
          
          {reviewingWinner && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">User</p>
                  <p className="font-bold text-white">{reviewingWinner.userId?.firstName} {reviewingWinner.userId?.lastName}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Prize</p>
                  <p className="font-bold text-brand-gold text-xl">{formatCurrency(reviewingWinner.prizeAmount)}</p>
                </div>
              </div>

              <div>
                <Label className="text-gray-400 block mb-2">Submitted Proof</Label>
                {reviewingWinner.proofImageUrl ? (
                  <div className="border border-white/10 rounded-xl overflow-hidden bg-black max-h-[300px] flex items-center justify-center">
                    <img src={reviewingWinner.proofImageUrl} alt="Score Proof" className="max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-gray-500">
                    User has not uploaded a screenshot proof yet.
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                <Button variant="ghost" onClick={() => setReviewingWinner(null)} className="hover:bg-white/5 text-white border border-white/10">
                  Cancel
                </Button>
                
                <div className="flex-1" />
                
                {reviewingWinner.proofImageUrl && reviewingWinner.paymentStatus === 'pending' && (
                  <>
                    <Button onClick={() => handleProcessAction('reject_proof')} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20">
                      <X className="w-4 h-4 mr-2" /> Reject Proof
                    </Button>
                    <Button onClick={() => handleProcessAction('approve_proof')} className="bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-black border border-brand-green/20">
                      <Check className="w-4 h-4 mr-2" /> Approve Proof
                    </Button>
                  </>
                )}
                
                {reviewingWinner.paymentStatus === 'approved' && (
                  <Button onClick={() => handleProcessAction('mark_paid')} className="bg-brand-gold text-black font-bold hover:bg-brand-gold/90 w-full sm:w-auto">
                    <CreditCard className="w-4 h-4 mr-2" /> Submit Payment & Mark Paid
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
