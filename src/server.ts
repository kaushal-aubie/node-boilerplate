import path from 'path'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import DB from '@utils/database'
import RestErrors from './utils/rest_errors'
import * as Models from './models'
import 'dotenv/config'

// importing routes
import AuthRoutes from './routes/auth_routes'

const app = express()
app.use(cors())

app.use(morgan('combined'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/public', express.static('public'))

/**
 * ping
 */
app.use('/ping', (_req, res) => {
  res.send('pong')
})

/**
 * auth route signin and signup
 */
app.use('/api/auth', AuthRoutes)

/**
 * To handle 404
 */
app.use('*', (_req, res) => {
  const notFoundError = RestErrors.newNotFoundError('Route not found')
  res.json(notFoundError)
})

function setUpDatabase() {
  DB.init()
  Models.default.setupModelsRelation()
  DB.sync().catch(console.error)
  DB.connect().catch(console.error)
}
const a = 2
function main() {
  try {
    const port = process.env.PORT || '8080'
    const callBack = (err: unknown) => {
      if (err) {
        console.log('Error when starting server ', err, a)
      } else {
        console.log('Server listening on port ', port)
      }
    }
    setUpDatabase()
    app.listen(port, callBack as () => void)
  } catch (err) {
    console.log('Error when starting server ', err)
  }
}

// Starting server
main()
