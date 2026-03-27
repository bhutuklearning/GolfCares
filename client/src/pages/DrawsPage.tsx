// @ts-nocheck
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { drawApi } from '@/api/draw.api'
import { useAuthStore } from '@/store/authStore'
import { mockDraws, mockWinnings } from '@/mocks/mockData'
import { getMonthName, formatCurrency } from '@/utils/helpers'
import LotteryBall from '@/components/shared/LotteryBall'

export default function DrawsPage() {
  const { useMockData, user, isAuthenticated } = useAuthStore()
  
  const { data: drawsData, isLoading: isLoadingDraws } = useQuery({ queryKey: ['publishedDraws'], queryFn: () => drawApi.getPublishedDraws(),  enabled: !useMockData  })
  
  // To show user winnings contextually if logged in
  const { data: winningsData } = useQuery({ queryKey: ['myWinnings'], queryFn: () => import('@/api/winner.api').then(m => m.winnerApi.getMyWinnings()),  enabled: isAuthenticated && !useMockData  })

  const draws = useMockData ? mockDraws : drawsData?.draws || []
  const myWinnings = useMockData && isAuthenticated ? mockWinnings : winningsData?.winnings || []

  return (
    <div className="min-h-screen bg-brand-dark pb-24 border-t border-transparent overflow-x-hidden">
      {/* Hero */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-brand-card/50 to-transparent relative border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-accent/10 rounded-[100%] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-brand-green/10 rounded-[100%] blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white"
          >
            Monthly <span className="gradient-text">Draw Results</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-6 text-lg"
          >
            Draws happen on the 1st of every month automatically. Check past winning numbers and see the prize distributions.
          </motion.p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 mt-16 space-y-12">
        {isLoadingDraws && (
          <div className="space-y-8">
            {[1, 2].map(i => (
              <div key={i} className="bg-brand-card rounded-2xl h-80 animate-pulse border border-white/5"></div>
            ))}
          </div>
        )}

        {!isLoadingDraws && draws.length === 0 && (
          <div className="text-center py-24 bg-brand-card rounded-3xl border border-white/5">
            <Trophy className="w-20 h-20 text-brand-green/30 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">No draws published yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">The first draw is coming soon! Make sure you subscribe and enter your scores to participate.</p>
          </div>
        )}

        {draws.map((draw: any, index: number) => {
          // Check if current user won in this draw
          const myWin = myWinnings.find((w: any) => w.drawId._id === draw._id || w.drawId === draw._id)
          
          return (
            <motion.div 
              key={draw._id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className="bg-brand-card border border-white/5 rounded-3xl p-5 sm:p-6 md:p-10 shadow-xl overflow-hidden relative"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white">{getMonthName(draw.month)} {draw.year} Draw</h2>
                  <p className="text-gray-400 mt-1 text-sm md:text-base">Total Prize Pool: <span className="text-white font-bold">{formatCurrency(draw.prizePool?.total || 0)}</span></p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider bg-white/5 text-gray-300 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-white/10">
                    {draw.drawType === 'algorithmic' ? '🤖 Algorithm' : '🎲 Random'}
                  </span>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider bg-green-500/20 text-green-400 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-green-500/20">
                    ✓ Published
                  </span>
                </div>
              </div>

              {draw.jackpotRollover && (
                <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-4 md:p-5 mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                  <div className="text-2xl md:text-3xl">🏆</div>
                  <div>
                    <p className="font-bold text-brand-gold text-base md:text-lg">Jackpot Rolled Over!</p>
                    <p className="text-xs md:text-sm text-brand-gold/70 mt-0.5">There were no 5-number matches this month. The jackpot carries over to next month's draw!</p>
                  </div>
                </div>
              )}

              {/* Winning Numbers */}
              <div className="bg-[#0a0f1e] rounded-2xl p-5 md:p-8 border border-white/5 mb-6 md:mb-8 overflow-hidden">
                <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 md:mb-6 text-center">Official Winning Numbers</p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6">
                  {draw.winningNumbers.map((num: number, i: number) => (
                    <div key={i} className="transform scale-[0.8] sm:scale-90 md:scale-100 origin-center">
                      <LotteryBall number={num} index={i} size="lg" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Prize Table */}
              <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
                <table className="w-full text-left border-collapse min-w-[280px]">
                  <thead>
                    <tr className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/10">
                      <th className="pb-3 md:pb-4 pl-2 md:pl-4 whitespace-nowrap">Match Tier</th>
                      <th className="pb-3 md:pb-4 text-right pr-2 md:pr-4 whitespace-nowrap">Prize Pool</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-3 md:py-4 pl-2 md:pl-4 font-bold text-brand-gold flex items-center gap-2 text-sm md:text-base">
                        <span className="shrink-0 text-lg md:text-xl">🥇</span> <span className="whitespace-nowrap">5-Number Match</span>
                      </td>
                      <td className="py-3 md:py-4 pr-2 md:pr-4 text-right font-medium text-white text-sm md:text-base">{formatCurrency(draw.prizePool?.fiveMatch || 0)}</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-3 md:py-4 pl-2 md:pl-4 font-bold text-gray-300 flex items-center gap-2 text-sm md:text-base">
                        <span className="shrink-0 text-lg md:text-xl">🥈</span> <span className="whitespace-nowrap">4-Number Match</span>
                      </td>
                      <td className="py-3 md:py-4 pr-2 md:pr-4 text-right font-medium text-white text-sm md:text-base">{formatCurrency(draw.prizePool?.fourMatch || 0)}</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-3 md:py-4 pl-2 md:pl-4 font-bold text-brand-accent flex items-center gap-2 text-sm md:text-base">
                        <span className="shrink-0 text-lg md:text-xl">🥉</span> <span className="whitespace-nowrap">3-Number Match</span>
                      </td>
                      <td className="py-3 md:py-4 pr-2 md:pr-4 text-right font-medium text-white text-sm md:text-base">{formatCurrency(draw.prizePool?.threeMatch || 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* User Result Context */}
              {isAuthenticated && myWin && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-6 md:mt-8 p-5 md:p-6 rounded-2xl bg-gradient-to-r from-brand-green/20 to-brand-green/5 border border-brand-green/40 relative overflow-hidden"
                >
                  <div className="absolute -right-10 -top-10 opacity-10">
                    <Trophy className="w-40 h-40" />
                  </div>
                  <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-brand-green flex items-center justify-center text-black shadow-lg shadow-brand-green/30">
                      <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-base md:text-lg">Congratulations!</p>
                      <p className="text-brand-green font-medium text-sm md:text-base mt-0.5 md:mt-0">
                        Your score got a {myWin.matchType} — You won {formatCurrency(myWin.prizeAmount)}!
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
