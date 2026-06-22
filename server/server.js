import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

app.use(cors())
app.use(express.json())

const DB = {
  users: [],
  designers: [],
  customers: [],
  jobs: [],
  transactions: [],
  complaints: [],
  payouts: [],
  jobResponses: {},
  tips: []
}

const onlineSockets = new Map()

// Seed default admin
const seedAdmin = () => {
  const existing = DB.users.find(u => u.email === 'vijay@creativebirds.com')
  if (!existing) {
    const admin = {
      id: uuidv4(),
      name: 'vijay',
      email: 'vijay@creativebirds.com',
      password: 'vijay123',
      role: 'admin',
      phone: '9999999999',
      createdAt: new Date().toISOString()
    }
    DB.users.push(admin)
    console.log('Default admin seeded: vijay / vijay123')
  }
}
seedAdmin()

const PACKAGES = [
  { id: 'pkg1', name: 'Quick Design', hours: 1, price: 1000 },
  { id: 'pkg2', name: 'Standard Design', hours: 2, price: 2000 },
  { id: 'pkg3', name: 'Premium Design', hours: 3, price: 2500 }
]

function generateMeetLink() {
  const code = Math.random().toString(36).substring(2, 12)
  return `https://meet.google.com/${code}`
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function getOnlineDesignerIds() {
  const ids = new Set()
  for (const entry of onlineSockets.values()) {
    if (entry.onlineStatus === 'online') ids.add(entry.designerId)
  }
  return Array.from(ids)
}

function broadcastToOnline(event, payload) {
  for (const [socketId, entry] of onlineSockets.entries()) {
    if (entry.onlineStatus === 'online') {
      io.to(socketId).emit(event, payload)
    }
  }
}

function getJobStatus(jobId) {
  const responses = DB.jobResponses[jobId] || {}
  const all = Object.values(responses)
  return {
    totalNotified: all.length,
    totalViewed: all.filter(r => r.status === 'viewed' || r.status === 'rejected' || r.status === 'accepted').length,
    totalRejected: all.filter(r => r.status === 'rejected').length,
    totalPending: all.filter(r => r.status === 'notified').length,
    totalMissed: all.filter(r => r.status === 'missed').length,
    totalAccepted: all.filter(r => r.status === 'accepted').length
  }
}

app.get('/api/packages', (req, res) => {
  res.json(PACKAGES)
})

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, phone } = req.body
  if (role === 'admin') return res.status(403).json({ error: 'Admin registration is not allowed' })
  const existing = DB.users.find(u => u.email === email)
  if (existing) return res.status(400).json({ error: 'Email already exists' })

  const user = { id: uuidv4(), name, email, password, role, phone, createdAt: new Date().toISOString() }
  DB.users.push(user)

  if (role === 'designer') {
    const designer = { ...user, employeeId: `DES-${Math.floor(1000 + Math.random() * 9000)}`, aadhaar: '', onboardingComplete: false, status: 'pending', onlineStatus: 'offline', credits: 0, earnings: 0, pendingPayout: 0, totalJobs: 0, viewedCount: 0, acceptedCount: 0, rejectedCount: 0, missedCount: 0 }
    DB.designers.push(designer)
    return res.json({ user: designer })
  } else if (role === 'customer') {
    const customer = { ...user, totalSpent: 0, totalJobs: 0 }
    DB.customers.push(customer)
    return res.json({ user: customer })
  } else if (role === 'admin') {
    return res.json({ user })
  }
  res.json({ user })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  const user = DB.users.find(u => u.email === email && u.password === password)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  if (user.role === 'designer') {
    const designer = DB.designers.find(d => d.id === user.id)
    return res.json({ user: designer || user })
  }
  if (user.role === 'customer') {
    const customer = DB.customers.find(c => c.id === user.id)
    return res.json({ user: customer || user })
  }
  res.json({ user })
})

app.get('/api/designers', (req, res) => {
  res.json(DB.designers)
})

app.get('/api/customers', (req, res) => {
  res.json(DB.customers)
})

