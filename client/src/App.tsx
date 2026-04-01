// @ts-nocheck
import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import AdminRoute from '@/components/shared/AdminRoute'

const lazyWithRetry = (factory: any) =>
  lazy(async () => {
    try {
      const module = await factory()
      // Success — clear the reload flag so future deploys can retry
      sessionStorage.removeItem('chunk_reload')
      return module
    } catch (err: any) {
      const msg = String(err?.message || err)
      const isChunkLoadError =
        msg.includes('dynamically imported module') ||
        msg.includes('Importing a module script failed') ||
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('error loading dynamically imported module')

      // After a Vercel redeploy, chunk filenames change.
      // Force-reload the page with a cache-busted URL so the browser
      // fetches the latest index.html and its new chunk manifest.
      if (isChunkLoadError) {
        const alreadyReloaded = sessionStorage.getItem('chunk_reload') === '1'
        if (!alreadyReloaded) {
          sessionStorage.setItem('chunk_reload', '1')
          // Add ?v= timestamp to bust CDN/browser cache
          window.location.replace(`${window.location.href.split('?')[0]}?v=${Date.now()}`)
          // Return a dummy module to prevent throw during redirect
          return { default: () => null }
        }
      }
      throw err
    }
  })

// Lazy loaded pages
const HomePage = lazyWithRetry(() => import('@/pages/HomePage'))
const LoginPage = lazyWithRetry(() => import('@/pages/LoginPage'))
const RegisterPage = lazyWithRetry(() => import('@/pages/RegisterPage'))
const CharitiesPage = lazyWithRetry(() => import('@/pages/CharitiesPage'))
const DrawsPage = lazyWithRetry(() => import('@/pages/DrawsPage'))
const NotFoundPage = lazyWithRetry(() => import('@/pages/NotFoundPage'))

// Dashboard
const DashboardLayout = lazyWithRetry(() => import('@/pages/dashboard/DashboardLayout'))
const DashboardOverview = lazyWithRetry(() => import('@/pages/dashboard/DashboardOverview'))
const ScoresPage = lazyWithRetry(() => import('@/pages/dashboard/ScoresPage'))
const CharitySettingsPage = lazyWithRetry(() => import('@/pages/dashboard/CharitySettingsPage'))
const WinningsPage = lazyWithRetry(() => import('@/pages/dashboard/WinningsPage'))
const SettingsPage = lazyWithRetry(() => import('@/pages/dashboard/SettingsPage'))

// Admin
const AdminLayout = lazyWithRetry(() => import('@/pages/admin/AdminLayout'))
const AdminDashboard = lazyWithRetry(() => import('@/pages/admin/AdminDashboard'))
const AdminUsers = lazyWithRetry(() => import('@/pages/admin/AdminUsersPage'))
const AdminDraws = lazyWithRetry(() => import('@/pages/admin/AdminDrawsPage'))
const AdminCharities = lazyWithRetry(() => import('@/pages/admin/AdminCharitiesPage'))
const AdminWinners = lazyWithRetry(() => import('@/pages/admin/AdminWinnersPage'))

const SuspenseFallback = () => (
  <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center">
    <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
    <p className="text-brand-green mt-4 font-medium animate-pulse">Loading GolfCares...</p>
  </div>
)

export default function App() {
  const location = useLocation()
  const showFooter = ['/', '/charities', '/draws', '/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-white">
      <Navbar />
      <main className="flex-1 pt-16 flex flex-col">
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/charities" element={<CharitiesPage />} />
            <Route path="/draws" element={<DrawsPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="scores" element={<ScoresPage />} />
                <Route path="charity" element={<CharitySettingsPage />} />
                <Route path="winnings" element={<WinningsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

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
