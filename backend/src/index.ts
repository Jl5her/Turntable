/* eslint-disable no-console */
import express, { Response, Request } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { setupSocket, initializeApp , sessions} from './turntable'
import spotify from './spotify'
import dotenv from 'dotenv'
import { log } from './utils'

dotenv.config()

const { PORT } = process.env

const app = express()

app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())

const server = createServer(app)
const io = new Server(server, {
  serveClient: true,
  cors: {
    origin: '*'
  }
})

initializeApp(io)

io.on('connection', setupSocket)

app.get('/', (_: Request, res: Response) => res.status(200).send(' '))

app.get('/debug', (_: Request, res: Response) => res.status(200).send(sessions))

app.get('/authorize', (_: Request, res: Response) => res.redirect(spotify.get_authorize_url()))

server.listen(PORT, () => {
  log(`🚀 Server is running ast :${PORT}`)
})

