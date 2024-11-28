import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

const Header = () => {
  return (
    <>
      <Navigation />
    </>
  );
};

export default Header;
```