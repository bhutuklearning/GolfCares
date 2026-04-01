import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ImageIcon, Loader2 } from 'lucide-react'
import { winnerApi } from '@/api/winner.api'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

// ─── Client-side image compression via Canvas API (no extra dependency) ─────
// Resizes and re-encodes to JPEG at 85% quality before upload.
// A typical 4MB phone screenshot compresses to ~200-400KB — 10x faster upload.
const compressImage = (file: File, maxWidth = 1920, quality = 0.85): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Only compress images (not PDFs, etc.)
    if (!file.type.startsWith('image/')) {
      resolve(file)
      return
    }
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      // Calculate scaled dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(file); return }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return }
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now()
          })
          resolve(compressed)
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')) }
    img.src = url
  })
}

// ─── Format bytes as a human-readable string (e.g. "1.2 MB") ───────────────
const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

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
  const [preview, setPreview] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
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
      setPreview(null)
      onClose()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to upload proof')
    }
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsCompressing(true)
    try {
      const compressed = await compressImage(file)
      setSelectedFile(compressed)

      // Generate a thumbnail preview
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target?.result as string)
      reader.readAsDataURL(compressed)
    } catch {
      // Fall back to original file if compression fails
      setSelectedFile(file)
    } finally {
      setIsCompressing(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreview(null)
    onClose()
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-brand-card border-white/10 text-white sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Upload Win Proof</DialogTitle>
          <DialogDescription className="text-gray-400">
            Upload a screenshot of your golf app showing your matching scores to claim your prize.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 mt-2">
          {/* Drop zone */}
          <div className="space-y-2">
            <Label htmlFor="proof">Screenshot</Label>
            <label
              htmlFor="proof"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-brand-green/60 hover:bg-brand-green/5 transition-all group"
            >
              {isCompressing ? (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Loader2 className="w-7 h-7 animate-spin text-brand-green" />
                  <span className="text-xs">Optimising image...</span>
                </div>
              ) : preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-xl p-1" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-gray-300 transition-colors">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-sm font-medium">Click to select image</span>
                  <span className="text-xs">JPG, PNG, WEBP — max 8 MB</span>
                </div>
              )}
              <input
                id="proof"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
                disabled={isCompressing || mutation.isPending}
              />
            </label>

            {/* File info */}
            {selectedFile && !isCompressing && (
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-brand-green truncate max-w-[240px]">{selectedFile.name}</span>
                <span className="text-gray-500 shrink-0 ml-2">{formatBytes(selectedFile.size)}</span>
              </div>
            )}
          </div>

          {/* Upload progress indicator */}
          {mutation.isPending && (
            <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-brand-green shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-white font-medium">Uploading to Cloudinary...</p>
                <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-green rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={mutation.isPending}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || isCompressing || !selectedFile}
              className="bg-brand-green text-black hover:bg-brand-green/90 min-w-[130px]"
            >
              {mutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
              ) : isCompressing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Optimising...</>
              ) : (
                'Submit Proof'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
