import { Server, Socket } from "socket.io";
import { roomService } from "../services/room.service";

export const registerConnectionHandler = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      roomService.removePlayer(socket.id);
    });
  });
};
