import "dotenv/config";
import http from "node:http";
import usersController from "./controllers/userController.js";

const server = http.createServer((req, res) => {
  const url = req.url;
  if (url?.match(/\/api\/users/)) {
    usersController(req, res)
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port \x1b[36m ${PORT}\x1b[0m`);
});
