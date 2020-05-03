import app from "./app"
import { PORT } from "./config"



import http from "http";
//import Bundler from "parcel-bundler";
//import path from "path";
import SocketIOServer from "socket.io";

import initializeSocketIO from "./socket";

const server = new http.Server(app);
const io = SocketIOServer(server);
//const port = 8080 || process.env.PORT;

//const bundler = new Bundler(path.join(__dirname, "../src/client/index.html"));

initializeSocketIO(io);
//app.use(bundler.middleware());

server.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${PORT}`);
});