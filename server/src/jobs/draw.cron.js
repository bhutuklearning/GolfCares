import cron from 'node-cron'
import Draw from '../models/Draw.js'
import { calculatePrizePool } from '../services/draw.service.js'

export const initCronJobs = () => {
  cron.schedule('0 9 1 * *', async () => {
    try {
      const now = new Date()
      const month = now.getMonth() + 1
      const year = now.getFullYear()
      const existing = await Draw.findOne({ month, year })
      if (!existing) {
        const prizePool = await calculatePrizePool(month, year)
        await Draw.create({ month, year, drawType: 'random', prizePool, status: 'pending' })
        console.log(`✅ Auto-created draw for ${month}/${year} | Pool: £${prizePool.total}`)
      } else {
        console.log(`⏭️ Draw already exists for ${month}/${year}`)
      }
    } catch (err) {
      console.error('❌ Cron job error:', err.message)
    }
  })
  console.log('✅ Cron jobs initialized')
}
