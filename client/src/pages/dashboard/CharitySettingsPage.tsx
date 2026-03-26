// @ts-nocheck
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Heart, Search, Check, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { charityApi } from '@/api/charity.api'
import { subscriptionApi } from '@/api/subscription.api'
import { useAuthStore } from '@/store/authStore'
import { mockCharities } from '@/mocks/mockData'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function CharitySettingsPage() {
  const { user, subscription, updateUser, useMockData } = useAuthStore()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [selectedCharity, setSelectedCharity] = useState<string | null>(user?.charityId?._id || user?.charityId || null)
  const [contributionPct, setContributionPct] = useState(user?.charityContributionPercent || 15)
  const [isSaving, setIsSaving] = useState(false)

  const { data: charitiesData, isLoading } = useQuery({ queryKey: ['charities'], queryFn: () => charityApi.getCharities(),  enabled: !useMockData  })
  const charities = useMockData ? mockCharities : charitiesData?.charities || []
  
  const filtered = charities.filter((c: any) => c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))

  const handleSave = async () => {
    if (!selectedCharity) return toast.error('Please select a charity')

    try {
      setIsSaving(true)
      if (useMockData) {
        toast.success('Mock: Preferences updated successfully')
        updateUser({
          charityId: charities.find((c: any) => c._id === selectedCharity),
          charityContributionPercent: contributionPct
        })
        return
      }

      await (subscriptionApi as any).updateCharityPreferences({
        charityId: selectedCharity,
        charityContributionPercent: contributionPct
      })
      
      // Update local storage user state
      updateUser({
        charityId: charities.find((c: any) => c._id === selectedCharity),
        charityContributionPercent: contributionPct
      })
      
      toast.success('Charity preferences updated!')
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update preferences')
    } finally {
      setIsSaving(false)
    }
  }

  const subAmount = subscription?.amount ? subscription.amount / 100 : 9.99
  const estImpact = subAmount * (contributionPct / 100)

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">My Charity</h1>
        <p className="text-gray-400 mt-1">Manage where your subscription contribution goes.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Col: Contribution Settings */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-green" /> Contribution Level
            </h3>
            
            <p className="text-sm text-gray-400 mb-6">
              Choose the percentage of your <span className="text-white font-bold capitalize">{subscription?.plan || 'monthly'} fee</span> to donate.
            </p>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-400 font-medium w-10 text-right text-sm">10%</span>
              <input 
                type="range" 
                min="10" 
                max="50" 
                step="5" 
                value={contributionPct}
                onChange={(e) => setContributionPct(parseInt(e.target.value))}
                className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-green" 
              />
              <span className="text-white font-bold w-10 text-sm">50%</span>
            </div>

            <div className="bg-brand-green/10 border border-brand-green/20 p-4 rounded-xl text-center">
              <p className="text-3xl font-black text-brand-green">{contributionPct}%</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-bold">Of Subscription</p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-sm text-gray-400">Estimated Impact</span>
              <span className="text-lg font-bold text-white">£{estImpact.toFixed(2)}<span className="text-xs text-gray-500 font-normal">/mo</span></span>
            </div>
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full bg-brand-green text-black font-bold h-12 rounded-xl hover:bg-brand-green/90 shadow-lg shadow-brand-green/20"
          >
            {isSaving ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Save Preferences'}
          </Button>
        </div>

        {/* Right Col: Charity Selection */}
        <div className="md:col-span-2">
          <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg h-[600px] flex flex-col">
            <h3 className="font-bold text-lg text-white mb-4">Select Charity</h3>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input 
                placeholder="Search charities..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green w-full" 
              />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {isLoading ? (
                Array.from({length: 4}).map((_, i) => (
                  <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse"></div>
                ))
              ) : filtered.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Heart className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-white mb-1">No charities found</p>
                  <p className="text-sm">Try a different search term.</p>
                </div>
              ) : (
                filtered.map((charity: any) => {
                  const isSelected = selectedCharity === charity._id
                  return (
                    <div 
                      key={charity._id}
                      onClick={() => setSelectedCharity(charity._id)}
                      className={`p-4 rounded-xl cursor-pointer border transition-all flex gap-4
                        ${isSelected ? 'bg-brand-green/10 border-brand-green' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                    >
                      <div className="w-16 h-16 rounded-lg bg-black/40 overflow-hidden shrink-0 relative">
                        {charity.imageUrl ? (
                           <img src={charity.imageUrl} alt={charity.name} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center"><Heart className="w-6 h-6 text-gray-600" /></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-white text-sm line-clamp-1">{charity.name}</h4>
                          {isSelected && <Check className="w-4 h-4 text-brand-green shrink-0 ml-2" />}
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2">{charity.description}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
