
// import dotenv from 'dotenv'
// dotenv.config({path: './.env'})
// console.log("ENV CHECK 👉", process.env.GROQ_API_KEY);
// import express from 'express'
// import contentrouter from './src/routes/contentRoutes.js'

// import connectdb from './src/config/database.js'
// import errorHandler from './src/middleware/errorHandler.js'
// import logger from './src/utils/logger.js'
// // dotenv.config()

// const app = express()

// connectdb()
// const PORT = process.env.PORT || 3000   
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// if (process.env.NODE_ENV !== 'production') {
//     app.use((req, res, next) => {
//         logger.info(`${req.method} ${req.path}`)
//         next()
//     })
// }
// app.use(express.json())
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

// pp.get('/health', (req, res) => {
//     res.json({
//         success: true,
//         message: 'ContentGuard AI is running',
//         timestamp: new Date().toISOString()
//     })
// })

// app.use('/api', contentrouter)

// // 404 handler - when route not found
// // WHY: Give proper error message instead of default Express error
// app.use('*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         error: 'Route not found',
//         path: req.originalUrl
//     })
// })

// // ============================================
// // 🆕 IMPORTANT: Error Handler (MUST BE LAST!)
// // WHY: Catch all errors and send proper JSON responses
// // Without this, your app crashes on errors!
// // ============================================
// app.use(errorHandler)
// app.use('/api', contentrouter)

// app.listen(PORT, () => {
//     console.log(`Server is running on port http://localhost:${PORT}`)
// })


// process.on('unhandledRejection', (err) => {
//     logger.error('Unhandled Rejection:', err)
//     console.error('❌ Unhandled Rejection:', err)
// })

// process.on('uncaughtException', (err) => {
//     logger.error('Uncaught Exception:', err)
//     console.error('❌ Uncaught Exception:', err)
//     process.exit(1)
// })
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import express from 'express'
import contentrouter from './src/routes/contentRoutes.js'
import connectdb from './src/config/database.js'
import errorHandler from './src/middlewear/errorHandler.js'
import logger from './src/utils/logger.js'

const app = express()
const PORT = process.env.PORT || 3000

// 1️⃣ Connect DB
connectdb()

// 2️⃣ Core middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 3️⃣ Logger middleware (dev only)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        logger.info(`${req.method} ${req.path}`)
        next()
    })
}

// 4️⃣ Health & base routes
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'ContentGuard AI is running',
        timestamp: new Date().toISOString()
    })
})

// 5️⃣ API routes
app.use('/api', contentrouter)

// 6️⃣ 404 handler (no route matched)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl
    })
})

// 7️⃣ Global error handler (ABSOLUTELY LAST)
app.use(errorHandler)

// 8️⃣ Start server
app.listen(PORT, () => {
    logger.success(`Server running at http://localhost:${PORT}`)
})

// 9️⃣ Node-level crash handling
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err)
})

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err)
    process.exit(1)
})
