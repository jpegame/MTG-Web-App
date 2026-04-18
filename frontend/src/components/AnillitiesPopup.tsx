import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Collapse,
  Fab,
  Popover,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

const API_URL = import.meta.env.API_URL || "http://localhost:3000";

type FloatingPopupProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

type Ability = {
  id: number;
  name: string;
  description: string;
  amount: number;
};

type Abilities = Ability[];

export default function FloatingPopup({
  open,
  onOpen,
  onClose,
}: FloatingPopupProps) {
  const theme = useTheme();
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null
  );
  const [abilities, setAbilities] = useState<Abilities>([]);
  const [expandedAbilityId, setExpandedAbilityId] = useState<number | null>(
    null
  );

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
    onOpen();
  };

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadAbilities = async () => {
      try {
        const response = await fetch(`${API_URL}/ability/`);

        if (!response.ok) return;

        const data: Abilities = await response.json();

        if (!cancelled) {
          setAbilities(data);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };

    void Promise.resolve().then(() => {
      void loadAbilities();
    });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const handleToggleAbility = (abilityId: number) => {
    setExpandedAbilityId((currentId) =>
      currentId === abilityId ? null : abilityId
    );
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="Abrir popup"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          right: { xs: 16, md: 32 },
          bottom: { xs: 16, md: 32 },
          zIndex: 1200,
          boxShadow: `0 18px 40px ${alpha(theme.palette.primary.main, 0.35)}`,
        }}
      >
        <AutoAwesomeIcon />
      </Fab>

      <Popover
        open={open}
        anchorEl={anchorElement}
        disableScrollLock
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "calc(100vw - 32px)", sm: 420 },
              maxWidth: 420,
              maxHeight: { xs: "70vh", sm: 520 },
              mb: 1,
              borderRadius: 4,
              overflow: "hidden",
              backdropFilter: "blur(12px)",
              backgroundColor: alpha(theme.palette.background.paper, 0.88),
              border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 20px 60px rgba(0,0,0,0.14)"
                  : "0 20px 60px rgba(0,0,0,0.45)",
            },
          },
        }}
      >
      {/* HEADER */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <AutoAwesomeIcon sx={{ color: "primary.main" }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Abilities
        </Typography>
      </Box>

      {/* LISTA */}
      <Box
        sx={{
          display: "grid",
          gap: 1,
          p: 1.5,
          maxHeight: { xs: "70vh", sm: 520 },
          overflowY: "auto",

          /* scrollbar */
          "&::-webkit-scrollbar": {
            width: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha(theme.palette.text.primary, 0.22),
            borderRadius: 10,
          },
        }}
      >
        {abilities.map((ability) => {
          const isOpen = expandedAbilityId === ability.id;

          return (
            <Box
              key={ability.id}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                background: isOpen
                  ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)}, ${alpha(theme.palette.primary.main, 0.05)})`
                  : alpha(theme.palette.text.primary, theme.palette.mode === "light" ? 0.03 : 0.05),
                border: "1px solid",
                borderColor: isOpen
                  ? "primary.main"
                  : alpha(theme.palette.divider, 0.9),
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0 10px 25px rgba(0,0,0,0.12)"
                      : "0 10px 25px rgba(0,0,0,0.3)",
                },
              }}
            >
              {/* HEADER DO ITEM */}
              <Box
                onClick={() => handleToggleAbility(ability.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.5,
                  cursor: "pointer",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: isOpen ? "primary.main" : "text.primary",
                  }}
                >
                  {ability.name}
                </Typography>

                <ExpandMoreIcon
                  sx={{
                    transition: "all 0.25s ease",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    color: isOpen ? "primary.main" : "text.secondary",
                  }}
                />
              </Box>

              {/* CONTEÚDO */}
              <Collapse in={isOpen} timeout={250}>
                <Box
                  sx={{
                    px: 2,
                    pb: 2,
                    pt: 0.5,
                    fontSize: 14,
                    color: "text.secondary",
                    lineHeight: 1.5,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                  }}
                >
                  {ability.description}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>

      </Popover>
    </>
  );
}