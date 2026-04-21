import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

type Props = {
  toggleTheme: () => void;
  mode: "light" | "dark";
};

export default function Navbar({ toggleTheme, mode }: Props) {
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState("");

  const navigate = useNavigate();

  const generateRoom = () => {
    const id = Math.random().toString(36).substring(2, 8);
    navigate(`/partida/${id}`);
    setOpen(false);
  };

  const joinRoom = () => {
    if (!roomId) return;
    navigate(`/partida/${roomId}`);
    setOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ maxHeight: "90px" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/">
              <img
                src="/assets/MTG_White.png"
                alt="MTG Logo"
                style={{ height: 70, marginRight: 16, cursor: "pointer" }}
              />
            </Link>
          </Typography>

          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          <Button color="inherit" component={Link} to="/habilidades">
            Habilidades
          </Button>

          <Button color="inherit" onClick={() => setOpen(true)}>
            Jogar
          </Button>

          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Jogar Multiplayer</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Button variant="contained" onClick={generateRoom}>
              Criar sala com ID aleatório
            </Button>

            <TextField
              label="ID da sala"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={joinRoom} variant="outlined">
            Entrar na sala
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
