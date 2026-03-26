// @ts-nocheck
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { Loader2, Play, BarChart2, Eye, send } from 'lucide-react'
import { adminApi } from '@/api/admin.api'
import { motion } from 'framer-motion'
import LotteryBall from '@/components/shared/LotteryBall'

export default function AdminDrawsPage() {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<any>(null)

  const { data, isLoading } = useQuery({ queryKey: ['adminDraws'], queryFn: adminApi.getAllDraws })
  const draws = data?.draws || []

  const createMutation = useMutation({
    mutationFn: adminApi.createDraw,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminDraws'] }); toast.success('New draw created!') },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create draw'),
  })
  const simulateMutation = useMutation({
    mutationFn: (id: string) => adminApi.simulateDraw(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminDraws'] }); toast.success('Draw simulated!') },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to simulate'),
  })
  const publishMutation = useMutation({
    mutationFn: (id: string) => adminApi.publishDraw(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminDraws'] }); toast.success('Draw published!') },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to publish'),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Draws Management</h1>
          <p className="text-gray-400 mt-1">Create and manage monthly lottery draws.</p>
        </div>
        <button onClick={() => createMutation.mutate({})} disabled={createMutation.isPending}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-green text-black font-bold rounded-xl hover:bg-brand-green/90 transition-all disabled:opacity-60">
          {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          New Draw
        </button>
      </div>

      {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand-green animate-spin" /></div> : (
        <div className="space-y-4">
          {draws.map((draw: any, i: number) => (
            <motion.div key={draw._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-brand-card border border-white/5 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-white text-lg">Draw #{draw.drawNumber || i + 1}</h3>
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      draw.status === 'published' ? 'bg-brand-green/10 text-brand-green' :
                      draw.status === 'simulated' ? 'bg-brand-gold/10 text-brand-gold' :
                      'bg-white/5 text-gray-400'}`}>
                      {draw.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{new Date(draw.drawDate || draw.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  {draw.winningNumbers && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {draw.winningNumbers.map((n: number, ni: number) => <LotteryBall key={ni} number={n} index={ni} size="sm" />)}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {draw.status === 'pending' && (
                    <button onClick={() => simulateMutation.mutate(draw._id)} disabled={simulateMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-2 bg-brand-accent/10 text-brand-accent rounded-xl text-sm font-semibold hover:bg-brand-accent/20 transition-all disabled:opacity-60">
                      {simulateMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BarChart2 className="w-3.5 h-3.5" />}
                      Simulate
                    </button>
                  )}
                  {draw.status === 'simulated' && (
                    <button onClick={() => publishMutation.mutate(draw._id)} disabled={publishMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-2 bg-brand-green text-black rounded-xl text-sm font-bold hover:bg-brand-green/90 transition-all disabled:opacity-60">
                      {publishMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                      Publish
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {draws.length === 0 && (
            <div className="py-16 text-center text-gray-400">No draws yet. Create the first one!</div>
          )}
        </div>
      )}
    </div>
  )
}
