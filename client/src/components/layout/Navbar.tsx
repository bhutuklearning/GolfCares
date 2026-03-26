// @ts-nocheck
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Trophy } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const links = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/charities', label: 'Charities' },
    { path: '/draws', label: 'Draws' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-[#0A0F1E]/85 border-b border-white/5"
    >
      <div className="flex items-center justify-between px-6 md:px-12 h-16">
        {/* Left */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center">
              <Trophy className="w-4 h-4 text-black" />
            </div>
            <span className="font-black text-lg">
              Golf<span className="text-brand-green">Cares</span>
            </span>
          </div>
        </Link>

        {/* Center */}
        <div className="hidden md:flex gap-8 relative">
          {links.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))
            return (
              <Link key={link.path} to={link.path} className="relative py-2">
                <span className={`text-sm font-medium transition-colors ${isActive ? 'text-brand-green' : 'text-gray-400 hover:text-white'}`}>
                  {link.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green rounded-full"
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login"><Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">Login</Button></Link>
              <Link to="/register"><Button size="sm" className="bg-brand-green text-black hover:bg-brand-green/90 font-bold">Subscribe</Button></Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center font-bold text-black border border-brand-green/50">
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-brand-card border-white/10 text-white w-56">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white">
                  Dashboard
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white">
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-red-500/10 hover:text-red-400 cursor-pointer focus:bg-red-500/10 focus:text-red-400">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-brand-dark border-l border-white/10 w-72 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-8 mt-4">
                <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-black" />
                </div>
                <span className="font-black text-xl text-white">
                  Golf<span className="text-brand-green">Cares</span>
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-lg font-medium py-3 border-b border-white/5 ${location.pathname === link.path ? 'text-brand-green' : 'text-gray-300'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login"><Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white">Login</Button></Link>
                    <Link to="/register"><Button className="w-full bg-brand-green text-black hover:bg-brand-green/90 font-bold">Subscribe</Button></Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard"><Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white">Dashboard</Button></Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin"><Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white">Admin Panel</Button></Link>
                    )}
                    <Button variant="ghost" onClick={handleLogout} className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-500 mt-2">Log out</Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  )
}
