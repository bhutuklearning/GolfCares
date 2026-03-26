// @ts-nocheck
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Loader2, Plus, Trash2, Pencil, X, Check } from 'lucide-react'
import { scoreApi } from '@/api/score.api'
import LotteryBall from '@/components/shared/LotteryBall'

export default function ScoresPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editScore, setEditScoreVal] = useState<number | ''>('')
  const [newScore, setNewScore] = useState<number | ''>('')

  const { data, isLoading } = useQuery({ queryKey: ['scores'], queryFn: scoreApi.getScores })
  const scores = data?.scores || []

  const addMutation = useMutation({
    mutationFn: (score: number) => scoreApi.addScore({ stablefordScore: score }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] })
      toast.success('Score added!')
      setNewScore('')
      setShowForm(false)
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add score'),
  })

  const editMutation = useMutation({
    mutationFn: ({ id, score }: { id: string; score: number }) => scoreApi.editScore(id, { stablefordScore: score }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] })
      toast.success('Score updated!')
      setEditId(null)
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update score'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => scoreApi.deleteScore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] })
      toast.success('Score removed')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete score'),
  })

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
    </div>
  )

  const ticketNumbers = scores.slice(0, 5).map((s: any) => s.stablefordScore).filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">My Scores</h1>
          <p className="text-gray-400 mt-1">Log your Stableford scores to enter the monthly draw.</p>
        </div>
        {scores.length < 5 && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-green text-black font-bold rounded-xl hover:bg-brand-green/90 transition-all">
            <Plus className="w-4 h-4" /> Add Score
          </button>
        )}
      </div>

      {/* Ticket preview */}
      {ticketNumbers.length > 0 && (
        <div className="bg-brand-card border border-brand-green/20 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-4 font-medium">Your current lottery numbers:</p>
          <div className="flex gap-3 flex-wrap">
            {ticketNumbers.map((n: number, i: number) => <LotteryBall key={i} number={n} index={i} />)}
            {Array.from({ length: Math.max(0, 5 - ticketNumbers.length) }).map((_, i) => (
              <div key={i} className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                <span className="text-gray-600 text-xs">?</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-brand-card border border-brand-green/20 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4">Add New Score</h3>
          <div className="flex items-center gap-3">
            <input
              type="number" min={0} max={60}
              value={newScore}
              onChange={(e) => setNewScore(Number(e.target.value))}
              placeholder="Stableford score (0–60)"
              className="flex-1 bg-brand-muted border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green"
            />
            <button onClick={() => newScore !== '' && addMutation.mutate(Number(newScore))}
              disabled={addMutation.isPending || newScore === ''}
              className="px-5 py-3 bg-brand-green text-black font-bold rounded-xl hover:bg-brand-green/90 transition-all disabled:opacity-50 flex items-center gap-2">
              {addMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
            <button onClick={() => setShowForm(false)} className="p-3 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Scores list */}
      {scores.length === 0 ? (
        <div className="bg-brand-card border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-gray-400">No scores yet. Add your first Stableford score to get into the draw!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scores.map((score: any, i: number) => (
            <motion.div key={score._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-brand-card border border-white/5 rounded-xl p-5 flex items-center gap-4">
              <LotteryBall number={score.stablefordScore} index={i} size="sm" />
              <div className="flex-1">
                {editId === score._id ? (
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} max={60} value={editScore}
                      onChange={(e) => setEditScoreVal(Number(e.target.value))}
                      className="w-24 bg-brand-muted border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-brand-green" />
                    <button onClick={() => editScore !== '' && editMutation.mutate({ id: score._id, score: Number(editScore) })}
                      className="p-1.5 text-brand-green hover:bg-brand-green/10 rounded-lg transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditId(null)} className="p-1.5 text-gray-400 hover:bg-white/5 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-white">{score.stablefordScore} pts</p>
                    <p className="text-xs text-gray-500">{new Date(score.date || score.createdAt).toLocaleDateString('en-GB')}</p>
                  </div>
                )}
              </div>
              {editId !== score._id && (
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditId(score._id); setEditScoreVal(score.stablefordScore) }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteMutation.mutate(score._id)}
                    disabled={deleteMutation.isPending}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
