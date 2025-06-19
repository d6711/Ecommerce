const app = require('./src/app')
const { env } = require('./src/config/constants')

const server = app.listen(env.PORT, () =>
    console.log(`Server running on port ${env.PORT}`),
)

process.on('SIGINT', () => {
    server.close((err) => {
        console.log('Exit Server')
        process.exit(err ? 1 : 0)
    })
})
