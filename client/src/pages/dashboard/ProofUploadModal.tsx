import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { winnerApi } from '@/api/winner.api'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ProofUploadModal({
  winnerId,
  isOpen,
  onClose
}: {
  winnerId: string | null
  isOpen: boolean
  onClose: () => void
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (!winnerId) throw new Error('No winner ID selected')
      return winnerApi.uploadProof(winnerId, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myWinnings'] })
      toast.success('Proof uploaded successfully!')
      setSelectedFile(null)
      onClose()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to upload proof')
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      toast.error('Please select an image file first.')
      return
    }
    const formData = new FormData()
    formData.append('proof', selectedFile)
    mutation.mutate(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-brand-card border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Win Proof</DialogTitle>
          <DialogDescription className="text-gray-400">
            Please upload a screenshot of your golf app showing the matching numbers to claim your prize.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="proof">Screenshot</Label>
            <Input 
              id="proof" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="bg-white/5 border-white/10 text-white file:text-white file:bg-white/10 cursor-pointer" 
            />
            {selectedFile && <p className="text-xs text-brand-green">Selected: {selectedFile.name}</p>}
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending || !selectedFile} className="bg-brand-green text-black hover:bg-brand-green/90">
              {mutation.isPending ? 'Uploading...' : 'Submit Proof'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
