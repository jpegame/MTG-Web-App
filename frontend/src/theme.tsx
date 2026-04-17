import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#ff5722",
        light: "#ff8a50",
        dark: "#c41c00",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff7043",
      },
      background: {
        default: mode === "light" ? "#fff5f2" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
      },
    },

    typography: {
      fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
      h4: {
        fontWeight: 600,
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },

    components: {
      /* 🔥 Paper (MAIN UPGRADE) */
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            padding: "16px",
            boxShadow:
              mode === "light"
                ? "0 4px 20px rgba(0,0,0,0.05)"
                : "0 4px 20px rgba(0,0,0,0.5)",
            backgroundImage: "none",
          },
        },
      },

      /* 🔘 Buttons */
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: "8px 18px",
            fontWeight: 500,
          },
        },
      },

      /* 🧾 Text fields */
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor:
              mode === "light" ? "#ffffff" : "#2a2a2a",
          },
        },
      },

      /* 🃏 Cards */
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              mode === "light"
                ? "0 6px 24px rgba(0,0,0,0.06)"
                : "0 6px 24px rgba(0,0,0,0.6)",
          },
        },
      },

      /* 📦 Container spacing */
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingTop: "24px",
            paddingBottom: "24px",
          },
        },
      },

      /* 🔝 AppBar (refined gradient) */
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            background:
              mode === "light"
                ? "linear-gradient(90deg, #ff5722, #ff7043)"
                : "#1e1e1e",
            boxShadow: "none",
          },
        },
      },

      /* ➖ Divider */
      MuiDivider: {
        styleOverrides: {
          root: {
            margin: "16px 0",
            opacity: 0.6,
          },
        },
      },
    },
  });
