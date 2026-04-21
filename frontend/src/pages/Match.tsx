import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket";
import type { Player } from "../types/player";

import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Stack,
    IconButton,
    Tooltip
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function Match() {
    const { roomId } = useParams();
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        if (!roomId) return;

        socket.connect();

        socket.emit("join_room", {
            roomId,
            playerName: "Player_" + Math.floor(Math.random() * 1000)
        });

        socket.on("room_update", (players: Player[]) => {
            setPlayers(players);
        });

        return () => {
            socket.off("room_update");
        };
    }, [roomId]);

    const updateHP = (amount: number) => {
        const me = players.find((p) => p.id === socket.id);
        if (!me) return;

        socket.emit("update_hp", {
            roomId,
            hp: me.health + amount
        });
    };

    const copyLink = async () => {
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
    };

    return (
        <Container maxWidth="md">
            <Stack spacing={3} mt={5}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h5">Room: {roomId}</Typography>

                    <Tooltip title="Copy room link">
                        <IconButton onClick={copyLink}>
                            <ContentCopyIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Stack direction="row" spacing={2} flexWrap="wrap">
                    {players.map((p) => (
                        <Card
                            key={p.id}
                            sx={{
                                border:
                                    p.id === socket.id
                                        ? "2px solid green"
                                        : "1px solid #ccc",
                                minWidth: 150
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6">{p.name}</Typography>
                                <Typography>HP: {p.health}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>

                <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={() => updateHP(-1)}>
                        -1 HP
                    </Button>
                    <Button variant="outlined" onClick={() => updateHP(1)}>
                        +1 HP
                    </Button>
                </Stack>
            </Stack>
        </Container>
    );
}
