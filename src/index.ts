import "dotenv/config";
import http from "node:http";

const users = []

const server = http.createServer((req, res) => {
  console.log(req.url);
  console.log(req.method);
  const url = req.url;
  const method = req.method;

  if (url === "/api/user" && method === "GET") {
    res.writeHead(200);
    res.end("persons");
    console.log("yra");
  }
  if (url?.match(/\/api\/users\/([0-9]+)/) && method === "GET") {
    const id = url.split("/")[3];
    res.writeHead(200);
    res.end("persons");
    console.log("yra");
  }
  if (method === "POST") {
    console.log(req);
    console.log("POST");
  }
  if (method === "PUT") {
    console.log("PUT");
  }
  if (method === "DELETE") {
    console.log("DELETE");
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port \x1b[36m ${PORT}\x1b[0m`);
});
