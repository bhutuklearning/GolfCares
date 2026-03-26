import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  })
}

const buildTemplate = (content, ctaText, ctaLink) => `
  <div style="background:#101418;color:#f3f4f6;padding:24px;font-family:Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto;background:#1b222b;padding:24px;border-radius:10px">
      ${content}
      ${
        ctaText
          ? `<a href="${ctaLink}" style="display:inline-block;margin-top:18px;padding:12px 18px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">${ctaText}</a>`
          : ''
      }
    </div>
  </div>
`

const monthName = (monthNumber) =>
  new Date(2026, monthNumber - 1, 1).toLocaleString('en-GB', { month: 'long' })

const sendWelcomeEmail = async (user) => {
  try {
    await sendEmail({
      to: user.email,
      subject: 'Welcome to GolfCares! 🎉',
      html: buildTemplate(
        `<p>Hi ${user.firstName}, welcome to GolfCares!</p>
         <p>Your subscription is now active.</p>
         <p>Start by entering your last 5 golf scores in Stableford format.</p>`,
        'Go to Dashboard',
        `${process.env.CLIENT_URL}/dashboard`
      )
    })
  } catch (error) {
    console.error('Email error (welcome):', error.message)
  }
}

const sendDrawResultEmail = async (user, draw, matchType) => {
  try {
    const label = `${monthName(draw.month)} ${draw.year}`
    const body = matchType
      ? `<p>🏆 Congratulations ${user.firstName}! You matched ${matchType}!</p>`
      : `<p>The results are in for ${label}. Better luck next month!</p>`
    await sendEmail({
      to: user.email,
      subject: `Your ${monthName(draw.month)} ${draw.year} Draw Result`,
      html: buildTemplate(body, 'View Draw Results', `${process.env.CLIENT_URL}/draws`)
    })
  } catch (error) {
    console.error('Email error (draw result):', error.message)
  }
}

const sendWinnerEmail = async (user, prizeAmount, matchType) => {
  try {
    await sendEmail({
      to: user.email,
      subject: `🏆 You Won £${prizeAmount}!`,
      html: buildTemplate(
        `<p>Congratulations ${user.firstName}! You won £${prizeAmount} with a ${matchType}!</p>
         <p>Please upload your score proof to claim your prize.</p>`,
        'Claim Your Prize',
        `${process.env.CLIENT_URL}/dashboard/winnings`
      )
    })
  } catch (error) {
    console.error('Email error (winner):', error.message)
  }
}

const sendPaymentFailedEmail = async (user) => {
  try {
    await sendEmail({
      to: user.email,
      subject: '⚠️ Payment Failed — Action Required',
      html: buildTemplate(
        `<p>Hi ${user.firstName}, your subscription payment failed.</p>
         <p>Please update your payment details to continue.</p>`,
        'Update Payment',
        `${process.env.CLIENT_URL}/dashboard`
      )
    })
  } catch (error) {
    console.error('Email error (payment failed):', error.message)
  }
}

const sendProofSubmittedEmail = async (adminEmail, winnerId) => {
  try {
    await sendEmail({
      to: adminEmail,
      subject: 'Winner Proof Submitted — Action Required',
      html: buildTemplate(
        `<p>A winner has uploaded their proof and is awaiting verification.</p>
         <p>Winner ID: ${winnerId}</p>`,
        'Review in Admin Panel',
        `${process.env.CLIENT_URL}/admin/winners`
      )
    })
  } catch (error) {
    console.error('Email error (proof submitted):', error.message)
  }
}

const sendPayoutConfirmationEmail = async (user, amount) => {
  try {
    await sendEmail({
      to: user.email,
      subject: '💰 Prize Payment Confirmed',
      html: buildTemplate(
        `<p>Hi ${user.firstName}, your prize of £${amount} has been approved and is being processed!</p>
         <p>Payment will arrive within 3-5 business days.</p>`
      )
    })
  } catch (error) {
    console.error('Email error (payout confirmation):', error.message)
  }
}

export default {
  sendWelcomeEmail,
  sendDrawResultEmail,
  sendWinnerEmail,
  sendPaymentFailedEmail,
  sendProofSubmittedEmail,
  sendPayoutConfirmationEmail
}
