import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Home from './pages/Home';
import Login from './pages/Login';
import BotSubmission from './pages/BotSubmission';
import AdminPanel from './pages/AdminPanel';
import BotPage from './pages/BotPage';
import Profile from './pages/Profile';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/submit" element={<BotSubmission />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/bot/:botId" element={<BotPage />} />
          <Route path="/profile" element={<Profile />} />
          {/ Add other routes as needed /}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
```