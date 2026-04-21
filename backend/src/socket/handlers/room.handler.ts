import { Server, Socket } from "socket.io";
import { roomService } from "../services/room.service";

export const registerRoomHandlers = (io: Server, socket: Socket) => {
    socket.on("join_room", ({ roomId, playerName }) => {
        socket.join(roomId);

        roomService.addPlayer(roomId, {
            id: socket.id,
            name: playerName,
            health: 20
        });

        const players = [...roomService.getPlayers(roomId).values()];

        io.to(roomId).emit("room_update", players);
    });
};
