import "dotenv/config";
import http from "node:http";
import { UserType } from "./app/types.js";
import usersController, { getUserById, getUsers } from "./controllers/userController.js";

const server = http.createServer((req, res) => {
  console.log(req.url);
  console.log(req.method);
  const url = req.url;
  const method = req.method;
  if (url?.match(/\/api\/users/)) {
    usersController(req, res)
  }

  // if (method === "POST") {
  //   console.log(req);
  //   console.log("POST");
  // }
  // if (method === "PUT") {
  //   console.log("PUT");
  // }
  // if (method === "DELETE") {
  //   console.log("DELETE");
  // }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port \x1b[36m ${PORT}\x1b[0m`);
});
