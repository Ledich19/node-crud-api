export const users = (req, res) => {
  if (url === "/api/users" && method === "GET") {
    res.writeHead(200);
    res.end("persons");
    console.log("yra");
  }
  if (url === "/api/users" && method === "POST") {
    console.log("POST");
  }
  if (url === "/api/users" && method === "PUT") {
    console.log("PUT");
  }
  if (url === "/api/users" && method === "DELETE") {
    console.log("DELETE");
  }
};