app.put('/api/designers/:id', (req, res) => {
  const idx = DB.designers.findIndex(d => d.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  DB.designers[idx] = { ...DB.designers[idx], ...req.body }
  res.json(DB.designers[idx])
})

app.post('/api/designers/onboarding', (req, res) => {
  const { designerId, aadhaar, termsAccepted } = req.body
  const idx = DB.designers.findIndex(d => d.id === designerId)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  DB.designers[idx].aadhaar = aadhaar
  DB.designers[idx].termsAccepted = termsAccepted
  DB.designers[idx].onboardingComplete = true
  DB.designers[idx].status = 'active'
  res.json(DB.designers[idx])
})

app.post('/api/jobs', (req, res) => {
  const { customerId, requirements, packageId, packageName, price } = req.body
  const pkg = PACKAGES.find(p => p.id === packageId)
  const customer = DB.customers.find(c => c.id === customerId)
  const job = {
    id: uuidv4(),
    customerId,
    customerName: customer?.name || 'Customer',
    requirements,
    packageId,
    packageName: pkg?.name || packageName,
    price: pkg?.price || price,
    tip: 0,
    finalPrice: pkg?.price || price,
    status: 'pending',
    designerId: null,
    designerName: null,
    employeeId: null,
    meetLink: null,
    otp: generateOTP(),
    createdAt: new Date().toISOString(),
    acceptedAt: null,
    completedAt: null
  }
  DB.jobs.push(job)

  const tx = {
    id: uuidv4(),
    jobId: job.id,
    customerId,
    customerName: customer?.name || 'Customer',
    amount: job.finalPrice,
    tip: 0,
    adminShare: job.finalPrice,
    designerShare: 0,
    status: 'paid',
    createdAt: new Date().toISOString(),
    releasedAt: null
  }
  DB.transactions.push(tx)

  if (customer) {
    customer.totalSpent += job.finalPrice
    customer.totalJobs += 1
  }

  const onlineIds = getOnlineDesignerIds()
  DB.jobResponses[job.id] = {}
  for (const designerId of onlineIds) {
    DB.jobResponses[job.id][designerId] = { status: 'notified', timestamp: new Date().toISOString() }
  }

  broadcastToOnline('newJob', job)

  const status = getJobStatus(job.id)
  status.totalNotified = onlineIds.length
  io.emit('jobStatusUpdate', { jobId: job.id, ...status })

  // Auto-expire job after 60 seconds if not assigned
  setTimeout(() => {
    const j = DB.jobs.find(x => x.id === job.id)
    if (j && j.status === 'pending') {
      j.status = 'expired'
      io.emit('jobExpired', { jobId: job.id })
      io.emit('stopAlert', { jobId: job.id })
    }
  }, 60000)

  res.json({ job, transaction: tx, status })
})

app.get('/api/jobs', (req, res) => {
  const { customerId, designerId, status } = req.query
  let jobs = DB.jobs
  if (customerId) jobs = jobs.filter(j => j.customerId === customerId)
  if (designerId) jobs = jobs.filter(j => j.designerId === designerId)
  if (status) jobs = jobs.filter(j => j.status === status)
  res.json(jobs)
})

app.get('/api/jobs/:id/status', (req, res) => {
  const job = DB.jobs.find(j => j.id === req.params.id)
  if (!job) return res.status(404).json({ error: 'Not found' })
  const responses = DB.jobResponses[job.id] || {}
  const onlineIds = getOnlineDesignerIds()
  const status = getJobStatus(job.id)
  status.totalNotified = onlineIds.length
  res.json({ job, status, responses })
})

app.post('/api/jobs/:id/tip', (req, res) => {
  const job = DB.jobs.find(j => j.id === req.params.id)
  if (!job) return res.status(404).json({ error: 'Job not found' })
  if (job.status !== 'pending') return res.status(400).json({ error: 'Cannot add tip after assignment' })

  const { amount } = req.body
  job.tip += amount
  job.finalPrice = job.price + job.tip

  const tx = DB.transactions.find(t => t.jobId === job.id)
  if (tx) {
    tx.amount = job.finalPrice
    tx.tip = job.tip
    tx.adminShare = job.finalPrice
  }

  const tipRecord = {
    id: uuidv4(),
    jobId: job.id,
    amount,
    createdAt: new Date().toISOString()
  }
  DB.tips.push(tipRecord)

  io.emit('jobTipAdded', { jobId: job.id, tip: job.tip, finalPrice: job.finalPrice })
  res.json({ job, tipRecord })
})

app.post('/api/jobs/:id/accept', (req, res) => {
  const job = DB.jobs.find(j => j.id === req.params.id)
  if (!job) return res.status(404).json({ error: 'Job not found' })
  if (job.status !== 'pending') return res.status(400).json({ error: 'Job already assigned' })

  const { designerId } = req.body
  const designer = DB.designers.find(d => d.id === designerId)
  if (!designer) return res.status(404).json({ error: 'Designer not found' })
  if (!designer.onboardingComplete) return res.status(400).json({ error: 'Designer not onboarded' })

  job.status = 'assigned'
  job.designerId = designerId
  job.designerName = designer.name
  job.employeeId = designer.employeeId
  job.meetLink = generateMeetLink()
  job.acceptedAt = new Date().toISOString()

  designer.totalJobs += 1
  designer.credits += 1
  designer.acceptedCount += 1

  if (!DB.jobResponses[job.id]) DB.jobResponses[job.id] = {}
  DB.jobResponses[job.id][designerId] = { status: 'accepted', timestamp: new Date().toISOString() }

  for (const [did, resp] of Object.entries(DB.jobResponses[job.id])) {
    if (did !== designerId && resp.status === 'notified') {
      resp.status = 'missed'
      const d = DB.designers.find(x => x.id === did)
      if (d) d.missedCount += 1
    }
  }

  const tx = DB.transactions.find(t => t.jobId === job.id)
  if (tx) {
    tx.designerShare = Math.floor(job.finalPrice * 0.5)
    tx.adminShare = job.finalPrice - tx.designerShare
  }

  io.emit('jobAssigned', job)
  io.emit('stopAlert', { jobId: job.id })
  res.json({ job })
})

app.post('/api/jobs/:id/complete', (req, res) => {
  const job = DB.jobs.find(j => j.id === req.params.id)
  if (!job) return res.status(404).json({ error: 'Job not found' })
  job.status = 'completed'
  job.completedAt = new Date().toISOString()

  const designer = DB.designers.find(d => d.id === job.designerId)
  if (designer) {
    designer.pendingPayout += Math.floor(job.finalPrice * 0.5)
  }

  const payout = {
    id: uuidv4(),
    designerId: job.designerId,
    designerName: job.designerName,
    employeeId: job.employeeId,
    jobId: job.id,
    amount: Math.floor(job.finalPrice * 0.5),
    status: 'pending',
    createdAt: new Date().toISOString(),
    releaseDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
  }
  DB.payouts.push(payout)

  io.emit('jobCompleted', job)
  res.json({ job, payout })
})

app.post('/api/jobs/:id/complaint', (req, res) => {
  const job = DB.jobs.find(j => j.id === req.params.id)
  if (!job) return res.status(404).json({ error: 'Job not found' })

  const { customerId, message } = req.body
  const designer = DB.designers.find(d => d.id === job.designerId)
  const complaint = {
    id: uuidv4(),
    jobId: job.id,
    customerId,
    customerName: job.customerName,
    designerId: job.designerId,
    designerName: job.designerName,
    employeeId: job.employeeId,
    designerAadhaar: designer?.aadhaar || '',
    message,
    status: 'open',
    createdAt: new Date().toISOString()
  }
  DB.complaints.push(complaint)
  res.json({ complaint })
})

app.get('/api/complaints', (req, res) => {
  res.json(DB.complaints)
})

app.get('/api/transactions', (req, res) => {
  res.json(DB.transactions)
})

app.get('/api/payouts', (req, res) => {
  res.json(DB.payouts)
})

app.post('/api/payouts/:id/release', (req, res) => {
  const payout = DB.payouts.find(p => p.id === req.params.id)
  if (!payout) return res.status(404).json({ error: 'Not found' })
  payout.status = 'released'

  const designer = DB.designers.find(d => d.id === payout.designerId)
  if (designer) {
    designer.earnings += payout.amount
    designer.pendingPayout -= payout.amount
  }

  const tx = DB.transactions.find(t => t.jobId === payout.jobId)
  if (tx) tx.releasedAt = new Date().toISOString()

  res.json({ payout })
})

app.get('/api/admin/stats', (req, res) => {
  const totalRevenue = DB.transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalTips = DB.tips.reduce((sum, t) => sum + t.amount, 0)
  const pendingPayouts = DB.payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  res.json({
    totalCustomers: DB.customers.length,
    totalDesigners: DB.designers.length,
    totalJobs: DB.jobs.length,
    totalRevenue,
    totalTips,
    pendingPayouts,
    openComplaints: DB.complaints.filter(c => c.status === 'open').length
  })
})

app.get('/api/admin/response-metrics', (req, res) => {
  const metrics = DB.designers.map(d => ({
    id: d.id,
    name: d.name,
    employeeId: d.employeeId,
    onlineStatus: d.onlineStatus,
    viewedCount: d.viewedCount || 0,
    acceptedCount: d.acceptedCount || 0,
    rejectedCount: d.rejectedCount || 0,
    missedCount: d.missedCount || 0
  }))
  const totalTips = DB.tips.reduce((sum, t) => sum + t.amount, 0)
  const tipCount = DB.tips.length
  res.json({ metrics, totalTips, tipCount })
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('designerOnline', ({ designerId }) => {
    const designer = DB.designers.find(d => d.id === designerId)
    if (designer) {
      designer.onlineStatus = 'online'
      onlineSockets.set(socket.id, { designerId, onlineStatus: 'online' })
      console.log(`Designer ${designerId} is now online`)
    }
  })

  socket.on('designerOffline', ({ designerId }) => {
    const designer = DB.designers.find(d => d.id === designerId)
    if (designer) {
      designer.onlineStatus = 'offline'
      onlineSockets.delete(socket.id)
      console.log(`Designer ${designerId} is now offline`)
    }
  })

  socket.on('designerBusy', ({ designerId }) => {
    const designer = DB.designers.find(d => d.id === designerId)
    if (designer) {
      designer.onlineStatus = 'busy'
      const entry = onlineSockets.get(socket.id)
      if (entry) entry.onlineStatus = 'busy'
      console.log(`Designer ${designerId} is now busy`)
    }
  })

  socket.on('viewJob', ({ jobId, designerId }) => {
    if (!DB.jobResponses[jobId]) DB.jobResponses[jobId] = {}
    if (DB.jobResponses[jobId][designerId]?.status === 'notified') {
      DB.jobResponses[jobId][designerId] = { status: 'viewed', timestamp: new Date().toISOString() }
      const designer = DB.designers.find(d => d.id === designerId)
      if (designer) designer.viewedCount += 1
    }
    const status = getJobStatus(jobId)
    io.emit('jobStatusUpdate', { jobId, ...status })
  })

  socket.on('rejectJob', ({ jobId, designerId }) => {
    if (!DB.jobResponses[jobId]) DB.jobResponses[jobId] = {}
    DB.jobResponses[jobId][designerId] = { status: 'rejected', timestamp: new Date().toISOString() }
    const designer = DB.designers.find(d => d.id === designerId)
    if (designer) designer.rejectedCount += 1
    const status = getJobStatus(jobId)
    io.emit('jobStatusUpdate', { jobId, ...status })
  })

  socket.on('disconnect', () => {
    const entry = onlineSockets.get(socket.id)
    if (entry) {
      const designer = DB.designers.find(d => d.id === entry.designerId)
      if (designer) designer.onlineStatus = 'offline'
      onlineSockets.delete(socket.id)
      console.log('Designer went offline on disconnect:', entry.designerId)
    }
    console.log('Client disconnected:', socket.id)
  })
})

export { app }

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
