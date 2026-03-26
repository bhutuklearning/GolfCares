// @ts-nocheck
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Plus, Minus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'
import { scoreApi } from '@/api/score.api'
import { useAuthStore } from '@/store/authStore'
import { mockScores } from '@/mocks/mockData'
import { formatDate } from '@/utils/helpers'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function ScoresPage() {
  const [editingScore, setEditingScore] = useState<any>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  
  const queryClient = useQueryClient()
  const { useMockData } = useAuthStore()

  const { data: scoresData, isLoading } = useQuery({ queryKey: ['scores'], queryFn: scoreApi.getScores,  enabled: !useMockData  })
  const scores = useMockData ? mockScores : scoresData?.scores || []

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      value: 36,
      date: format(new Date(), 'yyyy-MM-dd')
    }
  })
  
  const scoreValue = watch('value')

  const { register: registerEdit, handleSubmit: handleEditSubmit, setValue: setEditValue, watch: watchEdit } = useForm()
  const editScoreValue = watchEdit('value')

  // Open Edit Dialog
  const openEdit = (score: any) => {
    setEditValue('value', score.value)
    setEditValue('date', format(new Date(score.date), 'yyyy-MM-dd'))
    setEditingScore(score)
  }

  const handleAdd = async (data: any) => {
    try {
      setIsAdding(true)
      if (useMockData) {
        toast.success('Mock: Score added successfully')
        reset({ value: 36, date: format(new Date(), 'yyyy-MM-dd') })
        return
      }
      await scoreApi.addScore(data)
      toast.success('Score added successfully')
      queryClient.invalidateQueries({ queryKey: ['scores'] })
      reset({ value: 36, date: format(new Date(), 'yyyy-MM-dd') })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add score')
    } finally {
      setIsAdding(false)
    }
  }

  const handleEdit = async (data: any) => {
    try {
      if (useMockData) {
        toast.success('Mock: Score updated successfully')
        setEditingScore(null)
        return
      }
      await scoreApi.editScore(editingScore._id, data)
      toast.success('Score updated successfully')
      queryClient.invalidateQueries({ queryKey: ['scores'] })
      setEditingScore(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update score')
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    try {
      if (useMockData) {
        toast.success('Mock: Score deleted successfully')
        setDeleteConfirm(null)
        return
      }
      await scoreApi.deleteScore(deleteConfirm)
      toast.success('Score deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['scores'] })
      setDeleteConfirm(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete score')
    }
  }

  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">My Scores</h1>
        <p className="text-gray-400 mt-1">Log your Stableford scores to enter the monthly draw</p>
      </div>

      {/* Add Score Form */}
      <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg mb-8">
        <form onSubmit={handleSubmit(handleAdd)} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <Label className="text-gray-300">Stableford Score</Label>
            <div className="flex items-center gap-3 mt-2">
              <button 
                type="button" 
                onClick={() => setValue('value', Math.max(1, scoreValue - 1))}
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
              >
                <Minus className="w-4 h-4" />
              </button>
              <Input 
                {...register('value', { valueAsNumber: true })} 
                type="number" 
                min={1} 
                max={45} 
                className="text-center text-xl font-bold h-10 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green flex-1"
              />
              <button 
                type="button" 
                onClick={() => setValue('value', Math.min(45, scoreValue + 1))}
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <Label className="text-gray-300">Date Played</Label>
            <Input 
              {...register('date')} 
              type="date" 
              max={today} 
              className="mt-2 h-10 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" 
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isAdding}
            className="w-full bg-brand-green text-black hover:bg-brand-green/90 font-bold h-10 rounded-lg shadow-lg shadow-brand-green/20"
          >
            {isAdding ? <Loader2 className="animate-spin w-5 h-5" /> : '+ Add Score'}
          </Button>
        </form>
      </div>

      {/* Progress Bar Section */}
      <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg mb-8 flex flex-col items-center">
        <p className="text-sm font-bold text-gray-300 mb-4 tracking-widest uppercase">Monthly Draw Progress</p>
        <div className="flex gap-2 w-full max-w-sm">
          {[0,1,2,3,4].map(i => (
            <div key={i} className={`h-3 rounded-full flex-1 transition-all duration-500 ${i < scores.length ? 'bg-brand-green shadow-[0_0_10px_rgba(0,200,150,0.5)]' : 'bg-white/10'}`} />
          ))}
        </div>
        <p className="text-gray-400 mt-4 text-sm font-medium">
          {scores.length}/5 scores entered {scores.length >= 5 ? '🎉 You are set for the draw!' : ''}
        </p>
      </div>

      {/* Scores List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({length: 3}).map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse"></div>
          ))
        ) : scores.length === 0 ? (
          <div className="text-center py-16 bg-white/5 border border-white/5 border-dashed rounded-2xl">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-30 text-brand-green" />
            <p className="text-gray-300 font-medium">No scores yet.</p>
            <p className="text-sm text-gray-500 mt-1">Add your first score above!</p>
          </div>
        ) : (
          <AnimatePresence>
            {scores.map((score: any) => (
              <motion.div 
                key={score._id}
                layout
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-4 bg-brand-card border border-white/5 rounded-xl p-4 md:p-5 shadow-lg group hover:border-white/10 transition-colors"
              >
                <div className="text-sm text-gray-400 w-24 md:w-32 font-medium">
                  {formatDate(score.date)}
                </div>
                
                <div className={`text-3xl font-black w-16 text-center
                  ${score.value >= 30 ? 'text-brand-green' : score.value >= 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {score.value}
                </div>
                
                <div className="hidden sm:block">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent tracking-wider uppercase border border-brand-accent/20">
                    Stableford
                  </span>
                </div>
                
                <div className="flex-1" />
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEdit(score)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm(score._id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editingScore !== null} onOpenChange={(open) => !open && setEditingScore(null)}>
        <DialogContent className="bg-brand-card border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Score</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit(handleEdit)} className="space-y-6 pt-4">
            <div>
              <Label className="text-gray-300">Stableford Score</Label>
              <div className="flex items-center gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => setEditValue('value', Math.max(1, editScoreValue - 1))}
                  className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <Input 
                  {...registerEdit('value', { valueAsNumber: true })} 
                  type="number" 
                  min={1} max={45} 
                  className="text-center text-2xl font-bold h-12 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green flex-1"
                />
                <button 
                  type="button" 
                  onClick={() => setEditValue('value', Math.min(45, editScoreValue + 1))}
                  className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <Label className="text-gray-300">Date Played</Label>
              <Input 
                {...registerEdit('date')} 
                type="date" 
                max={today} 
                className="mt-2 h-12 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" 
              />
            </div>
            <Button type="submit" className="w-full bg-brand-green text-black font-bold h-12 rounded-xl hover:bg-brand-green/90">
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="bg-brand-card border-white/10 text-white sm:max-w-sm text-center p-8">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <Trash2 className="w-8 h-8 text-red-400" />
          </div>
          <DialogTitle className="text-xl mb-2">Delete this score?</DialogTitle>
          <p className="text-gray-400 text-sm mb-8 mt-2">This action cannot be undone. It might remove your entry for this month's draw.</p>
          <div className="flex gap-4">
            <Button variant="ghost" className="flex-1 hover:bg-white/5 text-white" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
