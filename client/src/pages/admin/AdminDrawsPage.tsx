// @ts-nocheck
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Trophy, RefreshCw, Eye, CheckCircle2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { adminApi } from '@/api/admin.api'
import { useAuthStore } from '@/store/authStore'
import { mockDraws } from '@/mocks/mockData'
import { getMonthName, formatCurrency } from '@/utils/helpers'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function AdminDrawsPage() {
  const [isTriggering, setIsTriggering] = useState(false)
  const [selectedDraw, setSelectedDraw] = useState<any>(null)
  
  const queryClient = useQueryClient()
  const { useMockData } = useAuthStore()

  const { data, isLoading } = useQuery<any>({ queryKey: ['adminDraws'], queryFn: () => adminApi.getAllDraws(),  enabled: !useMockData  })
  const draws = useMockData ? mockDraws : data?.draws || []

  const handleTriggerDraw = async () => {
    try {
      setIsTriggering(true)
      if (useMockData) {
        toast.success('Mock: Draw triggered successfully')
        return
      }
      
      const payload = {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        drawType: 'random'
      }
      
      await adminApi.createDraw(payload)
      toast.success('Draw triggered and calculated successfully')
      queryClient.invalidateQueries({ queryKey: ['adminDraws'] })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to trigger draw')
    } finally {
      setIsTriggering(false)
    }
  }

  const handlePublishDraw = async () => {
    if (!selectedDraw) return
    try {
      if (useMockData) {
        toast.success(`Mock: Draw ${selectedDraw._id} published`)
        setSelectedDraw(null)
        return
      }
      
      await adminApi.publishDraw(selectedDraw._id)
      toast.success('Draw published to public site')
      queryClient.invalidateQueries({ queryKey: ['adminDraws'] })
      setSelectedDraw(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to publish draw')
    }
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Draw Management</h1>
          <p className="text-gray-400 mt-1">Manage monthly lottery draws and prize distributions.</p>
        </div>
        <Button 
          onClick={handleTriggerDraw}
          disabled={isTriggering}
          className="bg-brand-green text-black font-bold flex items-center hover:bg-brand-green/90 shadow-lg shadow-brand-green/20"
        >
          {isTriggering ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Trophy className="w-4 h-4 mr-2" />}
          Trigger New Draw
        </Button>
      </div>

      <div className="bg-brand-card border border-white/5 rounded-2xl shadow-lg overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
                <th className="p-5">Period</th>
                <th className="p-5">Winning Numbers</th>
                <th className="p-5">Total Pool</th>
                <th className="p-5">Type</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right flex-1">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                 <tr><td colSpan={6} className="p-5"><div className="h-20 bg-white/5 rounded-lg animate-pulse w-full"></div></td></tr>
              ) : draws.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center text-gray-500">No draws found.</td></tr>
              ) : (
                draws.map((draw: any) => (
                  <tr key={draw._id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5">
                      <p className="font-bold text-white">{getMonthName(draw.month)} {draw.year}</p>
                    </td>
                    <td className="p-5">
                      <div className="flex gap-1">
                        {draw.winningNumbers.map((n: number, i: number) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-white/10 text-white text-xs flex items-center justify-center font-bold">
                            {n}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-5 font-bold text-brand-green">
                      {formatCurrency(draw.prizePool?.total || 0)}
                    </td>
                    <td className="p-5">
                      <span className="text-xs font-bold uppercase tracking-wider bg-white/10 text-gray-300 px-2.5 py-1 rounded border border-white/10">
                        {draw.drawType}
                      </span>
                    </td>
                    <td className="p-5">
                      {draw.isPublished ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-green-500/50 text-green-400 bg-green-500/10 flex items-center w-fit gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-yellow-500/50 text-yellow-400 bg-yellow-500/10">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedDraw(draw)} className="text-gray-400 hover:text-white flex items-center ml-auto">
                        <Eye className="w-4 h-4 mr-2" /> Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Draw Details Dialog */}
      <Dialog open={selectedDraw !== null} onOpenChange={(open) => !open && setSelectedDraw(null)}>
        <DialogContent className="bg-brand-card border-white/10 text-white sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Draw Details</DialogTitle>
          </DialogHeader>
          
          {selectedDraw && (
            <div className="space-y-6 pt-4">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                <div>
                  <p className="text-sm text-gray-400">Period</p>
                  <p className="text-xl font-bold text-white">{getMonthName(selectedDraw.month)} {selectedDraw.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Status</p>
                  <p className={`font-bold ${selectedDraw.isPublished ? 'text-brand-green' : 'text-yellow-400'}`}>
                    {selectedDraw.isPublished ? 'PUBLISHED' : 'DRAFT'}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-gray-400 block mb-2">Winning Numbers</Label>
                <div className="flex gap-2">
                  {selectedDraw.winningNumbers.map((n: number, i: number) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-brand-green/20 border border-brand-green text-brand-green text-lg flex items-center justify-center font-bold shadow-lg shadow-brand-green/10">
                      {n}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0a0f1e] rounded-xl p-4 border border-white/5">
                <p className="font-bold text-white mb-4">Prize Pool Distribution</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Pool</span>
                    <span className="font-bold text-white">{formatCurrency(selectedDraw.prizePool?.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-white/5 pt-3">
                    <span className="text-brand-gold font-medium">5 Matches (Jackpot)</span>
                    <span className="font-bold text-white">{formatCurrency(selectedDraw.prizePool?.fiveMatch)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 font-medium">4 Matches</span>
                    <span className="font-bold text-white">{formatCurrency(selectedDraw.prizePool?.fourMatch)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-accent font-medium">3 Matches</span>
                    <span className="font-bold text-white">{formatCurrency(selectedDraw.prizePool?.threeMatch)}</span>
                  </div>
                </div>
              </div>

              {!selectedDraw.isPublished && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                  <p className="text-sm text-red-400 font-bold mb-1">Warning: Irreversible Action</p>
                  <p className="text-xs text-red-400/80">Publishing this draw will make it visible to all users and create pending prizes for winners. This cannot be undone.</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button variant="ghost" onClick={() => setSelectedDraw(null)} className="hover:bg-white/5 text-white">
                  Close
                </Button>
                {!selectedDraw.isPublished && (
                  <Button onClick={handlePublishDraw} className="bg-brand-green text-black font-bold hover:bg-brand-green/90">
                    Publish Draw
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
