export type UserType = {
  id: string;
  username: string;
  age: number;
  hobbies: string[] | [];
};

export type ReqUserType = Omit<UserType, "id">