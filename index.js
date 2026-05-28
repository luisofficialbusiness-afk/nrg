// Credit Interstellar
import http from "node:http";
import path from "node:path";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import chalk from "chalk";
import express from "express";
import basicAuth from "express-basic-auth";
import config from "./config.js";

console.log(chalk.yellow("🚀 Starting Server..."));

const __dirname = process.cwd();
const server = http.createServer();
const app = express();
const PORT = 8080;
const aiRoute = require('./ai-route');

// Authentication Logic
if (config.challenge !== false) {
  console.log(chalk.green("🔒 Password protection is enabled!!"));
  app.use(basicAuth({ users: config.users, challenge: true }));
}

app.get("/check", (req, res) => res.status(200).send("OK"));

// Serve static assets automatically
app.use(
  express.static(path.join(__dirname, "static"), {
    extensions: ["html", "htm"],
    index: "index.html",
  }),
);

app.use('/', aiRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "static", "404.html"));
});

// Express handles all standard HTTP requests
server.on("request", (req, res) => {
  app(req, res);
});

// Wisp handles WebSocket upgrades on /wisp/
server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

server.on("listening", () => {
  console.log(chalk.green(`🌍 Server is running on http://localhost:${PORT}`));
});

server.listen(PORT);
