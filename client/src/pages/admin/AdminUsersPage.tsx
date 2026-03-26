// @ts-nocheck
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, MoreVertical, Shield, Ban, Eye } from 'lucide-react'
import { adminApi } from '@/api/admin.api'
import { useAuthStore } from '@/store/authStore'
import { mockAdminUsers as mockUsers } from '@/mocks/mockData'
import { getStatusColor, formatDate } from '@/utils/helpers'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const { useMockData } = useAuthStore()

  const { data, isLoading } = useQuery<any>({ queryKey: ['adminUsers'], queryFn: () => adminApi.getUsers(),  enabled: !useMockData  })
  const users = useMockData ? mockUsers : data?.users || []

  const filtered = users.filter((u: any) => 
    u.firstName.toLowerCase().includes(search.toLowerCase()) || 
    u.lastName.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">User Management</h1>
          <p className="text-gray-400 mt-1">View and manage platform users.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green w-full" 
          />
        </div>
      </div>

      <div className="bg-brand-card border border-white/5 rounded-2xl shadow-lg overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
                <th className="p-5">User</th>
                <th className="p-5">Role</th>
                <th className="p-5">Subscription</th>
                <th className="p-5">Joined</th>
                <th className="p-5 text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                 <tr><td colSpan={5} className="p-5"><div className="h-20 bg-white/5 rounded-lg animate-pulse w-full"></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-500">No users found.</td></tr>
              ) : (
                filtered.map((user: any) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center font-bold">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      {user.role === 'admin' ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded w-fit border border-red-500/20">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-gray-300 bg-white/5 px-2.5 py-1 rounded w-fit border border-white/10">
                          User
                        </span>
                      )}
                    </td>
                    <td className="p-5">
                       {user.subscription?.status === 'active' ? (
                          <div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${getStatusColor(user.subscription.status)} block w-fit mb-1`}>
                              Active
                            </span>
                            <span className="text-xs text-gray-400 capitalize">{user.subscription.plan} Plan</span>
                          </div>
                       ) : (
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${getStatusColor(user.subscription?.status || 'inactive')} block w-fit`}>
                            {user.subscription?.status || 'Inactive'}
                          </span>
                       )}
                    </td>
                    <td className="p-5 text-sm text-gray-300">
                      {formatDate(user.createdAt || new Date())}
                    </td>
                    <td className="p-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-brand-card border-white/10 text-white w-48 shadow-xl">
                          <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer py-2">
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          {user.role !== 'admin' && (
                            <>
                              <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer py-2">
                                <Shield className="w-4 h-4 mr-2" /> Make Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-red-500/20 focus:text-red-400 text-red-500 cursor-pointer py-2 border-t border-white/5 mt-1 pt-2">
                                <Ban className="w-4 h-4 mr-2" /> Suspend User
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
