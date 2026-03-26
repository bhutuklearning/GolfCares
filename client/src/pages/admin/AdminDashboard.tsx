// @ts-nocheck
import { useQuery } from '@tanstack/react-query'
import { Users, Trophy, Heart, Activity } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { adminApi } from '@/api/admin.api'
import { useAuthStore } from '@/store/authStore'
import { mockAdminStats } from '@/mocks/mockData'
import { formatCurrency } from '@/utils/helpers'

export default function AdminDashboard() {
  const { useMockData } = useAuthStore()
  
  const { data, isLoading } = useQuery<any>({ queryKey: ['adminStats'], queryFn: () => adminApi.getStats(),  enabled: !useMockData  })
  const stats = useMockData ? mockAdminStats : data?.stats || null

  // Chart placeholder data
  const revenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
  ]

  if (isLoading) {
    return <div className="text-white animate-pulse">Loading dashboard...</div>
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Platform Overview</h1>
        <p className="text-gray-400 mt-1">High-level metrics and system status.</p>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden group hover:border-red-500/30 transition-colors">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><Users className="w-32 h-32 text-white" /></div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Total Users</p>
          <p className="text-4xl font-black text-white">{stats?.totalUsers?.toLocaleString() || 0}</p>
        </div>
        
        <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden group hover:border-red-500/30 transition-colors">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><Activity className="w-32 h-32 text-brand-green" /></div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            Active Subs <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          </p>
          <p className="text-4xl font-black text-brand-green">{stats?.activeSubscriptions?.toLocaleString() || 0}</p>
        </div>
        
        <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden group hover:border-red-500/30 transition-colors">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><Heart className="w-32 h-32 text-brand-accent" /></div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Total Donated</p>
          <p className="text-4xl font-black text-brand-accent">{formatCurrency(stats?.totalCharityDonations || 0)}</p>
        </div>
        
        <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden group hover:border-red-500/30 transition-colors">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><Trophy className="w-32 h-32 text-brand-gold" /></div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Total Prizes Paid</p>
          <p className="text-4xl font-black text-brand-gold">{formatCurrency(stats?.totalPrizesPaid || 0)}</p>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg mb-8">
        <h3 className="font-bold text-lg text-white mb-6">Revenue Growth</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C896" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00C896" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `£${val}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#00C896', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="value" stroke="#00C896" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-lg text-white mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-sm text-gray-300">Stripe Webhooks</span>
              <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded border border-green-500/20">OPERATIONAL</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-sm text-gray-300">Background Jobs</span>
              <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded border border-green-500/20">OPERATIONAL</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-sm text-gray-300">Database Connection</span>
              <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded border border-green-500/20">OPERATIONAL</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0f1e] border border-brand-green/20 rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-lg text-white mb-2 text-brand-green">Quick Actions</h3>
          <p className="text-sm text-gray-400 mb-6">Frequently used administrative tasks.</p>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-xl bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-black font-bold text-sm transition-colors border border-brand-green/20">
              Trigger Manual Draw
            </button>
            <button className="w-full text-left p-3 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold text-sm transition-colors">
              Export Charity Donation Report
            </button>
            <button className="w-full text-left p-3 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold text-sm transition-colors">
              Process Winner Payouts
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
