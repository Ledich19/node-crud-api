import { ReqUserType, UserType } from "../app/types.js";
import { randomUUID } from "node:crypto";
//import { getNewUserData, setNewUserData } from "../data/users.js";

import http from "http";

export function getNewUserData() {
  return new Promise((resolve, reject) => {
    http.get("http://localhost:4444/db/get", (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const parseData = JSON.parse(data)
        resolve(parseData);
      });
    }).on("error", (error) => {
      reject(error);
    });
  });
}

export function setNewUserData(data: UserType[]) {
  return new Promise((resolve, reject) => {
    const newData = JSON.stringify(data);

    const options = {
      hostname: "localhost",
      port: 4444,
      path: "/db/post",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": newData.length
      }
    };

    const request = http.request(options, (response) => {
      response.setEncoding("utf8");

      let responseData = "";

      response.on("data", (chunk) => {
        responseData += chunk;
      });

      response.on("end", () => {
        resolve(responseData);
      });
    });

    request.on("error", (error) => {
      reject(error);
    });

    request.write(newData);
    request.end();
  });
}

const getAll = async () => {
  const userData = await getNewUserData();
  return new Promise((resolve) => resolve(userData));
};
const getById = async (id: string) => {
  const userData = await getNewUserData() as UserType[];
  return new Promise((resolve, reject) => {
    const user = userData.find((user) => user.id === id);
    if (user) {
      resolve(user);
    } else {
      reject(`Todo with id ${id} not found`);
    }
  }).catch(() => {
    return null; 
  });
};

const create = async (user: ReqUserType) => {
  const userData = await getNewUserData() as UserType[];
  return new Promise((resolve) => {
    const newUser = {
      id: randomUUID(),
      ...user,
    };
    const newUserData = userData.concat(newUser);
    setNewUserData(newUserData)
    resolve(newUser );
  });
};

const update = async (id: string, data: Partial<UserType>) => {
  const userData = await getNewUserData() as UserType[];
  return new Promise((resolve, reject) => {
    const user = userData.find((user) => user.id === id);
    if (user) {
      const newUser = Object.assign(user, data);
      setNewUserData(
        userData.map((user) => {
          if (user.id === id) {
            return newUser;
          } else {
            return user;
          }
        })
      );

      resolve(newUser);
    }
    reject(`No user with id ${id} found`);
  });
};

const deleteById = async (id: string) => {
  const userData = await getNewUserData() as UserType[];
  return new Promise((resolve, reject) => {
    const newUserData = userData.filter((user) => user.id !== id);

    setNewUserData(newUserData);
    if (userData.length  === newUserData.length) {
      reject(`No todo with id ${id} found`);
    }
    resolve(`Todo deleted successfully`);
  });
};

const userModel = {
  getAll,
  getById,
  create,
  update,
  deleteById,
};
export default userModel;
