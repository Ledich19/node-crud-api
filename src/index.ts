import "dotenv/config";
import cluster from "node:cluster";
import http, { ServerResponse } from "node:http";
import { availableParallelism } from "node:os";
import app from "./app.js";
import { startDatabaseServer } from "./data/database.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const numCPUs = availableParallelism();
let currentWorker = 1;

if (process.env.NODE_ENV === "multi") {
  if (cluster.isPrimary) {
    await startDatabaseServer(4444);
    for (let i = 1; i <= numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.log(
        `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
      );
      cluster.fork();
    });

    const server = http.createServer((req, res) => {
      const workerPort = PORT + currentWorker;
      currentWorker += 1;
      if (currentWorker > numCPUs) currentWorker = 1;
      const redirectUrl = `http://localhost:${workerPort}${req.url}`;

      const requestOptions = {
        method: req.method,
        headers: req.headers,
      };

      console.log(
        `Redirecting ${req.method} request to worker on port ${workerPort}`
      );

      const proxyReq = http.request(redirectUrl, requestOptions, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 302, proxyRes.headers);
        proxyRes.pipe(res);
      });

      req.pipe(proxyReq);
    });

    server.listen(PORT, () => {
      console.log(`Load balancer is listening on port ${PORT}`);
    });
  } else {
    const server = http.createServer(app);

    const worker = cluster?.worker?.id || 0;
    server.listen(PORT + worker, () => {
      console.log(`Worker ${worker} is listening on port ${PORT + worker}`);
    });
  }
} else {
  await startDatabaseServer(4444);
  const server = http.createServer(app);

  server.on("clientError", (err, socket: ServerResponse) => {
    socket.writeHead(404, { "Content-Type": "application/json" });
    socket.end(JSON.stringify({ error: `Sorry, page does not exist` }));
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on port \x1b[36m ${PORT}\x1b[0m`);
  });
}
