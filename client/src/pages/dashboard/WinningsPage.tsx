// @ts-nocheck
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Trophy, UploadCloud, CheckCircle2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { winnerApi } from '@/api/winner.api'
import { useAuthStore } from '@/store/authStore'
import { mockWinnings } from '@/mocks/mockData'
import { getMonthName, formatCurrency, getStatusColor } from '@/utils/helpers'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function WinningsPage() {
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const queryClient = useQueryClient()
  const { useMockData } = useAuthStore()

  const { data, isLoading } = useQuery<any>({ queryKey: ['myWinnings'], queryFn: () => winnerApi.getMyWinnings(),  enabled: !useMockData  })
  const winnings = useMockData ? mockWinnings : data?.winnings || []

  const totalWon = winnings.reduce((sum: number, w: any) => sum + w.prizeAmount, 0)
  const pendingCount = winnings.filter((w: any) => w.paymentStatus === 'pending').length
  const paidWon = winnings.filter((w: any) => w.paymentStatus === 'paid').reduce((sum: number, w: any) => sum + w.prizeAmount, 0)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        setSelectedFile(file)
        setPreviewImage(URL.createObjectURL(file))
      }
    }
  })

  // Close + Reset Dropzone state
  const handleCloseDialog = () => {
    setUploadingFor(null)
    setPreviewImage(null)
    setSelectedFile(null)
  }

  const handleUploadProof = async () => {
    if (!uploadingFor || !selectedFile) {
      toast.error('Please select an image first')
      return
    }

    try {
      setIsSubmitting(true)
      if (useMockData) {
        toast.success('Mock: Proof uploaded successfully')
        handleCloseDialog()
        return
      }

      const formData = new FormData()
      formData.append('proofImage', selectedFile)
      
      await winnerApi.uploadProof(uploadingFor, formData)
      toast.success('Proof of score submitted successfully!')
      queryClient.invalidateQueries({ queryKey: ['myWinnings'] })
      handleCloseDialog()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload proof')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">My Winnings</h1>
        <p className="text-gray-400 mt-1">Track your prizes and submit score proofs</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-brand-card to-brand-card/50 border border-brand-gold/20 rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] opacity-10"><Trophy className="w-32 h-32 text-brand-gold" /></div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Total Won</p>
          <p className="text-4xl font-black text-brand-gold">{formatCurrency(totalWon)}</p>
        </div>
        <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Pending Claim</p>
          <p className="text-4xl font-black text-white">{pendingCount} <span className="text-lg font-normal text-gray-500">Draws</span></p>
        </div>
        <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-lg">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Paid Out</p>
          <p className="text-4xl font-black text-brand-green">{formatCurrency(paidWon)}</p>
        </div>
      </div>

      {/* Winnings Table */}
      <div className="bg-brand-card border border-white/5 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
                <th className="p-5">Draw</th>
                <th className="p-5">Match</th>
                <th className="p-5">Prize</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right flex-1">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({length: 3}).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="p-5"><div className="h-10 bg-white/5 rounded-lg animate-pulse w-full"></div></td></tr>
                ))
              ) : winnings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-gray-500">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium text-white mb-1">No winnings just yet</p>
                    <p className="text-sm border-0">Participate in the monthly draw by entering your 5 scores.</p>
                  </td>
                </tr>
              ) : (
                winnings.map((w: any) => (
                  <tr key={w._id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5 font-bold text-white">
                      {w.drawId ? `${getMonthName(w.drawId.month)} ${w.drawId.year}` : 'Unknown Draw'}
                    </td>
                    <td className="p-5">
                      <span className="text-xs font-bold uppercase tracking-wider bg-brand-accent/10 text-brand-accent px-3 py-1.5 rounded-full border border-brand-accent/20">
                        {w.matchType}
                      </span>
                    </td>
                    <td className="p-5 font-black text-brand-gold text-lg">
                      {formatCurrency(w.prizeAmount)}
                    </td>
                    <td className="p-5">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${getStatusColor(w.paymentStatus)}`}>
                        {w.paymentStatus}
                      </span>
                    </td>
                    <td className="p-5 text-right w-[150px]">
                      {w.paymentStatus === 'pending' && !w.proofImageUrl ? (
                        <button 
                          onClick={() => setUploadingFor(w._id)} 
                          className="text-xs bg-brand-green text-black px-4 py-2 rounded-lg font-bold hover:bg-brand-green/90 transition-all shadow-lg shadow-brand-green/20"
                        >
                          Upload Proof
                        </button>
                      ) : w.proofImageUrl ? (
                        <div className="flex justify-end">
                           <span className="text-xs flex items-center gap-1.5 text-brand-green bg-brand-green/10 px-3 py-1.5 rounded-lg border border-brand-green/20 font-medium">
                             <CheckCircle2 className="w-3.5 h-3.5" /> Proof Sent
                           </span>
                        </div>
                      ) : (
                         <span className="text-gray-500 text-xs">Processing</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Proof Dialog */}
      <Dialog open={uploadingFor !== null} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="bg-brand-card border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Upload Score Proof</DialogTitle>
          </DialogHeader>
          <div className="pt-4 space-y-6">
            <p className="text-sm text-gray-400">
              Please upload a screenshot from your verified handicap app showing your scores for this qualifying month.
            </p>

            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[200px]
                ${isDragActive ? 'border-brand-green bg-brand-green/5' : 'border-white/20 hover:border-brand-green/50 hover:bg-white/5'}`}
            >
              <input {...getInputProps()} />
              
              {previewImage ? (
                <div className="relative w-full">
                  <img src={previewImage} alt="Preview" className="max-h-48 mx-auto object-contain rounded-lg shadow-lg" />
                  <p className="text-xs text-brand-green mt-4 font-medium">Click or drag to replace</p>
                </div>
              ) : (
                <>
                  <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${isDragActive ? 'text-brand-green' : 'text-gray-500 mx-auto'}`} />
                  <p className="font-bold text-white mb-1">Drop your screenshot here</p>
                  <p className="text-xs text-gray-500">or click to browse from your device</p>
                  <p className="text-[10px] text-gray-600 mt-4 uppercase tracking-widest font-bold">JPG, PNG, WEBP UP TO 5MB</p>
                </>
              )}
            </div>

            <Button 
              onClick={handleUploadProof} 
              disabled={!selectedFile || isSubmitting}
              className="w-full bg-brand-green text-black font-bold h-12 rounded-xl hover:bg-brand-green/90 shadow-lg shadow-brand-green/20 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Submit Proof →'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
