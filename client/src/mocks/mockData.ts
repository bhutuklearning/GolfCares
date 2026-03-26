// @ts-nocheck
export const mockUser = {
  _id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'user@golfcares.com',
  role: 'admin',
  charityContributionPercent: 15,
  charityId: {
    _id: 'c1',
    name: 'Golf for Good',
    description: 'Supporting underprivileged youth through golf.',
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
    isFeatured: true,
  },
}

export const mockSubscription = {
  _id: 's1',
  plan: 'monthly',
  status: 'active',
  amount: 999,
  currency: 'gbp',
  currentPeriodEnd: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
  cancelAtPeriodEnd: false,
}

export const mockCharities = [
  {
    _id: 'c1',
    name: 'Golf for Good',
    description: 'Supporting underprivileged youth through golf programs across the UK.',
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
    isFeatured: true,
    totalReceived: 4250,
    events: [{ title: 'Charity Golf Day', date: '2026-05-15', location: 'St Andrews' }],
  },
  {
    _id: 'c2',
    name: 'Green Heart Foundation',
    description: 'Environmental conservation through golf course sustainability programs.',
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800',
    isFeatured: true,
    totalReceived: 3100,
    events: [{ title: 'Eco Golf Tournament', date: '2026-06-20', location: 'Wentworth, Surrey' }],
  },
  {
    _id: 'c3',
    name: 'Swing for Cancer',
    description: 'Fundraising for cancer research through the golfing community worldwide.',
    imageUrl: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800',
    isFeatured: false,
    totalReceived: 2800,
    events: [],
  },
  {
    _id: 'c4',
    name: 'Veterans on the Green',
    description: 'Using golf therapy to support military veterans with PTSD.',
    imageUrl: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=800',
    isFeatured: false,
    totalReceived: 1950,
    events: [],
  },
  {
    _id: 'c5',
    name: 'Junior Golf Academy',
    description: 'Free golf coaching and equipment for children aged 8-16 from low-income families.',
    imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800',
    isFeatured: false,
    totalReceived: 1200,
    events: [{ title: 'Junior Open Day', date: '2026-08-05', location: 'Royal Birkdale' }],
  },
]

export const mockScores = [
  { _id: 'sc1', value: 31, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: 'sc2', value: 35, date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: 'sc3', value: 25, date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: 'sc4', value: 32, date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: 'sc5', value: 28, date: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString() },
]

export const mockDraw = {
  _id: 'd1',
  month: 3,
  year: 2026,
  status: 'published',
  drawType: 'random',
  winningNumbers: [5, 18, 25, 31, 42],
  prizePool: { total: 89.91, fiveMatch: 35.96, fourMatch: 31.47, threeMatch: 22.48 },
  jackpotRollover: false,
  publishedAt: new Date().toISOString(),
}

export const mockDraws = [
  mockDraw,
  {
    _id: 'd2',
    month: 2,
    year: 2026,
    status: 'published',
    drawType: 'algorithmic',
    winningNumbers: [3, 12, 27, 38, 44],
    prizePool: { total: 74.25, fiveMatch: 0, fourMatch: 25.99, threeMatch: 18.56 },
    jackpotRollover: true,
    publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockWinnings = [
  {
    _id: 'w1',
    drawId: { _id: 'd1', month: 3, year: 2026, winningNumbers: [5, 18, 25, 31, 42] },
    matchType: '3-match',
    prizeAmount: 22.48,
    paymentStatus: 'pending',
    proofImageUrl: null,
  },
]

export const mockAdminStats = {
  totalUsers: 142,
  activeSubscribers: 118,
  totalDraws: 6,
  pendingVerifications: 3,
  totalPaidOut: 445.20,
  newUsersThisMonth: 14,
  charityLeaderboard: mockCharities.slice(0, 5),
  subscriptionBreakdown: [
    { _id: 'monthly', count: 89 },
    { _id: 'yearly', count: 29 },
  ],
}

export const mockAdminUsers = [
  {
    _id: 'u1', firstName: 'John', lastName: 'Doe', email: 'user@golfcares.com',
    isActive: true, createdAt: new Date().toISOString(),
    subscriptionId: { plan: 'monthly', status: 'active' },
    charityId: { name: 'Golf for Good' },
  },
  {
    _id: 'u2', firstName: 'Sarah', lastName: 'Smith', email: 'sarah@example.com',
    isActive: true, createdAt: new Date().toISOString(),
    subscriptionId: { plan: 'yearly', status: 'active' },
    charityId: { name: 'Swing for Cancer' },
  },
  {
    _id: 'u3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com',
    isActive: false, createdAt: new Date().toISOString(),
    subscriptionId: { plan: 'monthly', status: 'cancelled' },
    charityId: null,
  },
]

export const mockAdminWinners = [
  {
    _id: 'aw1',
    userId: { firstName: 'John', lastName: 'Doe', email: 'user@golfcares.com' },
    drawId: { month: 3, year: 2026 },
    matchType: '3-match',
    prizeAmount: 22.48,
    paymentStatus: 'pending',
    proofImageUrl: null,
  },
  {
    _id: 'aw2',
    userId: { firstName: 'Sarah', lastName: 'Smith', email: 'sarah@example.com' },
    drawId: { month: 2, year: 2026 },
    matchType: '4-match',
    prizeAmount: 25.99,
    paymentStatus: 'paid',
    proofImageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400',
  },
]
