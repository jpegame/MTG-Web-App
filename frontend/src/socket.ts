import { io } from "socket.io-client";

const API_URL = import.meta.env.API_URL || "http://localhost:3000";

export const socket = io(API_URL, {
  autoConnect: false
});
