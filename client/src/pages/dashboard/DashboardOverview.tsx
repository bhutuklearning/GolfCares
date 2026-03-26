// @ts-nocheck
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Target } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { scoreApi } from '@/api/score.api'
import { drawApi } from '@/api/draw.api'
import { winnerApi } from '@/api/winner.api'
import { mockScores, mockDraw, mockWinnings } from '@/mocks/mockData'
import { getGreeting, getStatusColor, formatDate, getMonthName, formatCurrency, getDaysUntilEnd } from '@/utils/helpers'

export default function DashboardOverview() {
  const { user, subscription, useMockData } = useAuthStore()

  const { data: scoresData } = useQuery({ queryKey: ['scores'], queryFn: scoreApi.getScores,  enabled: !useMockData  })
  const { data: drawData } = useQuery({ queryKey: ['currentDraw'], queryFn: drawApi.getCurrentDraw,  enabled: !useMockData  })
  const { data: winningsData } = useQuery({ queryKey: ['myWinnings'], queryFn: () => winnerApi.getMyWinnings(),  enabled: !useMockData  })

  const scores = useMockData ? mockScores : scoresData?.scores || []
  const draw = useMockData ? mockDraw : drawData?.draw
  const winnings = useMockData ? mockWinnings : winningsData?.winnings || []

  const contributionPct = user?.charityContributionPercent || 15
  const estimatedCharityAmt = (subscription?.amount ? (subscription.amount / 100) : 9.99) * (contributionPct / 100)

  // Chart data formatting
  const chartData = [...scores]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(s => ({
      date: format(new Date(s.date), 'MMM dd'),
      score: s.value
    }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111827] border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-gray-400 text-xs mb-1">{label}</p>
          <p className="text-brand-green font-bold text-lg">{payload[0].value} pts</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">{getGreeting(user?.firstName || '')}</h1>
        <p className="text-gray-400 mt-1 text-sm md:text-base">Here's your GolfCares summary</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Card 1 - Subscription */}
        <div className="bg-brand-card border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-400">Subscription</p>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusColor(subscription?.status || 'inactive')}`}>
              {(subscription?.status || 'inactive').toUpperCase()}
            </span>
          </div>
          <p className="text-xl font-bold text-white capitalize">{subscription?.plan || 'No'} Plan</p>
          <p className="text-xs text-gray-500 mt-1 mb-4 flex-1">
            Renews {subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'N/A'}
          </p>
          {subscription?.status === 'active' && (
             <Link to="/dashboard/settings" className="mt-auto">
                <button className="text-xs font-bold text-brand-green hover:underline">Manage Account →</button>
             </Link>
          )}
        </div>

        {/* Card 2 - Scores */}
        <div className="bg-brand-card border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors shadow-lg flex flex-col">
          <p className="text-sm font-medium text-gray-400 mb-2">Scores This Month</p>
          <div className="flex gap-1 mb-3">
            {[0,1,2,3,4].map(i => (
              <div key={i} className={`h-2 rounded flex-1 ${i < scores.length ? 'bg-brand-green' : 'bg-white/10'}`} />
            ))}
          </div>
          <div className="flex items-end justify-between mt-auto mb-4">
            <div>
              <p className="text-2xl font-black text-white leading-none">{scores.length}<span className="text-sm font-normal text-gray-400">/5</span></p>
              <p className="text-xs text-brand-green mt-1 font-medium">
                {scores.length > 0 ? (scores.reduce((s:number,sc:any) => s+sc.value, 0)/scores.length).toFixed(1) : '--'} avg
              </p>
            </div>
          </div>
          <Link to="/dashboard/scores" className="mt-auto">
            <button className="w-full bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-black transition-colors font-bold text-xs py-2 rounded-lg">
              Add Score
            </button>
          </Link>
        </div>

        {/* Card 3 - Next Draw */}
        <div className="bg-brand-card border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors shadow-lg flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-xl pointer-events-none" />
          <p className="text-sm font-medium text-gray-400 mb-2">Next Draw</p>
          <h3 className="text-lg font-bold text-white mb-1">
            1 {getMonthName((new Date().getMonth() + 2) > 12 ? 1 : new Date().getMonth() + 2)}
          </h3>
          <p className="text-2xl font-black text-brand-accent mb-4">
            {getDaysUntilEnd(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString())} <span className="text-sm font-normal text-gray-400">days left</span>
          </p>
          
          <div className="mt-auto bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1">
             ✓ You are entered
          </div>
        </div>

        {/* Card 4 - Charity */}
        <div className="bg-brand-card border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors shadow-lg flex flex-col">
          <p className="text-sm font-medium text-gray-400 mb-2">Your Charity</p>
          <h3 className="text-lg font-bold text-white flex-1 leading-tight line-clamp-2">
            {user?.charityId?.name || 'No charity selected'}
          </h3>
          <p className="text-xs text-brand-green font-medium my-2 bg-brand-green/10 self-start px-2 py-1 rounded">
            {contributionPct}% of subscription
          </p>
          <p className="text-xs text-gray-400 mb-4">Est. {formatCurrency(estimatedCharityAmt)}/mo impact</p>
          
          <Link to="/dashboard/charity" className="mt-auto">
            <button className="text-xs font-bold text-gray-300 hover:text-white hover:underline">Change Charity →</button>
          </Link>
        </div>
      </div>

      {/* CHARTS & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 md:mt-8">
        
        {/* Score History Chart */}
        <div className="lg:col-span-2 bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-white">Score History</h3>
            <Link to="/dashboard/scores">
              <button className="text-sm text-brand-green hover:underline font-medium">View All</button>
            </Link>
          </div>
          
          {scores.length === 0 ? (
            <div className="h-[250px] flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
              <Target className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm font-medium">No scores logged yet</p>
              <p className="text-xs mt-1">Add your first score to see progress</p>
            </div>
          ) : (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    domain={[0, 45]} 
                    stroke="#9CA3AF" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar 
                    dataKey="score" 
                    fill="#00C896" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Winnings */}
        <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-white">Recent Winnings</h3>
            <Link to="/dashboard/winnings">
              <button className="text-sm text-brand-green hover:underline font-medium">View All</button>
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {winnings.length === 0 ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center text-gray-500 px-4 pt-10">
                <div className="text-4xl mb-3 opacity-30 select-none grayscale">🏆</div>
                <p className="text-sm font-medium text-white mb-1">No winnings yet</p>
                <p className="text-xs text-gray-400">Keep entering scores to increase your chances in the next draw.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {winnings.slice(0, 4).map((win: any) => (
                  <div key={win._id} className="bg-white/5 border border-white/5 rounded-xl p-4 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-brand-green" />
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-white text-sm">{getMonthName(win.drawId?.month)} {win.drawId?.year}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getStatusColor(win.paymentStatus)}`}>
                        {win.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-medium text-brand-gold bg-brand-gold/10 px-2 py-1 rounded">
                        {win.matchType}
                      </span>
                      <p className="font-black text-white">{formatCurrency(win.prizeAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  )
}
