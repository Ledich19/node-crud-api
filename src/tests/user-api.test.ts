import supertest from "supertest";
import app from "../app.js";
import { UserType } from "../app/types.js";
import { setNewUserData } from "../data/users.js";
import { initialUsersData, usersInDb } from "./test_helper.js";

const api = supertest(app);

//   {
//     id: "148f8be7-1131-460d-bb78-53be978c18bb",
//     username: "name-1",
//     age: 76,
//     hobbies: [],
//   },
//   {
//     id: "fd197a49-e76a-4532-be57-3e56ef059880",
//     username: "name-2",
//     age: 23,
//     hobbies: ["hobby", "hobby-2"],
//   },
// ];
beforeEach(async () => {
  console.log("-----beforeEach---------");
  setNewUserData(initialUsersData);
});

describe("User API GET", () => {
  test("GET users: users are returned as json with code 20", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("GET users: there are appropriate amount users", async () => {
    const response = await api.get("/api/users");
    expect(response.body).toHaveLength(initialUsersData.length);
  });
  test("GET users: returned correct users", async () => {
    const userId = ((await usersInDb()) as UserType[])[0].id;
    const response = await api.get("/api/users");
    const contents = response.body.map((user: UserType) => user.id);
    expect(contents).toContain(userId);
  });
  test("GET by id: are returned as json with code 200", async () => {
    const userInDbId = ((await usersInDb()) as UserType[])[0].id;
    await api
      .get(`/api/users/${userInDbId}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("GET by id: returned correct user", async () => {
    const userInDbId = ((await usersInDb()) as UserType[])[0].id;
    const response = await api.get(`/api/users/${userInDbId}`);
    const content = response.body;
    expect(content.id).toContain(userInDbId);
  });
});

describe("User API POST", () => {
  test("a valid user can be added", async () => {
    const newUser = {
      username: "new-user-name",
      age: 99,
      hobbies: ["user-hobby"],
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const userInDb = await usersInDb();
    const contents = userInDb.map((user: UserType) => user.username);
    expect(userInDb).toHaveLength(initialUsersData.length + 1);
    expect(contents).toContain("new-user-name");
  });
  test("request can be added and return new user", async () => {
    const newUser = {
      username: "new-user-name-for-return",
      age: 99,
      hobbies: ["user-hobby"],
    };
    const response = await api
      .post(`/api/users`)
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.username).toContain(newUser.username);
  });
  test("note without username is not added (status 400)", async () => {
    const userInDbStart = await usersInDb();
    const newUser = {
      age: 99,
      hobbies: ["user-hobby"],
    };
    await api.post("/api/users").send(newUser).expect(400);
    const userInDb = await usersInDb();
    expect(userInDb).toHaveLength(userInDbStart.length);
  });
  test("note without age is not added (status 400)", async () => {
    const userInDbStart = await usersInDb();
    const newUser = {
      username: "new-user-name",
      hobbies: ["user-hobby"],
    };
    await api.post("/api/users").send(newUser).expect(400);
    const userInDb = await usersInDb();
    expect(userInDb).toHaveLength(userInDbStart.length);
  });
  test("note hobbies content is not added (status 400)", async () => {
    const userInDbStart = await usersInDb();
    const newUser = {
      age: 99,
      username: "new-user-name",
    };
    await api.post("/api/users").send(newUser).expect(400);
    const userInDb = await usersInDb();
    expect(userInDb).toHaveLength(userInDbStart.length);
  });
});

describe("User API PUT", () => {});
describe("User API DELETE", () => {});

afterAll(async () => {
  console.log("----------------");
});

