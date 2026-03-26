import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'

import User from '../models/User.js'
import Subscription from '../models/Subscription.js'
import Score from '../models/Score.js'
import Charity from '../models/Charity.js'
import Draw from '../models/Draw.js'
import Winner from '../models/Winner.js'

const monthsAgo = (n) => {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  return d
}

const run = async () => {
  try {
    await connectDB()

    await Promise.all([
      User.deleteMany({}),
      Subscription.deleteMany({}),
      Score.deleteMany({}),
      Charity.deleteMany({}),
      Draw.deleteMany({}),
      Winner.deleteMany({})
    ])

    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'GolfCares',
      email: 'admin@golfcares.com',
      password: 'Admin@1234',
      role: 'admin',
      isActive: true
    })
    console.log('✅ Admin created: admin@golfcares.com / Admin@1234')

    const testUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@golfcares.com',
      password: 'User@1234',
      role: 'user',
      isActive: true,
      charityContributionPercent: 15
    })

    const charities = await Charity.insertMany([
      {
        name: 'Golf for Good',
        description: 'Supporting underprivileged youth through golf programs across the UK.',
        isFeatured: true,
        isActive: true,
        events: [
          {
            title: 'Charity Golf Day',
            date: new Date('2026-05-15'),
            description: 'Annual charity golf tournament',
            location: 'St Andrews, Scotland'
          }
        ]
      },
      {
        name: 'Green Heart Foundation',
        description: 'Environmental conservation through golf course sustainability programs.',
        isFeatured: true,
        isActive: true,
        events: [
          {
            title: 'Eco Golf Tournament',
            date: new Date('2026-06-20'),
            description: 'Raising funds for tree planting',
            location: 'Wentworth, Surrey'
          }
        ]
      },
      {
        name: 'Swing for Cancer',
        description: 'Fundraising for cancer research through the golfing community.',
        isFeatured: false,
        isActive: true,
        events: [
          {
            title: 'Pink Ribbon Round',
            date: new Date('2026-07-10'),
            description: 'Golf day in aid of breast cancer research',
            location: 'Augusta, Georgia'
          }
        ]
      },
      {
        name: 'Veterans on the Green',
        description:
          'Using golf therapy to support military veterans with PTSD and mental health challenges.',
        isFeatured: false,
        isActive: true,
        events: []
      },
      {
        name: 'Junior Golf Academy',
        description: 'Free golf coaching and equipment for children aged 8-16 from low-income families.',
        isFeatured: false,
        isActive: true,
        events: [
          {
            title: 'Junior Open Day',
            date: new Date('2026-08-05'),
            description: 'Free taster session for new juniors',
            location: 'Royal Birkdale, Southport'
          }
        ]
      }
    ])

    const subscription = await Subscription.create({
      userId: testUser._id,
      stripeSubscriptionId: `sub_test_seed_${Date.now()}`,
      stripeCustomerId: `cus_test_seed_${Date.now()}`,
      plan: 'monthly',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      amount: 999,
      currency: 'gbp'
    })

    testUser.subscriptionId = subscription._id
    testUser.charityId = charities[0]._id
    await testUser.save()

    const scores = [
      { value: 28, date: monthsAgo(5) },
      { value: 32, date: monthsAgo(4) },
      { value: 25, date: monthsAgo(3) },
      { value: 35, date: monthsAgo(2) },
      { value: 31, date: monthsAgo(1) }
    ].sort((a, b) => new Date(b.date) - new Date(a.date))

    await Score.create({ userId: testUser._id, scores })

    const now = new Date()
    const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth()
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()

    const lastMonthDraw = await Draw.create({
      month: lastMonth,
      year,
      status: 'published',
      drawType: 'random',
      winningNumbers: [5, 18, 25, 31, 42],
      prizePool: { total: 89.91, fiveMatch: 35.96, fourMatch: 31.47, threeMatch: 22.48 },
      publishedAt: new Date(),
      createdBy: admin._id
    })

    await Winner.create({
      drawId: lastMonthDraw._id,
      userId: testUser._id,
      matchType: '3-match',
      prizeAmount: 22.48,
      paymentStatus: 'pending'
    })

    console.log('============================================')
    console.log('🌱 SEED COMPLETE')
    console.log('============================================')
    console.log('👤 ADMIN LOGIN')
    console.log('   Email:    admin@golfcares.com')
    console.log('   Password: Admin@1234')
    console.log('--------------------------------------------')
    console.log('👤 TEST USER LOGIN')
    console.log('   Email:    user@golfcares.com')
    console.log('   Password: User@1234')
    console.log('============================================')

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    try {
      await mongoose.disconnect()
    } catch (_) {
      // ignore
    }
    process.exit(1)
  }
}

run()
