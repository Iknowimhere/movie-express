const dotenv = require("dotenv");
dotenv.config({
  path: ".//.env",
});
const http = require("http");
const app = require("./app");
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
});

// console.log(process.env);
