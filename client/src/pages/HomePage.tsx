// @ts-nocheck
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, Heart } from 'lucide-react'
import { drawApi } from '@/api/draw.api'
import { charityApi } from '@/api/charity.api'
import LotteryBall from '@/components/shared/LotteryBall'

export default function HomePage() {
  const { data: drawData } = useQuery({ queryKey: ['currentDraw'], queryFn: drawApi.getCurrentDraw })
  const { data: charitiesData } = useQuery({ queryKey: ['featuredCharities'], queryFn: charityApi.getFeatured })

  const draw = drawData?.draw
  const featuredCharities = charitiesData?.charities || []

  const floatingNumbers = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    num: Math.floor(Math.random() * 45) + 1,
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
    duration: Math.random() * 4 + 4,
    delay: Math.random() * 2,
  }))

  return (
    <div className="w-full relative overflow-hidden bg-brand-dark">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-12 overflow-hidden">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-brand-accent/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-brand-green/15 rounded-full blur-[100px] pointer-events-none" />

        {floatingNumbers.map((fn) => (
          <motion.div
            key={fn.id}
            initial={{ y: -20 }}
            animate={{ y: 20 }}
            transition={{ duration: fn.duration, delay: fn.delay, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            className="absolute text-white/[0.03] text-7xl font-black pointer-events-none select-none"
            style={{ top: fn.top, left: fn.left }}
          >
            {fn.num}
          </motion.div>
        ))}

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-sm font-medium">
              ⛳ Golf Meets Purpose
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mt-4 text-white"
          >
            Every Stroke Counts.
            <br />
            <span className="gradient-text">Every Point Gives.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            Track your golf scores. Win monthly prizes. Fund the causes you care about.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <Link to="/register">
              <button className="w-full sm:w-auto px-8 py-4 bg-brand-green text-black font-bold rounded-xl hover:bg-brand-green/90 transition-all shadow-lg shadow-brand-green/25 hover:scale-105 active:scale-95 text-lg">
                Subscribe Now →
              </button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 transition-all text-lg hover:border-white/40">
                How It Works
              </button>
            </a>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-brand-green text-sm font-semibold tracking-widest uppercase">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-black mt-2 text-white">
              Simple. Rewarding. <span className="gradient-text">Meaningful.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { emoji: '🏌️', title: 'Enter Your Scores', text: 'Log your last 5 Stableford scores. Simple, fast, takes 30 seconds.', bg: 'bg-brand-green/10' },
              { emoji: '🎲', title: 'Monthly Draw', text: 'Your scores automatically enter you into the prize draw every month.', bg: 'bg-brand-accent/10' },
              { emoji: '❤️', title: 'Fund Charity', text: '10% of your subscription goes directly to your chosen charity.', bg: 'bg-red-500/10' },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-brand-card border border-white/5 rounded-2xl p-8 transition-colors group hover:border-brand-green/30"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${card.bg}`}>{card.emoji}</div>
                <h3 className="text-xl font-bold mt-6 text-white group-hover:text-brand-green transition-colors">{card.title}</h3>
                <p className="text-gray-400 mt-3 leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIZE POOL */}
      <section className="py-24 px-6 bg-[#0d1326] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-brand-gold text-sm font-semibold tracking-widest uppercase">Monthly Rewards</p>
            <h2 className="text-4xl md:text-5xl font-black mt-2 text-white">This Month's Prize Pool</h2>
          </div>

          {draw && (
            <div className="flex justify-center gap-3 flex-wrap mb-12">
              {draw.winningNumbers?.map((n: number, i: number) => (
                <LotteryBall key={i} number={n} index={i} size="lg" />
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-brand-card border border-white/5 rounded-2xl p-8 text-center shadow-lg relative overflow-hidden hover:border-brand-gold/30 transition-colors group">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold" />
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
              <h3 className="text-lg font-bold text-gray-300">5-Number Match</h3>
              <div className="text-4xl font-black text-brand-gold mt-4 mb-2">
                ₹{(draw?.prizePool?.fiveMatch || 0).toFixed(2)}
              </div>
              <p className="text-sm text-gray-500 font-medium">Jackpot Prize</p>
            </div>
            <div className="bg-brand-card border border-white/5 rounded-2xl p-8 text-center shadow-lg hover:border-gray-400/30 transition-colors group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🥈</div>
              <h3 className="text-gray-400 font-bold">4-Number Match</h3>
              <div className="text-4xl font-black text-gray-300 mt-4 mb-2">
                ₹{(draw?.prizePool?.fourMatch || 0).toFixed(2)}
              </div>
              <p className="text-sm text-gray-500">Shared Pool</p>
            </div>
            <div className="bg-brand-card border border-white/5 rounded-2xl p-8 text-center shadow-lg hover:border-brand-accent/30 transition-colors group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🥉</div>
              <h3 className="text-gray-400 font-bold">3-Number Match</h3>
              <div className="text-4xl font-black text-brand-accent mt-4 mb-2">
                ₹{(draw?.prizePool?.threeMatch || 0).toFixed(2)}
              </div>
              <p className="text-sm text-gray-500">Shared Pool</p>
            </div>
          </div>
        </div>
      </section>

      {/* CHARITIES */}
      {featuredCharities.length > 0 && (
        <section className="py-24 px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white">Choose Your Cause</h2>
              <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">Support a charity that matters to you with every subscription.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredCharities.slice(0, 3).map((charity: any) => (
                <motion.div
                  key={charity._id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-brand-card border border-white/5 rounded-2xl overflow-hidden shadow-lg hover:border-brand-green/30 transition-all flex flex-col"
                >
                  {charity.imageUrl ? (
                    <img src={charity.imageUrl} alt={charity.name} className="w-full aspect-video object-cover" />
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-brand-accent/20 to-brand-green/20 flex items-center justify-center">
                      <Heart className="w-10 h-10 text-brand-green/50" />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-brand-green text-xs font-bold tracking-wider mb-2">FEATURED</p>
                    <h3 className="font-bold text-xl text-white mb-2">{charity.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 flex-1 mb-6">{charity.description}</p>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">
                        ₹{charity.totalReceived?.toLocaleString() || 0} raised
                      </span>
                      <Link to="/register" state={{ charityId: charity._id }}>
                        <button className="text-sm font-bold text-brand-green hover:text-brand-green/80 flex items-center gap-1 transition-colors">
                          Support <span className="text-lg leading-none">→</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/charities">
                <button className="px-6 py-3 border border-white/10 text-white font-medium rounded-xl hover:bg-white/5 hover:border-white/30 transition-all">
                  Browse All Charities
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden bg-brand-card border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-brand-green/5 pointer-events-none" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Ready to Play <span className="gradient-text">With Purpose?</span>
          </h2>
          <p className="text-gray-400 mt-6 text-lg md:text-xl leading-relaxed">
            Join thousands of golfers making every round count for charity while competing for monthly prizes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/register">
              <button className="w-full sm:w-auto px-8 py-4 bg-brand-green text-black font-bold rounded-xl hover:bg-brand-green/90 transition-all shadow-lg shadow-brand-green/20 hover:scale-105 active:scale-95 text-lg">
                Subscribe Now
              </button>
            </Link>
            <Link to="/charities">
              <button className="w-full sm:w-auto px-8 py-4 bg-brand-dark border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 transition-all text-lg hover:border-white/40">
                Browse Charities
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
