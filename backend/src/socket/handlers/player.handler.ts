import { Server, Socket } from "socket.io";
import { roomService } from "../services/room.service";

export const registerPlayerHandlers = (io: Server, socket: Socket) => {
  socket.on("update_hp", ({ roomId, hp }) => {
    roomService.updatePlayerHP(roomId, socket.id, hp);

    const players = [...roomService.getPlayers(roomId).values()];

    io.to(roomId).emit("room_update", players);
  });
};
