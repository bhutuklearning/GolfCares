// @ts-nocheck
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ChevronDown, MapPin, Calendar } from 'lucide-react'
import { charityApi } from '@/api/charity.api'
import { useAuthStore } from '@/store/authStore'
import { mockCharities } from '@/mocks/mockData'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

export default function CharitiesPage() {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const { useMockData } = useAuthStore()
  const { data, isLoading } = useQuery<any>({ queryKey: ['charities'], queryFn: () => charityApi.getCharities(),  enabled: !useMockData  })

  const charities = useMockData ? mockCharities : data?.charities || []
  const filtered = charities.filter((c: any) => c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
  const featuredCharities = filtered.filter((c: any) => c.isFeatured)

  return (
    <div className="min-h-screen bg-brand-dark pb-24 border-t border-transparent">
      {/* Hero */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-transparent to-brand-card/30 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-green/5 rounded-[100%] blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white"
          >
            Support a <span className="gradient-text">Cause You Believe In</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-6 text-lg max-w-xl mx-auto"
          >
            Choose where your subscription contribution goes. We ensure 10% of your fee goes directly to one of these verified organizations.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-md mx-auto mt-10"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input 
              placeholder="Search charities, causes, locations..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 bg-white/5 border-white/10 text-white h-14 rounded-2xl text-lg focus-visible:ring-brand-green" 
            />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-16">
        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({length: 6}).map((_, i) => (
              <div key={i} className="bg-brand-card rounded-2xl overflow-hidden border border-white/5">
                <Skeleton className="w-full aspect-video bg-white/5 rounded-none" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-2/3 bg-white/5" />
                  <Skeleton className="h-16 w-full bg-white/5" />
                  <Skeleton className="h-8 w-1/3 bg-white/5 mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No charities found</h3>
            <p className="text-gray-400">Try adjusting your search terms</p>
            <button onClick={() => setSearch('')} className="mt-6 text-brand-green hover:underline">Clear search</button>
          </div>
        )}

        {/* Featured Spotlight */}
        {!isLoading && featuredCharities.length > 0 && search === '' && (
          <div className="mb-16">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-brand-gold">⭐</span> Featured Spotlight
            </h2>
            <div className="bg-brand-card border border-brand-green/20 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-lg shadow-brand-green/5">
              <div className="md:w-2/5 relative">
                {featuredCharities[0].imageUrl ? (
                  <img src={featuredCharities[0].imageUrl} alt={featuredCharities[0].name} className="w-full h-full object-cover min-h-[300px]" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-accent/20 to-brand-green/20 flex items-center justify-center min-h-[300px]">
                    <Heart className="w-16 h-16 text-brand-green/50" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
                  FEATURED
                </div>
              </div>
              <div className="p-8 md:w-3/5 flex flex-col justify-center">
                <h2 className="text-3xl font-black text-white mb-4">{featuredCharities[0].name}</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">{featuredCharities[0].description}</p>
                
                {featuredCharities[0].events?.length > 0 && (
                  <div className="mb-8 bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Upcoming Event</p>
                    <div className="flex items-start gap-3">
                      <div className="bg-brand-green/20 p-2 rounded-lg mt-0.5">
                        <Calendar className="w-4 h-4 text-brand-green" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{featuredCharities[0].events[0].title}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(featuredCharities[0].events[0].date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {featuredCharities[0].events[0].location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Raised to date</p>
                    <p className="text-2xl font-black text-brand-green">₹{featuredCharities[0].totalReceived?.toLocaleString() || 0}</p>
                  </div>
                  <Link to="/register" state={{ charityId: featuredCharities[0]._id }}>
                    <button className="px-6 py-3 bg-brand-green text-black font-bold rounded-xl hover:bg-brand-green/90 transition-all shadow-lg hover:shadow-brand-green/20 hover:scale-105 active:scale-95">
                      Support Now →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charity Grid */}
        {!isLoading && filtered.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              {search ? 'Search Results' : 'All Charities'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {filtered.map((charity: any) => {
                // Skip the featured one if no search
                if (search === '' && featuredCharities.length > 0 && charity._id === featuredCharities[0]._id) return null;
                
                const isExpanded = expandedId === charity._id
                
                return (
                  <motion.div
                    key={charity._id}
                    layout
                    whileHover={{ y: -4 }}
                    className="bg-brand-card border border-white/5 rounded-2xl overflow-hidden shadow-lg group hover:border-white/20 transition-all flex flex-col"
                  >
                    <div className="relative aspect-video">
                      {charity.imageUrl ? (
                        <img src={charity.imageUrl} alt={charity.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-accent/20 to-brand-green/20 flex items-center justify-center">
                          <Heart className="w-10 h-10 text-brand-green/50" />
                        </div>
                      )}
                      {charity.isFeatured && (
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/10">
                          FEATURED
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-xl text-white mb-2 line-clamp-1">{charity.name}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">{charity.description}</p>
                      
                      {/* Events Accordion */}
                      {charity.events?.length > 0 && (
                        <div className="mt-auto mb-6">
                          <button 
                            onClick={() => setExpandedId(isExpanded ? null : charity._id)}
                            className="flex items-center justify-between w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5"
                          >
                            <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-brand-green" /> 
                              {charity.events.length} Upcoming {charity.events.length === 1 ? 'Event' : 'Events'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-3 bg-black/20 rounded-b-xl border-x border-b border-white/5 mt-[-4px] pt-4 space-y-3">
                                  {charity.events.map((e: any, i: number) => (
                                    <div key={i} className="text-sm border-l-2 border-brand-green pl-3">
                                      <p className="font-medium text-white">{e.title}</p>
                                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(e.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.location}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                      
                      {/* Spacer if no events */}
                      {!charity.events?.length && <div className="mt-auto mb-6" />}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="text-xs font-bold bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full">
                          ₹{charity.totalReceived?.toLocaleString() || 0} raised
                        </span>
                        <Link to="/register" state={{ charityId: charity._id }}>
                          <button className="text-sm font-bold text-white hover:text-brand-green flex items-center gap-1 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10">
                            Support
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
