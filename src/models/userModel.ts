import { ReqUserType, UserType } from "../app/types.js";
import { randomUUID } from "node:crypto";
import { getNewUserData, setNewUserData } from "../data/users.js";

const getAll = async () => {
  const userData = getNewUserData();
  return new Promise((resolve) => resolve(userData));
};
const getById = async (id: string) => {
  return new Promise((resolve, reject) => {
    const user = getNewUserData().find((user) => user.id === id);
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
  return new Promise((resolve) => {
    const newUser = {
      id: randomUUID(),
      ...user,
    };
    getNewUserData().push(newUser);
    resolve(newUser);
  });
};

const update = async (id: string, data: Partial<UserType>) => {
  return new Promise((resolve, reject) => {
    const user = getNewUserData().find((user) => user.id === id);
    if (user) {
      const newUser = Object.assign(user, data);
      setNewUserData(
        getNewUserData().map((user) => {
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
    const userData = getNewUserData();
    const newUserData = userData.filter((user) => user.id !== id);

    setNewUserData(newUserData);
    if (userData.length === newUserData.length) {
      reject(`No todo with id ${id} found`);
    }
    console.log("141");
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
