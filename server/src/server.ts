import app from './app'
import { Server } from 'http'

import WebSocketServer from './socket'
import { PORT } from './config'

const server = new Server(app)

// launch HTTP server
server.listen(PORT, () => console.info(`server started at http://localhost:${PORT}`));

// launch Websockets
new WebSocketServer(server).listen()