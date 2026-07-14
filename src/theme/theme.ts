import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const baseTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#12372A",
      light: "#3E5C4F",
      dark: "#0A211A",
      contrastText: "#FBF8F1",
    },
    secondary: {
      main: "#D97B29",
      light: "#E8A05B",
      dark: "#A85E1C",
      contrastText: "#FBF8F1",
    },
    background: {
      default: "#F3F1E9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1B231F",
      secondary: "#5B6760",
    },
    divider: "rgba(18, 55, 42, 0.10)",
    success: { main: "#2E7D32" },
    warning: { main: "#D97B29" },
    error: { main: "#C0392B" },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 800,
      letterSpacing: -0.5,
    },
    h2: {
      fontFamily: '"Sora", sans-serif',
      fontWeight: 800,
      letterSpacing: -0.5,
    },
    h3: { fontFamily: '"Sora", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Sora", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Sora", sans-serif', fontWeight: 700 },
    h6: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
    button: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 700,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 20,
          paddingBlock: 9,
        },
        containedPrimary: {
          backgroundImage: "linear-gradient(135deg, #163F30 0%, #0A211A 100%)",
          boxShadow: "0 8px 20px rgba(18, 55, 42, 0.28)",
          "&:hover": {
            backgroundImage:
              "linear-gradient(135deg, #1B4C3A 0%, #0D291F 100%)",
            boxShadow: "0 10px 24px rgba(18, 55, 42, 0.34)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 20 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage:
            "linear-gradient(120deg, #0F2E22 0%, #16402F 60%, #1E5240 100%)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
});

export const theme = responsiveFontSizes(baseTheme);
