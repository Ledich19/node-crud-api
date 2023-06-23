// export const users = (req, res) => {
//   if (url === "/api/users" && method === "GET") {
//     res.writeHead(200);
//     res.end("persons");
//     console.log("yra");
//   }
//   if (url === "/api/users" && method === "POST") {
//     console.log("POST");
//   }
//   if (url === "/api/users" && method === "PUT") {
//     console.log("PUT");
//   }
//   if (url === "/api/users" && method === "DELETE") {
//     console.log("DELETE");
//   }
// };

import { IncomingMessage, ServerResponse } from "http";
import userModel from "../models/userModel.js";

export const getUsers = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const users = await userModel.getAll()
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error(error);
  }
};

export const getUserById = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split("/")[3];
  try {
    const users = await userModel.getById(id || '')
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error(error);
  }
};


const usersController = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;
  if (url === "/api/users" && method === "GET") {
    getUsers(req, res);
  } else if (url?.match(/\/api\/users\/([0-9a-zA-Z]+)/) && method === "GET") {
    getUserById(req,res)
  }
}

export default usersController
