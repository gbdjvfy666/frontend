import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  shadows: [    'none', // shadow level 0
    '0px 1px 2px rgba(0, 0, 0, 0.2)',],
  palette: {
    primary: {
      main: "#4361ee",
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 400,
    },
  },
});
