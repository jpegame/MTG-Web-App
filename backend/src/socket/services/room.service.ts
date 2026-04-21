import { Room } from "../schemas/room";
import { Player } from "../schemas/player";

class RoomService {
    private rooms = new Map<string, Room>();

    createOrGetRoom(roomId: string): Room {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, {
                id: roomId,
                players: new Map()
            });
        }

        return this.rooms.get(roomId)!;
    }

    addPlayer(roomId: string, player: Player) {
        const room = this.createOrGetRoom(roomId);
        room.players.set(player.id, player);
    }

    removePlayer(playerId: string) {
        for (const room of this.rooms.values()) {
            if (room.players.has(playerId)) {
                room.players.delete(playerId);
            }
        }
    }

    updatePlayerHP(roomId: string, playerId: string, hp: number) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        const player = room.players.get(playerId);
        if (!player) return;

        player.health = hp;
    }

    getPlayers(roomId: string) {
        return this.rooms.get(roomId)?.players ?? new Map();
    }
}

export const roomService = new RoomService();
