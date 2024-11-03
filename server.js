const app = require('./src/app')

const PORT = process.env.PORT || 9080
const server = app.listen(PORT, () => {
    console.log(`+ Server is listening on port ${PORT}`)
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log('+ Server closed')
    })
})

