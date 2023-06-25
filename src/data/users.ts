import { UserType } from "../app/types.js";

let usersData: UserType[] = [
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

export const setNewUserData = (arr: UserType[]) => {
usersData = arr
}

export default usersData