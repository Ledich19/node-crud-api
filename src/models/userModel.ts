import { UserType } from "../app/types.js";

const users: UserType[] = [
  {
    id: "1",
    username: "name (string, required)",
    age: 76,
    hobbies: [],
  },
  {
    id: "2",
    username: "name-2",
    age: 23,
    hobbies: ["hobby", "hobby-2"],
  },
];

const getAll = async () => {
  return new Promise((resolve, _) => resolve(users));
};
const getById = async (id: string) => {
  return new Promise((resolve, reject) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      resolve(user);
    } else {
      reject(`Todo with id ${id} not found `);
    }
  });
};

// class Controller {
//   // getting all todos

//   // getting a single todo
//   async getTodo(id) {
//       return new Promise((resolve, reject) => {
//           // get the todo
//           let todo = data.find((todo) => todo.id === parseInt(id));
//           if (todo) {
//               // return the todo
//               resolve(todo);
//           } else {
//               // return an error
//               reject(`Todo with id ${id} not found `);
//           }
//       });
//   }

//   // creating a todo
//   async createTodo(todo) {
//       return new Promise((resolve, _) => {
//           // create a todo, with random id and data sent
//           let newTodo = {
//               id: Math.floor(4 + Math.random() * 10),
//               ...todo,
//           };

//           // return the new created todo
//           resolve(newTodo);
//       });
//   }

//   // updating a todo
//   async updateTodo(id) {
//       return new Promise((resolve, reject) => {
//           // get the todo.
//           let todo = data.find((todo) => todo.id === parseInt(id));
//           // if no todo, return an error
//           if (!todo) {
//               reject(`No todo with id ${id} found`);
//           }
//           //else, update it by setting completed to true
//           todo["completed"] = true;
//           // return the updated todo
//           resolve(todo);
//       });
//   }

//   // deleting a todo
//   async deleteTodo(id) {
//       return new Promise((resolve, reject) => {
//           // get the todo
//           let todo = data.find((todo) => todo.id === parseInt(id));
//           // if no todo, return an error
//           if (!todo) {
//               reject(`No todo with id ${id} found`);
//           }
//           // else, return a success message
//           resolve(`Todo deleted successfully`);
//       });
//   }
// }
const userModel = {
  getAll,
  getById
};
export default userModel;
