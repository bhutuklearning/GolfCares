import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Trash, Plus } from 'lucide-react'
import { adminApi } from '@/api/admin.api'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  events: z.array(z.object({
    title: z.string().min(1, 'Event title is required'),
    date: z.string().min(1, 'Date is required'),
    description: z.string().optional(),
    location: z.string().optional()
  })).optional()
})

export default function CharityFormModal({
  isOpen,
  onClose,
  initialData
}: {
  isOpen: boolean
  onClose: () => void
  initialData?: any
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const queryClient = useQueryClient()
  const isEditing = !!initialData

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', website: '', events: [] }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'events'
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Format dates correctly for input type="date"
        const formattedEvents = (initialData.events || []).map((ev: any) => ({
          ...ev,
          date: ev.date ? new Date(ev.date).toISOString().split('T')[0] : ''
        }))
        reset({
          name: initialData.name || '',
          description: initialData.description || '',
          website: initialData.website || '',
          events: formattedEvents
        })
      } else {
        reset({ name: '', description: '', website: '', events: [] })
      }
      setSelectedFile(null)
    }
  }, [isOpen, initialData, reset])

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (isEditing) {
        return adminApi.updateCharity(initialData._id, formData)
      }
      return adminApi.createCharity(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCharities'] })
      queryClient.invalidateQueries({ queryKey: ['charities'] })
      toast.success(isEditing ? 'Charity updated successfully!' : 'Charity created successfully!')
      onClose()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} charity`)
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const onSubmit = (data: any) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description)
    if (data.website) formData.append('website', data.website)
    
    // Add events array as JSON string
    if (data.events && data.events.length > 0) {
      formData.append('events', JSON.stringify(data.events))
    } else {
      formData.append('events', JSON.stringify([]))
    }
    
    if (!isEditing) {
      formData.append('isFeatured', 'false') 
    }

    if (selectedFile) {
      formData.append('image', selectedFile)
    } else if (!isEditing) {
      toast.error('Please select an image for the charity.')
      return
    }

    mutation.mutate(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-brand-card border-white/10 text-white sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Charity' : 'Add New Charity'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Charity Name</Label>
            <Input id="name" {...register('name')} className="bg-white/5 border-white/10 text-white" />
            {errors.name && <p className="text-red-400 text-xs">{errors.name.message?.toString()}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} className="bg-white/5 border-white/10 text-white" />
            {errors.description && <p className="text-red-400 text-xs">{errors.description.message?.toString()}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website URL (Optional)</Label>
            <Input id="website" {...register('website')} placeholder="https://" className="bg-white/5 border-white/10 text-white" />
            {errors.website && <p className="text-red-400 text-xs">{errors.website.message?.toString()}</p>}
          </div>

          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex justify-between items-center">
              <Label>Events</Label>
              <Button 
                type="button" 
                variant="outline" 
                className="h-7 px-2 text-xs border-brand-green text-brand-green hover:bg-brand-green/10"
                onClick={() => append({ title: '', date: '', description: '', location: '' })}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Event
              </Button>
            </div>
            {fields.length === 0 && (
               <p className="text-xs text-gray-500 italic">No events mapped to this charity yet.</p>
            )}
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="p-3 bg-black/20 rounded-lg relative border border-white/5">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1 right-1 h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-400/10" 
                    onClick={() => remove(index)}
                  >
                    <Trash className="w-3 h-3" />
                  </Button>
                  <div className="grid grid-cols-2 gap-3 pr-8 mb-3">
                    <div>
                      <Input {...register(`events.${index}.title`)} placeholder="Event Title" className="bg-white/5 border-white/10 text-xs h-8 text-white" />
                      {errors?.events?.[index]?.title && <p className="text-red-400 text-[10px] mt-1">{errors.events[index]?.title?.message?.toString()}</p>}
                    </div>
                    <div>
                      <Input type="date" {...register(`events.${index}.date`)} className="bg-white/5 border-white/10 text-xs h-8 text-white" />
                      {errors?.events?.[index]?.date && <p className="text-red-400 text-[10px] mt-1">{errors.events[index]?.date?.message?.toString()}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <Input {...register(`events.${index}.description`)} placeholder="Short Description" className="bg-white/5 border-white/10 text-xs h-8 text-white" />
                     <Input {...register(`events.${index}.location`)} placeholder="Location" className="bg-white/5 border-white/10 text-xs h-8 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-white/10">
            <Label htmlFor="image">{isEditing ? 'Update Profile Image (Optional)' : 'Profile Image / Logo'}</Label>
            <Input 
              id="image" 
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
            <Button type="submit" disabled={isSubmitting || mutation.isPending} className="bg-brand-green text-black hover:bg-brand-green/90">
              {isSubmitting || mutation.isPending ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Charity')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
