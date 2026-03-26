// @ts-nocheck
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Trophy, Target, Heart, TrendingUp, Loader2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { scoreApi } from '@/api/score.api'
import { drawApi } from '@/api/draw.api'
import { winnerApi } from '@/api/winner.api'
import StatCard from '@/components/shared/StatCard'
import LotteryBall from '@/components/shared/LotteryBall'

export default function DashboardOverview() {
  const { user } = useAuthStore()

  const { data: scoresData } = useQuery({ queryKey: ['scores'], queryFn: scoreApi.getScores })
  const { data: drawData } = useQuery({ queryKey: ['currentDraw'], queryFn: drawApi.getCurrentDraw })
  const { data: winningsData } = useQuery({ queryKey: ['myWinnings'], queryFn: winnerApi.getMyWinnings })

  const scores = scoresData?.scores || []
  const draw = drawData?.draw
  const winnings = winningsData?.winnings || []

  const totalEligibleScores = scores.filter((s: any) => s.stablefordScore != null).length
  const topScore = scores.length > 0 ? Math.max(...scores.map((s: any) => s.stablefordScore || 0)) : 0
  const totalWon = winnings.reduce((sum: number, w: any) => sum + (w.prizeAmount || 0), 0)

  const userNumbers = scores.slice(0, 5).map((s: any) => s.stablefordScore).filter(Boolean)

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-white">
          Welcome back, <span className="text-brand-green">{user?.firstName}</span> 👋
        </h1>
        <p className="text-gray-400 mt-1">Here's how you're doing this month.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target} label="Scores Logged" value={scores.length} color="green" />
        <StatCard icon={TrendingUp} label="Best Score" value={topScore || '--'} color="accent" suffix="pts" />
        <StatCard icon={Trophy} label="Prizes Won" value={winnings.length} color="gold" />
        <StatCard icon={Heart} label="Total Winnings" value={`£${totalWon.toFixed(2)}`} color="red" />
      </div>

      {/* Lottery ticket */}
      {draw && (
        <div className="bg-brand-card border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Your Lottery Numbers</h2>
            <span className="text-sm text-gray-400">{totalEligibleScores}/5 scores submitted</span>
          </div>
          {userNumbers.length > 0 ? (
            <div className="flex gap-3 flex-wrap">
              {userNumbers.map((n: number, i: number) => <LotteryBall key={i} number={n} index={i} />)}
              {Array.from({ length: Math.max(0, 5 - userNumbers.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                  <span className="text-gray-600 text-xs">?</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-gray-400">
              <AlertCircle className="w-5 h-5 text-brand-gold" />
              <p>No scores yet. <Link to="/dashboard/scores" className="text-brand-green hover:underline font-medium">Add your scores</Link> to get your lottery numbers.</p>
            </div>
          )}
          {draw.winningNumbers && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-3">This month's winning numbers:</p>
              <div className="flex gap-3 flex-wrap">
                {draw.winningNumbers.map((n: number, i: number) => <LotteryBall key={i} number={n} index={i} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent wins */}
      {winnings.length > 0 && (
        <div className="bg-brand-card border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Winnings</h2>
          <div className="space-y-3">
            {winnings.slice(0, 3).map((w: any) => (
              <div key={w._id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="font-semibold text-white">{w.prizeType} Match</p>
                  <p className="text-xs text-gray-400">{new Date(w.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
                </div>
                <div className={`font-black text-lg ${w.status === 'paid' ? 'text-brand-green' : 'text-brand-gold'}`}>
                  £{w.prizeAmount?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
