import { UserType } from "../app/types.js";
import userModel from "../models/userModel.js";

export const NO_UUID_ID = "148f8be7-113-460-bb7-53be978c18bb";

export const initialUsersData: UserType[] = [
  {
    id: "148f8be7-1131-460d-bb78-53be978c18bb",
    username: "name-1",
    age: 76,
    hobbies: [],
  },
  {
    id: "fd197a49-e76a-4532-be57-3e56ef059880",
    username: "name-2",
    age: 23,
    hobbies: ["hobby", "hobby-2"],
  },
];

export const usersInDb = async (): Promise<UserType[]> => {
  const arr = (await userModel.getAll()) as UserType[];
  return [...arr]
};

export const nonExistingId = async () => {
  const user = (await userModel.create({
    username: "no-exist-name",
    age: 0,
    hobbies: ["no-exist-hobby"],
  })) as UserType;
  await userModel.deleteById(user.id);
  return user.id;
};
