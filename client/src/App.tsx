// @ts-nocheck
import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import AdminRoute from '@/components/shared/AdminRoute'

// Lazy loaded pages
const HomePage = lazy(() => import('@/pages/HomePage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const CharitiesPage = lazy(() => import('@/pages/CharitiesPage'))
const DrawsPage = lazy(() => import('@/pages/DrawsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Dashboard layout and pages
const DashboardLayout = lazy(() => import('@/pages/dashboard/DashboardLayout'))
const DashboardOverview = lazy(() => import('@/pages/dashboard/DashboardOverview'))
const ScoresPage = lazy(() => import('@/pages/dashboard/ScoresPage'))
const CharitySettingsPage = lazy(() => import('@/pages/dashboard/CharitySettingsPage'))
const WinningsPage = lazy(() => import('@/pages/dashboard/WinningsPage'))
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage'))

// Admin layout and pages
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsersPage'))
const AdminDraws = lazy(() => import('@/pages/admin/AdminDrawsPage'))
const AdminCharities = lazy(() => import('@/pages/admin/AdminCharitiesPage'))
const AdminWinners = lazy(() => import('@/pages/admin/AdminWinnersPage'))

const SuspenseFallback = () => (
  <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center pt-24">
    <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
    <p className="text-brand-green mt-4 font-medium animate-pulse">Loading GolfCares...</p>
  </div>
)

export default function App() {
  const location = useLocation()
  const { enableMockMode, logout } = useAuthStore()
  
  const showFooter = ['/', '/charities', '/draws', '/login', '/register'].includes(location.pathname)
  const isDevMode = (import.meta as any).env.DEV === true

  return (
    <div className={`min-h-screen flex flex-col bg-brand-dark text-white ${isDevMode ? 'pt-8' : ''}`}>
      {isDevMode && (
        <div className="fixed top-0 left-0 w-full z-[100] bg-brand-accent/90 backdrop-blur border-b border-brand-accent text-white text-xs py-1.5 px-4 flex justify-between items-center shadow-lg">
          <span className="font-bold flex items-center gap-2">
            <span>🔧</span> Dev Mode — Mock Data Active
          </span>
          <div className="flex gap-2">
            <button onClick={enableMockMode} className="bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded font-medium transition-colors">
              Enable Mock Auth
            </button>
            <button onClick={logout} className="bg-red-500/20 hover:bg-red-500/40 text-red-100 px-2 py-0.5 rounded font-medium transition-colors">
              Logout Mock
            </button>
          </div>
        </div>
      )}

      <Navbar />
      
      <main className="flex-1 pt-16 flex flex-col">
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/charities" element={<CharitiesPage />} />
            <Route path="/draws" element={<DrawsPage />} />

            {/* User Dashboard */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="scores" element={<ScoresPage />} />
                <Route path="charity" element={<CharitySettingsPage />} />
                <Route path="winnings" element={<WinningsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Admin Panel */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="draws" element={<AdminDraws />} />
                <Route path="charities" element={<AdminCharities />} />
                <Route path="winners" element={<AdminWinners />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {showFooter && <Footer />}
    </div>
  )
}
