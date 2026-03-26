// @ts-nocheck
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Search, UserCheck, UserX } from 'lucide-react'
import { adminApi } from '@/api/admin.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({ queryKey: ['adminUsers'], queryFn: adminApi.getAllUsers })
  const users = (data?.users || []).filter((u: any) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.toggleUserStatus(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); toast.success('Status updated') },
    onError: () => toast.error('Failed to update status'),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Users</h1>
          <p className="text-gray-400 mt-1">{users.length} members found</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-9 pr-4 py-2.5 bg-brand-card border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green text-sm w-64" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand-green animate-spin" /></div>
      ) : (
        <div className="bg-brand-card border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase hidden md:table-cell">Plan</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase hidden lg:table-cell">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u._id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-green/10 flex items-center justify-center font-bold text-brand-green text-sm">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{u.firstName} {u.lastName}</p>
                        <p className="text-gray-400 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-300 capitalize">{u.subscription?.plan || 'None'}</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-brand-accent/20 text-brand-accent' : 'bg-white/5 text-gray-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.isActive ? 'bg-brand-green/10 text-brand-green' : 'bg-red-500/10 text-red-400'}`}>
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleMutation.mutate(u._id)}
                      disabled={toggleMutation.isPending || u.role === 'admin'}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-40 text-gray-400 hover:text-white">
                      {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="py-12 text-center text-gray-400">No users found</div>
          )}
        </div>
      )}
    </div>
  )
}
