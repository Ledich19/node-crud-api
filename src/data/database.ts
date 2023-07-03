import http from "node:http";
import { UserType } from "../app/types.js";
import { getDataFromRequest } from "../utils/healper.js";

let database: UserType[] = [
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

let dbServer: http.Server | null = null; // Хранит ссылку на сервер базы данных

const startDatabaseServer = (port: number) => {
  return new Promise<void>((resolve, reject) => {
    dbServer = http.createServer(async (req, res) => {
      const url = req.url;
      const method = req.method;
      if (url?.match(/\/db\/get/) && method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(database));
      } else if (url?.match(/\/db\/post/) && method === "POST") {
        const body = await getDataFromRequest(req);

        database = JSON.parse(body as string) as UserType[];

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Data updated successfully" }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `Sorry, page does not exist` }));
      }
    });

    dbServer.listen(port, () => {
      console.log(`Database server is listening on port ${port}`);
      resolve(); // Разрешаем промис после запуска сервера
    });

    dbServer.on("error", (error) => {
      reject(error); // Отклоняем промис в случае ошибки запуска сервера
    });
  });
};

const stopDatabaseServer = () => {
  return new Promise((resolve, reject) => {
    if (dbServer) {
      dbServer.close(() => {
        console.log("Database server stopped");
        resolve(true);
      });
    } else {
      reject(new Error("Database server is not running"));
    }
  });
};

export { startDatabaseServer, stopDatabaseServer };