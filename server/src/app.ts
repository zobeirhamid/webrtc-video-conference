import { Server as HttpServer } from "http";
import { Server, ServerOptions, Socket } from "socket.io";

const rooms: { [key: string]: Socket }[] = [];

export function createApplication(
  httpServer: HttpServer,
  serverOptions: Partial<ServerOptions> = {}
) {
  const io = new Server(httpServer, serverOptions);
  io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    next();
  });

  io.on("connection", (socket) => {
    const username = socket.handshake.auth.username;

    let currentRoom = rooms[rooms.length - 1];
    if (!currentRoom || Object.keys(currentRoom).length > 3) {
      currentRoom = {};
      rooms.push(currentRoom);
    }

    currentRoom[socket.id] = socket;
    const room = ["room", rooms.length].join("-");

    socket.join(room);

    socket.to(room).emit("newCaller", socket.id);

    socket.on("signal", (data) => {
      if (currentRoom[data.socketId]) {
        currentRoom[data.socketId].emit("signal", {
          socketId: socket.id,
          signal: data.signal,
        });
      }
    });

    socket.on("sendMessage", (message: string) => {
      socket.to(room).emit("receiveMessage", { message, username });
    });

    socket.on("disconnect", () => {
      socket.to(room).emit("removePeer", socket.id);
      delete currentRoom[socket.id];
    });

    socket.on("receivedCall", (receiverSocketId) => {
      currentRoom[receiverSocketId].emit("receivedCall", socket.id);
    });
  });
}
