import { IncomingMessage, ServerResponse } from "http";
import userModel from "../models/userModel.js";
import { ReqUserType } from "../app/types.js";
import { getDataFromRequest, isUUID } from "../utils/healper.js";

const getUsers = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const users = await userModel.getAll();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error(error);
  }
};

const getUserById = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split("/")[3];
  try {
    const users = await userModel.getById(id || "");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error(error);
  }
};

const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
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
      throw new Error("Invalid request body");
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  }
};

const updateUserById = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const id = req.url?.split("/")[3];
    const body = await getDataFromRequest(req);
    const user = await userModel.getById(id || "");
    if (typeof body !== "string") {
      throw new Error("Invalid request body");
    }

    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "user does not exist" }));
    }
    if (id && !isUUID(id)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "user not valid" }));
    }

    const bodyData = JSON.parse(body) as ReqUserType;
    const updatedUser = await userModel.update(id || '', bodyData);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(updatedUser));
  } catch (error) {
    if (error instanceof Error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  }
};

const deleteUserById = (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split("/")[3];
  console.log("DELETE");
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
