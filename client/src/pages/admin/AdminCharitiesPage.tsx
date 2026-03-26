// @ts-nocheck
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Plus, MoreVertical, Heart, Star, Edit, Trash } from 'lucide-react'
import { charityApi } from '@/api/charity.api'
import { useAuthStore } from '@/store/authStore'
import { mockCharities } from '@/mocks/mockData'
import { formatCurrency } from '@/utils/helpers'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function AdminCharitiesPage() {
  const [search, setSearch] = useState('')
  const { useMockData } = useAuthStore()

  const { data, isLoading } = useQuery<any>({ queryKey: ['adminCharities'], queryFn: () => charityApi.getCharities(),  enabled: !useMockData  })
  const charities = useMockData ? mockCharities : data?.charities || []

  const filtered = charities.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Charity Partners</h1>
          <p className="text-gray-400 mt-1">Manage approved charities and donation metrics.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input 
              placeholder="Search charities..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green w-full" 
            />
          </div>
          <Button className="bg-brand-green text-black font-bold hover:bg-brand-green/90 shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Add Charity
          </Button>
        </div>
      </div>

      <div className="bg-brand-card border border-white/5 rounded-2xl shadow-lg overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
                <th className="p-5 w-[350px]">Charity</th>
                <th className="p-5">Total Raised</th>
                <th className="p-5">Events</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                 <tr><td colSpan={5} className="p-5"><div className="h-20 bg-white/5 rounded-lg animate-pulse w-full"></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-500">No charities found.</td></tr>
              ) : (
                filtered.map((charity: any) => (
                  <tr key={charity._id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-black/50 overflow-hidden shrink-0">
                          {charity.imageUrl ? (
                            <img src={charity.imageUrl} alt={charity.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Heart className="w-5 h-5 text-gray-600" /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white flex items-center gap-2">
                            {charity.name}
                            {charity.isFeatured && <Star className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />}
                          </p>
                          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{charity.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="font-black text-brand-green">{formatCurrency(charity.totalReceived)}</p>
                    </td>
                    <td className="p-5 text-sm text-gray-300">
                       {charity.events?.length || 0} Listed
                    </td>
                    <td className="p-5">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-green-500/50 text-green-400 bg-green-500/10">
                        Active
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-brand-card border-white/10 text-white w-48 shadow-xl">
                          <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer py-2">
                            <Edit className="w-4 h-4 mr-2" /> Edit Details
                          </DropdownMenuItem>
                          {!charity.isFeatured && (
                            <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer py-2">
                              <Star className="w-4 h-4 mr-2 text-brand-gold" /> Mark Featured
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="focus:bg-red-500/20 focus:text-red-400 text-red-500 cursor-pointer py-2 border-t border-white/5 mt-1 pt-2">
                            <Trash className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
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
