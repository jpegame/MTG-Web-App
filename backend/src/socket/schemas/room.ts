import { Player } from "./player";

export type Room = {
    id: string;
    players: Map<string, Player>;
};
