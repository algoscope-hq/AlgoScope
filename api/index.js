import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 5000

// Trust proxy for rate limiting behind reverse proxies
app.set('trust proxy', 1)

// Security headers
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})
app.use(limiter)

// CORS — restrict to trusted origins
const frontendOrigin = process.env.FRONTEND_URL?.trim().replace(/\/+$/, '')

if (process.env.NODE_ENV === 'production' && !frontendOrigin) {
  throw new Error('FRONTEND_URL must be set in production')
}

const allowedOrigins = [
  frontendOrigin,
  ...(process.env.NODE_ENV !== 'production'
    ? ['http://localhost:5173', 'http://localhost:4173']
    : []),
].filter(Boolean)

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true)
      } else {
        cb(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

// Body parsing with size limit
app.use(express.json({ limit: '10kb' }))

// A simple test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AlgoScope Backend is running!' })
})

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

export default app
