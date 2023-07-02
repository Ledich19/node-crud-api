import "dotenv/config";
import cluster from "node:cluster";
import http from "node:http";
import { availableParallelism } from "node:os";
import app from "./app.js";

const PORT = 4000;
const numCPUs = availableParallelism();
const currentWorker = 1;


if (cluster.isPrimary) {
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
    const redirectUrl = `http://localhost:${workerPort}${req.url}`;

    const requestOptions = {
      method: req.method,
      headers: req.headers,
    };
  
    console.log(`Redirecting ${req.method} request to worker on port ${workerPort}`);
  
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

  const worker = cluster?.worker?.id || 0
  server.listen(PORT + worker, () => {
    console.log(`Worker ${worker} is listening on port ${PORT + worker}`);
  });
}
