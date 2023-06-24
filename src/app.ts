
import { IncomingMessage, ServerResponse } from "http";
import usersController from "./controllers/userController.js";

const app = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  try {
    if (url?.match(/\/api\/users/)) {
      usersController(req, res);
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: `Sorry, page does not exist` }));
    }
  } catch (error) {
    if (error instanceof Error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  }
};

export default app