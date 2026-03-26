// @ts-nocheck
import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Trophy, Heart, Gift, ShieldAlert } from 'lucide-react'

export default function AdminLayout() {
  const location = useLocation()

  const links = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: Trophy, label: 'Draws', path: '/admin/draws' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Heart, label: 'Charities', path: '/admin/charities' },
    { icon: Gift, label: 'Winners', path: '/admin/winners' },
  ]

  return (
    <div className="flex h-screen bg-brand-dark w-full overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-64 bg-brand-card border-r border-white/5 flex-col z-20 hidden md:flex">
        <div className="p-6">
          <Link to="/">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <ShieldAlert className="w-4 h-4 text-red-400" />
              </div>
              <span className="font-black text-lg text-white">
                Admin<span className="text-red-400">Panel</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-brand-card border-b border-white/5 z-30 flex items-center px-4 overflow-x-auto gap-2 hide-scrollbar">
        <Link to="/admin" className="mr-4 shrink-0 flex items-center gap-1.5 font-bold text-white">
          <ShieldAlert className="w-5 h-5 text-red-500" /> Admin
        </Link>
        {links.map((link) => {
          const isActive = location.pathname === link.path
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap
                ${isActive ? 'bg-red-500/20 text-red-400' : 'text-gray-400 bg-white/5'}`}
            >
              <link.icon className="w-3.5 h-3.5" /> {link.label}
            </Link>
          )
        })}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto w-full pt-16 md:pt-0 pb-safe custom-scrollbar">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
