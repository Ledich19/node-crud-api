import supertest from "supertest";
import app from "../app.js";
import { UserType } from "../app/types.js";
import { setNewUserData } from "../data/users.js";
import {
  NO_UUID_ID,
  initialUsersData,
  nonExistingId,
  usersInDb,
} from "./test_helper.js";

const api = supertest(app);

describe("Case 1", () => {
  beforeAll(async () => {
    await setNewUserData([]);
  });
  let createdUser: UserType;
  const NEW_USER = {
    username: "new-user-name",
    age: 99,
    hobbies: ["user-hobby"],
  };
  const UPDATE_FOR_USER = {
    username: "new-user-name",
  };
  test("Get all records with a GET api/users request", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toEqual([]);
  });
  test("A new object is created by a POST api/users request", async () => {
    const response = await api
      .post(`/api/users`)
      .send(NEW_USER)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toEqual({ ...NEW_USER, id: response.body.id });
    createdUser = response.body;
  });
  test("With a GET api/user/{userId} request, we try to get the created record by its id", async () => {
    const response = await api
      .get(`/api/users/${createdUser.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body).toEqual({ ...NEW_USER, id: createdUser.id });
  });
  test("We try to update the created record with a PUT api/users/{userId}request", async () => {
  
    const response = await api
      .put(`/api/users/${createdUser.id}`)
      .send(UPDATE_FOR_USER)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.id).toEqual(createdUser.id);
  });
  test("With a DELETE api/users/{userId} request, we delete the created object by id", async () => {
    await api.delete(`/api/users/${createdUser.id}`).expect(204);
  });
  test("With a GET api/users/{userId} request, we are trying to get a deleted object by id", async () => {
    await api
      .get(`/api/users/${createdUser.id}`)
      .expect(404)
      .expect(/user does not exist/);
  });
});
