import express from "express";
import http from "http";
import socket from "socket.io";
import cors from "cors";
// local url
import { protect } from "./middleware/auth";

const app = express();
// initialise express server
const server = http.createServer(app);

// built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());

// initialise cors
app.use(cors());

const { Server } = socket;

// initialise SocketIo
const io = new Server(server, {
  cors: { origin: "*" },
});

// create an object to store connectedUsers
const connectedUsers: Object = {};

io.use(async (socket, next) => {
  // io middleware
  const clientName = socket.handshake.headers.authorization;
  // check connected clientname from frontend (React)
  if (clientName === undefined || clientName === null) return;

  // return clientName as name
  const name = await protect(clientName, socket);
  if (name) {
    // put clientName into connectedUsers Object
    connectedUsers[name] = socket;
  } else {
    return;
  }
  await next();
}).on("connection", (socket) => {
  console.log("socket connected", socket.id);
  socket.emit("notification", "connected");
});

// send notification func
export const sendNotification = (friendName: string, name: string) => {
  if (!connectedUsers[friendName]) {
    return false;
  }
  io.to(connectedUsers[friendName].id).emit(
    "notification",
    `${name} send u notification`
  );
  return true;
};

// a http route uses to receive post request that user want to send the other user request
app.post("/notification", async (req, res) => {
  const { name, friendName } = req.body;
  const result = sendNotification(friendName, name);
  if (result) {
    res.send("notification successfully");
  } else {
    res.send("notification failed");
  }
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
