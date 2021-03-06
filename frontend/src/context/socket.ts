import { createContext } from "react"
import { Socket } from 'socket.io-client'

const SocketContext = createContext<Socket | undefined>(undefined)

export default SocketContext