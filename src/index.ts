import "dotenv/config";
import http, { ServerResponse } from "node:http";
import app from "./app.js";
import { startDatabaseServer } from "./data/database.js";


await startDatabaseServer(4444)
const server = http.createServer(app);

server.on('clientError', (err, socket: ServerResponse) => {
  socket.writeHead(404, { "Content-Type": "application/json" });
  socket.end(JSON.stringify({ error: `Sorry, page does not exist` }));
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port \x1b[36m ${PORT}\x1b[0m`);
});
