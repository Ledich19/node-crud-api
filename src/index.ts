import "dotenv/config";
import http from "node:http";
import usersController from "./controllers/userController.js";

const server = http.createServer((req, res) => {
  const url = req.url;
try {
  if (url?.match(/\/api\/users/)) {
    usersController(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: `Sorry, page does not exist` }));
  }
  
} catch (error) {
  if (error instanceof Error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port \x1b[36m ${PORT}\x1b[0m`);
});
