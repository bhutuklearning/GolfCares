// @ts-nocheck
import { useQuery } from '@tanstack/react-query'
import { Loader2, TrendingUp, Users, Trophy, Heart } from 'lucide-react'
import { adminApi } from '@/api/admin.api'
import StatCard from '@/components/shared/StatCard'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['adminStats'], queryFn: adminApi.getStats })
  const stats = data?.stats || data

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Platform overview and key metrics.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="green" />
        <StatCard icon={TrendingUp} label="Active Subs" value={stats?.activeSubscriptions || 0} color="accent" />
        <StatCard icon={Trophy} label="Total Draws" value={stats?.totalDraws || 0} color="gold" />
        <StatCard icon={Heart} label="Charity Funded" value={`₹${(stats?.totalDonated || 0).toFixed(0)}`} color="red" />
      </div>

      {stats?.revenueByMonth && stats.revenueByMonth.length > 0 && (
        <div className="bg-brand-card border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stats.revenueByMonth}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C896" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00C896" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="month" stroke="#6B7280" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 12 }}
                labelStyle={{ color: '#fff' }} formatter={(v: any) => [`₹${v}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#00C896" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
