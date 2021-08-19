/* eslint-disable no-console */
import express, { Response, Request } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { setupSocket, initializeApp } from './turntable'
import spotify from './spotify'
import dotenv from 'dotenv'

dotenv.config()

const PORT = 8081

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

app.get('/authorize', (_: Request, res: Response) => res.redirect(spotify.getAuthorizeUrl()))

server.listen(PORT, () => {
  console.log(`🚀 Server is running at :${PORT}`)
})

