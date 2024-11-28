import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleOpenNavMenu}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Discord Bot Directory
        </Typography>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          <MenuItem onClick={handleCloseNavMenu} component={Link} to="/">Home</MenuItem>
          {user ? (
            <>
              <MenuItem onClick={handleCloseNavMenu} component={Link} to="/profile">Profile</MenuItem>
              <MenuItem onClick={handleCloseNavMenu} component={Link} to="/submit">Submit Bot</MenuItem>
              {user.isAdmin && <MenuItem onClick={handleCloseNavMenu} component={Link} to="/admin">Admin Panel</MenuItem>}
              <MenuItem onClick={() => { handleCloseNavMenu(); logout(); }}>Logout</MenuItem>
            </>
          ) : (
            <MenuItem onClick={handleCloseNavMenu} component={Link} to="/login">Login</MenuItem>
          )}
        </Menu>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button component={Link} to="/" sx={{ my: 1, mx: 1.5, color: 'white', display: 'block' }} >Home</Button>
          {user && (
            <>
              <Button component={Link} to="/profile" sx={{ my: 1, mx: 1.5, color: 'white', display: 'block' }}>Profile</Button>
              <Button component={Link} to="/submit" sx={{ my: 1, mx: 1.5, color: 'white', display: 'block' }}>Submit Bot</Button>
              {user.isAdmin && <Button component={Link} to="/admin" sx={{ my: 1, mx: 1.5, color: 'white', display: 'block' }}>Admin Panel</Button>}
              <Button onClick={logout} sx={{ my: 1, mx: 1.5, color: 'white', display: 'block' }}>Logout</Button>
            </>
          )}
          {!user && <Button component={Link} to="/login" sx={{ my: 1, mx: 1.5, color: 'white', display: 'block' }}>Login</Button>}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
```