import Score from '../models/Score.js'
import Subscription from '../models/Subscription.js'
import User from '../models/User.js'
import Draw from '../models/Draw.js'
import Winner from '../models/Winner.js'
import emailService from './email.service.js'

export const generateRandomNumbers = () => {
  const numbers = new Set()
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1)
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

export const generateAlgorithmicNumbers = async () => {
  const allScores = await Score.find({})
  const scoreValues = allScores.flatMap((s) => s.scores.map((sc) => sc.value))

  if (!scoreValues.length) return generateRandomNumbers()

  const frequency = new Map()
  for (let i = 1; i <= 45; i += 1) frequency.set(i, 0)
  scoreValues.forEach((value) => frequency.set(value, (frequency.get(value) || 0) + 1))

  const pool = []
  for (let i = 1; i <= 45; i += 1) {
    const count = (frequency.get(i) || 0) + 1
    for (let j = 0; j < count; j += 1) pool.push(i)
  }

  const selected = new Set()
  while (selected.size < 5 && pool.length) {
    const randomNum = pool[Math.floor(Math.random() * pool.length)]
    selected.add(randomNum)
  }

  if (selected.size < 5) return generateRandomNumbers()
  return Array.from(selected).sort((a, b) => a - b)
}

export const calculatePrizePool = async (month, year) => {
  const activeSubscriptions = await Subscription.find({ status: 'active' })
  const totalAmountPence = activeSubscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0)
  const totalAmountGBP = totalAmountPence / 100

  const activeUsers = await User.find({ isActive: true })
  const avgCharityPercent = activeUsers.length
    ? activeUsers.reduce((sum, user) => sum + (user.charityContributionPercent || 10), 0) /
      activeUsers.length
    : 10

  const prizeTotal = totalAmountGBP * (1 - avgCharityPercent / 100)
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year

  const prevDraw = await Draw.findOne({
    month: prevMonth,
    year: prevYear,
    jackpotRollover: true
  })

  const rolledOver = prevDraw ? prevDraw.prizePool.fiveMatch : 0

  return {
    total: prizeTotal,
    fiveMatch: parseFloat((prizeTotal * 0.4 + rolledOver).toFixed(2)),
    fourMatch: parseFloat((prizeTotal * 0.35).toFixed(2)),
    threeMatch: parseFloat((prizeTotal * 0.25).toFixed(2)),
    jackpotRolledOver: rolledOver
  }
}

export const matchUserScores = (winningNumbers, userScoreValues) => {
  const matched = userScoreValues.filter((s) => winningNumbers.includes(s))
  const count = matched.length
  if (count >= 5) return '5-match'
  if (count === 4) return '4-match'
  if (count === 3) return '3-match'
  return null
}

export const runDraw = async (drawId, publish = false) => {
  const draw = await Draw.findById(drawId)
  if (!draw) throw new Error('Draw not found')
  if (draw.status === 'published') throw new Error('Draw already published')

  if (!draw.winningNumbers || draw.winningNumbers.length === 0) {
    draw.winningNumbers =
      draw.drawType === 'algorithmic' ? await generateAlgorithmicNumbers() : generateRandomNumbers()
  }

  const activeSubscriptions = await Subscription.find({ status: 'active' })
  const userIds = [...new Set(activeSubscriptions.map((s) => s.userId.toString()))]
  const allScores = await Score.find({ userId: { $in: userIds } })

  const results = { '5-match': [], '4-match': [], '3-match': [] }
  for (const userId of userIds) {
    const scoreDoc = allScores.find((s) => s.userId.toString() === userId)
    if (!scoreDoc || scoreDoc.scores.length === 0) continue
    const scoreValues = scoreDoc.scores.map((s) => s.value)
    const matchType = matchUserScores(draw.winningNumbers, scoreValues)
    if (matchType) results[matchType].push(userId)
  }

  const prizesPerWinner = {
    '5-match': results['5-match'].length
      ? draw.prizePool.fiveMatch / results['5-match'].length
      : 0,
    '4-match': results['4-match'].length
      ? draw.prizePool.fourMatch / results['4-match'].length
      : 0,
    '3-match': results['3-match'].length
      ? draw.prizePool.threeMatch / results['3-match'].length
      : 0
  }

  draw.jackpotRollover = results['5-match'].length === 0

  if (publish) {
    for (const matchType of ['5-match', '4-match', '3-match']) {
      for (const userId of results[matchType]) {
        await Winner.create({
          drawId: draw._id,
          userId,
          matchType,
          prizeAmount: parseFloat(prizesPerWinner[matchType].toFixed(2)),
          paymentStatus: 'pending'
        })
        const user = await User.findById(userId)
        if (user) {
          await emailService.sendWinnerEmail(user, prizesPerWinner[matchType].toFixed(2), matchType)
        }
      }
    }

    for (const userId of userIds) {
      const user = await User.findById(userId)
      if (!user) continue
      const matchedType = results['5-match'].includes(userId)
        ? '5-match'
        : results['4-match'].includes(userId)
        ? '4-match'
        : results['3-match'].includes(userId)
        ? '3-match'
        : null
      await emailService.sendDrawResultEmail(user, draw, matchedType)
    }

    draw.status = 'published'
    draw.publishedAt = new Date()
  } else {
    draw.simulationResult = {
      winningNumbers: draw.winningNumbers,
      winners: results,
      prizesPerWinner,
      totalWinners: results['5-match'].length + results['4-match'].length + results['3-match'].length,
      jackpotRollover: draw.jackpotRollover
    }
    draw.status = 'simulated'
  }

  await draw.save()
  return { draw, results, prizesPerWinner }
}
