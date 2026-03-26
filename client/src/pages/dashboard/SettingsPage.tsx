// @ts-nocheck
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, User, Key, Shield } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/authStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Minimum 6 characters required'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function SettingsPage() {
  const { user, updateUser, useMockData } = useAuthStore()
  
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    }
  })

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm({
    resolver: zodResolver(passwordSchema)
  })

  const onProfileSubmit = async (data: any) => {
    try {
      setIsSavingProfile(true)
      if (useMockData) {
        toast.success('Mock: Profile updated')
        updateUser(data)
        return
      }
      
      const res = await authApi.updateUser(data)
      updateUser(res.user)
      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const onPasswordSubmit = async (data: any) => {
    try {
      setIsSavingPassword(true)
      if (useMockData) {
        toast.success('Mock: Password updated')
        resetPassword()
        return
      }

      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      })
      toast.success('Password changed successfully')
      resetPassword()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white">Account Settings</h1>
        <p className="text-gray-400 mt-1">Manage your profile and security preferences.</p>
      </div>

      <div className="space-y-8">
        {/* Profile Settings */}
        <div className="bg-brand-card border border-white/5 rounded-2xl p-6 md:p-8 shadow-lg">
          <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2 pb-4 border-b border-white/5">
            <User className="w-5 h-5 text-brand-green" /> Profile Information
          </h3>
          
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-300">First Name</Label>
                <Input {...registerProfile('firstName')} className="mt-2 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" />
                {profileErrors.firstName && <p className="text-red-400 text-xs mt-1">{profileErrors.firstName.message as string}</p>}
              </div>
              <div>
                <Label className="text-gray-300">Last Name</Label>
                <Input {...registerProfile('lastName')} className="mt-2 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" />
                {profileErrors.lastName && <p className="text-red-400 text-xs mt-1">{profileErrors.lastName.message as string}</p>}
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300">Email Address</Label>
              <Input value={user?.email || ''} disabled className="mt-2 bg-brand-dark border-white/5 text-gray-500 cursor-not-allowed" />
              <p className="text-xs text-gray-500 mt-2">Email address cannot be changed. Contact support if needed.</p>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSavingProfile} className="bg-brand-green text-black font-bold px-8 hover:bg-brand-green/90 rounded-xl">
                {isSavingProfile ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : 'Save Profile'}
              </Button>
            </div>
          </form>
        </div>

        {/* Password Settings */}
        <div className="bg-brand-card border border-white/5 rounded-2xl p-6 md:p-8 shadow-lg">
          <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2 pb-4 border-b border-white/5">
            <Key className="w-5 h-5 text-brand-green" /> Change Password
          </h3>
          
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6 max-w-md">
            <div>
              <Label className="text-gray-300">Current Password</Label>
              <Input {...registerPassword('currentPassword')} type="password" className="mt-2 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" />
              {passwordErrors.currentPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.currentPassword.message as string}</p>}
            </div>
            
            <div>
              <Label className="text-gray-300">New Password</Label>
              <Input {...registerPassword('newPassword')} type="password" className="mt-2 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" />
              {passwordErrors.newPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.newPassword.message as string}</p>}
            </div>
            
            <div>
              <Label className="text-gray-300">Confirm New Password</Label>
              <Input {...registerPassword('confirmPassword')} type="password" className="mt-2 bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" />
              {passwordErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.confirmPassword.message as string}</p>}
            </div>
            
            <div className="pt-4">
              <Button type="submit" disabled={isSavingPassword} className="bg-white/10 text-white hover:bg-white/20 font-bold px-8 rounded-xl">
                {isSavingPassword ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-red-500 mb-1 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Danger Zone
              </h3>
              <p className="text-gray-400 text-sm max-w-md">Permanently delete your account and cancel your subscription immediately. This action is irreversible.</p>
            </div>
            <Button variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 font-bold rounded-xl whitespace-nowrap">
              Delete Account
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
