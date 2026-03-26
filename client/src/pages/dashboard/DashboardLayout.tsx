// @ts-nocheck
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Target, Heart, Trophy, Settings, CreditCard, LogOut, Menu } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { subscriptionApi } from '@/api/subscription.api'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { toast } from 'react-hot-toast'

export default function DashboardLayout() {
  const { user, logout, useMockData } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const links = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Target, label: 'My Scores', path: '/dashboard/scores' },
    { icon: Heart, label: 'My Charity', path: '/dashboard/charity' },
    { icon: Trophy, label: 'Winnings', path: '/dashboard/winnings' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handlePortal = async () => {
    if (useMockData) {
      toast.success('Mock: Redirecting to Stripe Portal')
      return
    }
    try {
      const res = await subscriptionApi.createPortalSession()
      window.location.href = res.url
    } catch (error) {
      toast.error('Failed to open billing portal')
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-brand-dark w-full">
      {/* SIDEBAR (Desktop) */}
      <div className="hidden md:flex w-64 bg-brand-card border-r border-white/5 flex-col z-20">
        <div className="p-6">
          <Link to="/">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center">
                <Trophy className="w-4 h-4 text-black" />
              </div>
              <span className="font-black text-lg text-white">
                Golf<span className="text-brand-green">Cares</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="mx-4 mb-4 bg-brand-muted rounded-xl p-3 flex items-center gap-3 border border-white/5">
          <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center font-bold text-black border-2 border-brand-card">
            {user?.firstName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        <div className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {links.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-brand-green/10 text-brand-green' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="p-4 space-y-2 border-t border-white/5 mt-auto">
          <button 
            onClick={handlePortal}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <CreditCard className="w-4 h-4" /> Manage Subscription
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </div>

      {/* MOBILE TOP BAR (For sheet menu context in mobile if needed, but per instructions bottom bar is used) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-brand-card/90 backdrop-blur-md border-b border-white/5 z-30 flex items-center justify-between px-4">
        <Link to="/">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-green" />
            <span className="font-black text-white">Golf<span className="text-brand-green">Cares</span></span>
          </div>
        </Link>
        <Sheet>
          <SheetTrigger className="p-2 text-white"><Menu /></SheetTrigger>
          <SheetContent side="right" className="bg-brand-dark border-l border-white/10 p-0 flex flex-col w-72">
            <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-brand-card">
              <div className="w-12 h-12 rounded-full bg-brand-green flex items-center justify-center font-bold text-black text-lg">
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-base font-bold text-white truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <button onClick={handlePortal} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 bg-white/5">
                <CreditCard className="w-4 h-4" /> Manage Subscription
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full overflow-y-auto bg-brand-dark pt-16 md:pt-0 pb-20 md:pb-0 relative flex flex-col custom-scrollbar">
        <div className="p-6 md:p-8 lg:p-10 max-w-6xl mx-auto w-full flex-1">
          <Outlet />
        </div>
      </div>

      {/* MOBILE BOTTOM TAB BAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-brand-card/95 backdrop-blur-xl border-t border-white/5 z-30 flex items-center justify-around px-2 pb-safe pt-2">
        {links.map((link) => {
          const isActive = location.pathname === link.path
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors
                ${isActive ? 'text-brand-green' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
