import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#007bff', 
      contrastText: '#fff',
    },
    secondary: {
      main: '#6c757d', 
      contrastText: '#fff',
    },
    error: {
      main: '#dc3545',
    },
    background: {
      default: '#121212',
      paper: '#212121',
    },
    text: {
      primary: '#fff',
      secondary: '#999',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default darkTheme;

```