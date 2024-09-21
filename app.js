import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  //we need accept back-end location we sent from front-end
  socket.on("send-location", (data) => {
    // we accepted that location now sending everyone that particular location
    io.emit("receive-location", { id: socket.id, ...data });
  });
  
  socket.on("disconnect", () => {
    io.emit("user-disconnected",socket.id);
    console.log('Disconnected....')
  });
  console.log("Connected....");
});

app.get("/", (req, res) => {
  // res.status(200).send(`<h1>Server Working</h1>`);
  res.render("index");
});

server.listen(3000, () => {
  console.log("App has been started successfully!");
});
