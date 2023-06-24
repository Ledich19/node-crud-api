import { IncomingMessage, ServerResponse } from "http";
import userModel from "../models/userModel.js";
import { ReqUserType } from "../app/types.js";
import { getDataFromRequest, isUUID } from "../utils/healper.js";

const getUsers = async (req: IncomingMessage, res: ServerResponse) => {
  const users = await userModel.getAll();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users));
};

const getUserById = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split("/")[3];
  const user = await userModel.getById(id || "");
  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "user does not exist" }));
    return;
  }
  if (id && !isUUID(id)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "user not valid" }));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(user));
};

const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  const body = await getDataFromRequest(req);

  if (typeof body !== "string" || typeof body === "undefined") {
    throw new Error("Invalid request body");
  }

  const bodyData = JSON.parse(body) as ReqUserType;

  if (
    typeof bodyData.username !== "string" ||
    typeof bodyData.age !== "number" ||
    !Array.isArray(bodyData.hobbies)
  ) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid request body" }));
  }

  const newUser = {
    username: bodyData.username,
    age: bodyData.age,
    hobbies: bodyData.hobbies,
  };

  console.log("POST", newUser);

  const createdUser = await userModel.create(newUser);

  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify(createdUser));
};

const updateUserById = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split("/")[3];
  const body = await getDataFromRequest(req);
  const user = await userModel.getById(id || "");
  if (typeof body !== "string") {
    throw new Error("Invalid request body");
  }

  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "user does not exist" }));
    return;
  }
  if (id && !isUUID(id)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "user not valid" }));
    return;
  }

  const bodyData = JSON.parse(body) as ReqUserType;
  const updatedUser = await userModel.update(id || "", bodyData);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(updatedUser));
};

const deleteUserById = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split("/")[3];
  const user = await userModel.getById(id || "");

  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "user does not exist" }));
    return;
  }
  if (id && !isUUID(id)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "user not valid" }));
    return;
  }

  res.writeHead(204, { "Content-Type": "application/json" });
  res.end();
};

const usersController = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;
  const isId = url?.match(/\/api\/users\/([0-9a-zA-Z]+)/);

  if (!isId && method === "GET") {
    getUsers(req, res);
  } else if (isId && method === "GET") {
    getUserById(req, res);
  } else if (!isId && method === "POST") {
    createUser(req, res);
  } else if (isId && method === "PUT") {
    updateUserById(req, res);
  } else if (isId && method === "DELETE") {
    deleteUserById(req, res);
  } else {
    throw new Error("Сделай нормальное завершение");
  }
};

export default usersController;
