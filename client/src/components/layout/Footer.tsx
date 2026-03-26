// @ts-nocheck
import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-card border-t border-white/5 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-black" />
                </div>
                <span className="font-black text-xl text-white">
                  Golf<span className="text-brand-green">Cares</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs">Play with purpose. Give with every stroke.</p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-brand-green text-sm transition-colors">Home</Link></li>
              <li><Link to="/#how-it-works" className="text-gray-400 hover:text-brand-green text-sm transition-colors">How It Works</Link></li>
              <li><Link to="/charities" className="text-gray-400 hover:text-brand-green text-sm transition-colors">Charities</Link></li>
              <li><Link to="/draws" className="text-gray-400 hover:text-brand-green text-sm transition-colors">Draws</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-gray-400 hover:text-brand-green text-sm transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-brand-green text-sm transition-colors">Register</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-brand-green text-sm transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <p className="text-gray-400 text-sm">Digital Heroes · digitalheroes.co.in</p>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">© 2026 GolfCares. Built with purpose. All rights reserved.</p>
          <p className="text-brand-green text-xs font-medium bg-brand-green/10 px-3 py-1 rounded-full">Support the causes that matter.</p>
        </div>
      </div>
    </footer>
  )
}
