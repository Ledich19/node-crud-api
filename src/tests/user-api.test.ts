import supertest from "supertest";
import app from "../app.js";

const api = supertest(app);

test("-----notes are returned as json", async () => {
  await api
    .get("/api/users")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

afterAll(async () => {
  console.log("----------------");
});
