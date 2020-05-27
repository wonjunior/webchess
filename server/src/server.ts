import http from 'http'
import SocketIOServer from 'socket.io'
import initializeSocketIO from './socket'

import app from './app'
import { PORT } from './config'

const server = new http.Server(app)
const io = SocketIOServer(server)

initializeSocketIO(io)

server.listen(PORT, () => console.info(`server started at http://localhost:${PORT}`));