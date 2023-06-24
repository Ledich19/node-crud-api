import { ReqUserType, UserType } from "../app/types.js";
const { randomUUID } = await import("node:crypto");
import usersData, { setNewUserData } from "../data/users.js";

const getAll = async () => {
  return new Promise((resolve) => resolve(usersData));
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
  return new Promise((resolve) => {
    const newUser = {
      id: randomUUID(),
      ...user,
    };
    usersData.push(newUser);
    resolve(newUser);
  });
};

const update = async (id: string, data: Partial<UserType>) => {
  return new Promise((resolve, reject) => {
    const user = usersData.find((user) => user.id === id);
    if (user) {
      const newUser = Object.assign(user, data);
      setNewUserData(
        usersData.map((user) => {
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
  return new Promise((resolve, reject) => {
    const newUserData = usersData.filter((user) => user.id !== id);

    setNewUserData(newUserData);

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
