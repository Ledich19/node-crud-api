import supertest from "supertest";
import app from "../app.js";
import { UserType } from "../app/types.js";
import { setNewUserData } from "../data/users.js";
import { NO_UUID_ID, initialUsersData, nonExistingId, usersInDb } from "./test_helper.js";

const api = supertest(app);

beforeEach(async () => {
  await setNewUserData(initialUsersData);
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
    const usersAtStartLen = (await usersInDb()).length;
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
    const names = userInDb.map((user: UserType) => user.username);
    expect(userInDb).toHaveLength(usersAtStartLen + 1);
    expect(names).toContain("new-user-name");
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

// describe("User API PUT", () => {
// test("return error 400  if id no uuid", async () => {});
// test("return error 404  if user don't exist", async () => {});
// });

describe("User API DELETE", () => {
  beforeAll(() => {
    setNewUserData(initialUsersData);
  });
  test("DELETE: a note can be deleted return code (204)", async () => {
    const usersAtStart = await usersInDb();
    const userToDelete = usersAtStart[0];
    await api.delete(`/api/users/${userToDelete.id}`).expect(204);
    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(initialUsersData.length - 1);
    const usersId = usersAtEnd.map((user) => user.id);
    expect(usersId).not.toContain(userToDelete.id);
  });
  test("DELETE: return error 400  if id no uuid", async () => {
    const usersAtStart = await usersInDb();
    const usersAtStartLen = usersAtStart.length;
    await api.delete(`/api/users/${NO_UUID_ID}`).expect(400);
    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStartLen);
    const usersId = usersAtEnd.map((user) => user.id);
    usersAtStart.forEach((user) => {
      expect(usersId).toContain(user.id);
    });
  });
  test("DELETE: return error 404  if user don't exist", async () => {
    const usersAtStart = await usersInDb();
    const usersAtStartLen = usersAtStart.length;
    const notExistId = await nonExistingId();
    await api.delete(`/api/users/${notExistId}`).expect(404);
    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStartLen);
    const usersId = usersAtEnd.map((user) => user.id);
    usersAtStart.forEach((user) => {
      expect(usersId).toContain(user.id);
    });
  });
});

afterAll(async () => {
  console.log("----------------");
});
