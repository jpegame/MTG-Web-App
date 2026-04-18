import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

type Props = {
  toggleTheme: () => void;
  mode: "light" | "dark";
};

export default function Navbar({ toggleTheme, mode }: Props) {
  return (
    <AppBar position="static" sx={{ maxHeight: "90px" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/">
            <img src="/assets/MTG_White.png" alt="MTG Logo" style={{ height: 70, marginRight: 16, cursor: "pointer" }}/>
          </Link>
        </Typography>

        <Button color="inherit" component={Link} to="/">
          Home
        </Button>

        <Button color="inherit" component={Link} to="/habilidades">
          Habilidades
        </Button>
        <IconButton color="inherit" onClick={toggleTheme}>
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
