import { ReqUserType, UserType } from "../app/types.js";
const { scrypt, randomUUID } = await import("node:crypto");
import usersData from "../data/users.js";

const getAll = async () => {
  return new Promise((resolve, _) => resolve(usersData));
};
const getById = async (id: string) => {
  return new Promise((resolve, reject) => {
    const user = usersData.find((user) => user.id === id);
    if (user) {
      resolve(user);
    } else {
      reject(`Todo with id ${id} not found `);
    }
  });
};

const create = async (user: ReqUserType) => {
  return new Promise((resolve, _) => {
    const newUser = {
      id: randomUUID(),
      ...user,
    };
    console.log(newUser);
    usersData.push(newUser);
    resolve(newUser);
  });
};

const update = async (id: string, data: Partial<UserType>) => {
  return new Promise((resolve, reject) => {
    const user = usersData.find((user) => user.id === id);
    if (user) {
      const newUser = Object.assign(user, data);
      usersData.push(newUser);
      resolve(newUser);
    }
    reject(`No todo with id ${id} found`);
  });
};

const deleteById = async (id: string) => {
  return new Promise((resolve, reject) => {
    const userLen = usersData.length;
    const newUserData = usersData.map((user) => user.id !== id);

    if (usersData.length === newUserData.length) {
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
