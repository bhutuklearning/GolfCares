import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import connectDB from './config/db.js'
import { errorHandler } from './middleware/error.middleware.js'
import { initCronJobs } from './jobs/draw.cron.js'

import authRouter from './routes/auth.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import scoreRouter from './routes/score.routes.js'
import charityRouter from './routes/charity.routes.js'
import drawRouter from './routes/draw.routes.js'
import winnerRouter from './routes/winner.routes.js'
import adminRouter from './routes/admin.routes.js'

const app = express()

connectDB().then(() => initCronJobs())

// ⚠️ WEBHOOK MUST BE FIRST — before express.json()
app.use(
  '/api/subscription/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    import('./controllers/subscription.controller.js').then(({ stripeWebhook }) => {
      stripeWebhook(req, res, next)
    })
  }
)

app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
)
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
})
app.use('/api', limiter)

app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }))

app.use('/api/auth', authRouter)
app.use('/api/subscription', subscriptionRouter)
app.use('/api/scores', scoreRouter)
app.use('/api/charities', charityRouter)
app.use('/api/draws', drawRouter)
app.use('/api/winners', winnerRouter)
app.use('/api/admin', adminRouter)

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📌 Environment: ${process.env.NODE_ENV}`)
})

