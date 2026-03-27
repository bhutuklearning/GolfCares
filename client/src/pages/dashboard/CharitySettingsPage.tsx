// @ts-nocheck
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { Loader2, Heart, Check } from 'lucide-react'
import { charityApi } from '@/api/charity.api'
import { useAuthStore } from '@/store/authStore'
import { motion } from 'framer-motion'

export default function CharitySettingsPage() {
  const { user, updateUser } = useAuthStore()
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState(user?.charityId?._id || user?.charityId || '')

  const { data, isLoading } = useQuery({ queryKey: ['charities'], queryFn: charityApi.getCharities })
  const charities = data?.charities || []

  const mutation = useMutation({
    mutationFn: (charityId: string) => charityApi.updateUserCharity({ charityId }),
    onSuccess: (res) => {
      updateUser({ charityId: selected })
      queryClient.invalidateQueries({ queryKey: ['charities'] })
      toast.success('Charity preference updated!')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update'),
  })

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Charity Settings</h1>
        <p className="text-gray-400 mt-1">Choose which charity receives your 10% contribution each month.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {charities.map((c: any, i: number) => (
          <motion.button key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            type="button" onClick={() => setSelected(c._id)}
            className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all ${
              selected === c._id ? 'border-brand-green bg-brand-green/5' : 'border-white/5 bg-brand-card hover:border-white/20'
            }`}>
            {c.imageUrl ? (
              <img src={c.imageUrl} alt={c.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-brand-green" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white">{c.name}</p>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{c.description}</p>
              <p className="text-xs text-brand-green mt-2 font-medium">₹{c.totalReceived?.toLocaleString() || 0} raised</p>
            </div>
            {selected === c._id && <Check className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />}
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => selected && mutation.mutate(selected)}
        disabled={mutation.isPending || !selected || selected === (user?.charityId?._id || user?.charityId)}
        className="px-8 py-3 bg-brand-green text-black font-bold rounded-xl hover:bg-brand-green/90 transition-all disabled:opacity-50 flex items-center gap-2"
      >
        {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        Save Preference
      </button>
    </div>
  )
}
