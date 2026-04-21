import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

import { registerConnectionHandler } from "./handlers/connection.handler";
import { registerRoomHandlers } from "./handlers/room.handler";
import { registerPlayerHandlers } from "./handlers/player.handler";

export const initSocket = (httpServer: HTTPServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173"
        }
    });

    io.on("connection", (socket) => {
        registerRoomHandlers(io, socket);
        registerPlayerHandlers(io, socket);
    });

    registerConnectionHandler(io);

    return io;
};
