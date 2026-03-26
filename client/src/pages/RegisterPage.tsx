// @ts-nocheck
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Check, Loader2, Heart, Lock } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/api/auth.api'
import { charityApi } from '@/api/charity.api'
import { useAuthStore } from '@/store/authStore'
import { mockCharities } from '@/mocks/mockData'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const step1Schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Minimum 6 characters required'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type Step1Values = z.infer<typeof step1Schema>

export default function RegisterPage() {
  const location = useLocation()
  const { useMockData } = useAuthStore()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [step1Data, setStep1Data] = useState<any>(null)
  
  // Try to set charityId from router state if coming from Featured Charities
  const initialCharityId = location.state?.charityId || null
  const [selectedCharity, setSelectedCharity] = useState<string | null>(initialCharityId)
  
  const [contributionPct, setContributionPct] = useState(15)
  const [selectedPlan, setSelectedPlan] = useState<'monthly'|'yearly'>('monthly')
  const [isLoading, setIsLoading] = useState(false)

  const { data: charitiesData, isLoading: isLoadingCharities } = useQuery({ queryKey: ['charities'], queryFn: () => charityApi.getCharities(),  enabled: !useMockData && currentStep === 2  })
  const charities = useMockData ? mockCharities : charitiesData?.charities || []

  const { register, handleSubmit, formState: { errors } } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema)
  })

  const onStep1Submit = (data: Step1Values) => {
    setStep1Data(data)
    setCurrentStep(2)
  }

  const handleFinalSubmit = async () => {
    if (!selectedCharity) {
      toast.error('Please select a charity to support')
      return
    }
    
    try {
      setIsLoading(true)
      const payload = {
        ...step1Data,
        charityId: selectedCharity,
        charityContributionPercent: contributionPct,
        plan: selectedPlan
      }
      
      // In a real app, this returns a Stripe checkout URL
      // Since this is mock/test, simulate the redirect
      if (useMockData) {
        // Simulate fake successful registration
        setTimeout(() => {
          toast.success('Registration mock successful!')
          window.location.href = '/login'
        }, 1500)
      } else {
        const res = await authApi.register(payload)
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl
        } else {
          // fallback if no URL returned
          toast.success('Registration successful')
          window.location.href = '/login'
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed')
      setIsLoading(false)
    }
  }

  // Floating background numbers
  const floatingNumbers = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    num: Math.floor(Math.random() * 45) + 1,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: Math.random() * 5 + 5,
    delay: Math.random() * 2,
  }))

  const variants = {
    enter: { x: 100, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 }
  }

  const monthlyPrice = 9.99
  const yearlyPrice = 95.99

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center py-12 px-4 relative overflow-x-hidden">
      {/* Background orbs */}
      <div className="fixed top-[-100px] right-[-100px] w-[400px] h-[400px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-brand-accent/15 rounded-full blur-[100px] pointer-events-none" />
      
      {floatingNumbers.map((fn) => (
        <motion.div
          key={fn.id}
          initial={{ y: -20 }}
          animate={{ y: 20 }}
          transition={{ duration: fn.duration, delay: fn.delay, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="fixed text-white/[0.02] text-5xl font-black pointer-events-none select-none z-0"
          style={{ top: fn.top, left: fn.left }}
        >
          {fn.num}
        </motion.div>
      ))}

      <Link to="/" className="relative z-10 mb-8 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center">
            <Trophy className="w-4 h-4 text-black" />
          </div>
          <span className="font-black text-xl text-white">
            Golf<span className="text-brand-green">Cares</span>
          </span>
        </div>
      </Link>

      {/* STEP INDICATOR */}
      <div className="relative z-10 w-full max-w-md mx-auto mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 z-0 flex">
            <div className={`h-full flex-1 transition-colors duration-500 ${currentStep > 1 ? 'bg-brand-green' : 'bg-white/10'}`}></div>
            <div className={`h-full flex-1 transition-colors duration-500 ${currentStep > 2 ? 'bg-brand-green' : 'bg-white/10'}`}></div>
          </div>
          
          {[1, 2, 3].map((step) => {
            const isCompleted = step < currentStep
            const isActive = step === currentStep
            return (
              <div 
                key={step} 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm relative z-10 transition-colors duration-300
                  ${isActive ? 'bg-brand-green text-black' : 
                    isCompleted ? 'bg-brand-green/20 text-brand-green border-2 border-brand-green' : 
                    'bg-brand-muted text-gray-400 border border-white/10'}`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step}
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-3 text-xs text-gray-400 px-1">
          <span className={currentStep >= 1 ? 'text-white font-medium' : ''}>Details</span>
          <span className={currentStep >= 2 ? 'text-white font-medium' : ''}>Cause</span>
          <span className={currentStep >= 3 ? 'text-white font-medium' : ''}>Plan</span>
        </div>
      </div>

      <div className={`w-full relative z-10 ${currentStep === 2 ? 'max-w-3xl' : 'max-w-md'}`}>
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-brand-card border border-white/5 rounded-2xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-center text-white">Your Details</h2>
              <p className="text-gray-400 text-center text-sm mt-1 mb-8">Let's get your account set up</p>
              
              <form onSubmit={handleSubmit(onStep1Submit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-300">First Name</Label>
                    <Input {...register('firstName')} placeholder="John" className="bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" />
                    {errors.firstName && <p className="text-red-400 text-xs">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-300">Last Name</Label>
                    <Input {...register('lastName')} placeholder="Doe" className="bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" />
                    {errors.lastName && <p className="text-red-400 text-xs">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-gray-300">Email Address</Label>
                  <Input {...register('email')} type="email" placeholder="you@example.com" className="bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" />
                  {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-300">Password</Label>
                    <Input {...register('password')} type="password" placeholder="••••••••" className="bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" />
                    {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-300">Confirm Password</Label>
                    <Input {...register('confirmPassword')} type="password" placeholder="••••••••" className="bg-brand-muted border-white/10 text-white focus-visible:ring-brand-green" />
                    {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-brand-green text-black hover:bg-brand-green/90 font-bold h-12 rounded-xl mt-6 shadow-lg shadow-brand-green/20">
                  Continue →
                </Button>
              </form>
              
              <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account? <Link to="/login" className="text-brand-green hover:underline">Log in</Link>
              </p>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-brand-card border border-white/5 rounded-2xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-center text-white">Choose Your Cause</h2>
              <p className="text-gray-400 text-center text-sm mt-1 mb-8">Select the charity you'd like to support</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {isLoadingCharities ? (
                  Array.from({length: 3}).map((_, i) => (
                    <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse"></div>
                  ))
                ) : (
                  charities.map((charity: any) => {
                    const isSelected = selectedCharity === charity._id
                    return (
                      <div 
                        key={charity._id}
                        onClick={() => setSelectedCharity(charity._id)}
                        className={`cursor-pointer rounded-xl overflow-hidden relative transition-all border
                          ${isSelected ? 'border-brand-green ring-2 ring-brand-green/50 shadow-lg shadow-brand-green/20 bg-brand-green/5' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-brand-green rounded-full flex items-center justify-center z-10 shadow-md">
                            <Check className="w-3 h-3 text-black font-bold" />
                          </div>
                        )}
                        <div className="aspect-video w-full bg-brand-muted relative">
                          {charity.imageUrl ? (
                            <img src={charity.imageUrl} alt={charity.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Heart className="text-brand-green/30 w-8 h-8" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="font-bold text-white text-sm truncate">{charity.name}</p>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-400 line-clamp-2">{charity.description}</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="mt-8 bg-[#0a0f1e] p-6 rounded-xl border border-white/5">
                <Label className="text-white font-medium text-base mb-4 block">Your Monthly Donation</Label>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 font-medium w-10 text-right">10%</span>
                  <input 
                    type="range" 
                    min="10" 
                    max="50" 
                    step="5" 
                    value={contributionPct}
                    onChange={(e) => setContributionPct(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-green" 
                  />
                  <span className="text-white font-bold w-10">50%</span>
                </div>
                
                <div className="flex justify-between items-center mt-6 bg-brand-green/10 border border-brand-green/20 p-4 rounded-lg">
                  <div>
                    <span className="text-brand-green font-black text-2xl">{contributionPct}%</span>
                    <span className="text-gray-400 text-sm ml-2">goes to charity</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Estimated impact</span>
                    <span className="text-white font-bold text-xl">
                      £{(selectedPlan === 'yearly' ? (yearlyPrice * contributionPct / 100 / 12) : (monthlyPrice * contributionPct / 100)).toFixed(2)}
                      <span className="text-sm font-normal text-gray-400">/mo</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setCurrentStep(1)}
                  className="w-1/3 text-white hover:bg-white/5"
                >
                  ← Back
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    if (!selectedCharity) toast.error('Please select a charity')
                    else setCurrentStep(3)
                  }}
                  className="w-2/3 bg-brand-green text-black hover:bg-brand-green/90 font-bold h-12 rounded-xl shadow-lg shadow-brand-green/20"
                >
                  Continue →
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-brand-card border border-white/5 rounded-2xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-center text-white">Choose Your Plan</h2>
              <p className="text-gray-400 text-center text-sm mt-1 mb-8">Select how you want to subscribe</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Monthly */}
                <div 
                  onClick={() => setSelectedPlan('monthly')}
                  className={`relative p-6 rounded-2xl border cursor-pointer transition-all flex flex-col h-full
                    ${selectedPlan === 'monthly' ? 'border-brand-green ring-2 ring-brand-green/30 bg-brand-green/5' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                >
                  {selectedPlan === 'monthly' && (
                    <div className="absolute top-4 right-4 text-brand-green">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-white">Monthly</h3>
                  <div className="text-4xl font-black text-brand-green mt-2 mb-6">
                    £9.99<span className="text-base font-normal text-gray-400">/mo</span>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    {['Full platform access', 'Monthly prize draw entry', 'Charity contribution', 'Score tracking'].map((ft, i) => (
                      <div key={i} className="flex gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                        <span>{ft}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Yearly */}
                <div 
                  onClick={() => setSelectedPlan('yearly')}
                  className={`relative p-6 rounded-2xl border cursor-pointer transition-all flex flex-col h-full
                    ${selectedPlan === 'yearly' ? 'border-brand-green ring-2 ring-brand-green/30 shadow-lg shadow-brand-green/20 bg-brand-green/5' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                >
                  <div className="absolute top-[-10px] right-4 bg-brand-gold text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                    BEST VALUE
                  </div>
                  {selectedPlan === 'yearly' && (
                    <div className="absolute top-4 right-4 text-brand-green">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  
                  <h3 className="text-lg font-bold text-white">Yearly</h3>
                  <div className="text-4xl font-black text-brand-green mt-2">
                    £95.99<span className="text-base font-normal text-gray-400">/yr</span>
                  </div>
                  <p className="text-brand-gold text-sm font-bold mb-6 mt-1">Save 20% (2 months free)</p>
                  
                  <div className="space-y-3 flex-1">
                    {['Full platform access', 'Monthly prize draw entry', 'Charity contribution', 'Score tracking'].map((ft, i) => (
                      <div key={i} className="flex gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                        <span>{ft}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setCurrentStep(2)}
                  className="w-1/3 text-white hover:bg-white/5"
                  disabled={isLoading}
                >
                  ← Back
                </Button>
                <Button 
                  type="button" 
                  onClick={handleFinalSubmit}
                  disabled={isLoading}
                  className="w-2/3 bg-brand-green text-black hover:bg-brand-green/90 font-bold h-12 rounded-xl shadow-lg shadow-brand-green/20"
                >
                  {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Subscribe & Pay →'}
                </Button>
              </div>
              <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Secure checkout via Stripe
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
