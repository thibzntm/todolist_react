import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const NavBar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const routes = token
    ? [
        { label: 'Projet', path: '/projects' },
        { label: 'Task', path: '/tasks' },
        { label: 'Profil', path: '/profile' },
      ]
    : [
        { label: 'Accueil', path: '/login' },
        { label: 'Connexion', path: '/login' },
        { label: 'Inscription', path: '/register' },
      ];

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#283593', // Bleu sombre et élégant
        color: '#ffffff',
        paddingX: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo / Titre */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/tasks')}
        >
          Task Manager
        </Typography>

        {/* Icône du menu hamburger alignée à droite */}
        <Box sx={{ marginLeft: 'auto' }}>
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          {/* Menu déroulant */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: '#283593', // Conserver le thème de la barre
                color: '#ffffff',
              },
            }}
          >
            {routes.map((route) => (
              <MenuItem
                key={route.path}
                onClick={() => handleNavigation(route.path)}
                sx={{
                  fontSize: '14px',
                  '&:hover': {
                    backgroundColor: '#3949ab', // Légèrement plus clair au survol
                  },
                }}
              >
                {route.label}
              </MenuItem>
            ))}
            {token && (
              <MenuItem
                onClick={handleLogout}
                sx={{
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  '&:hover': {
                    backgroundColor: '#3949ab',
                  },
                }}
              >
                <LogoutIcon fontSize="small" />
                Déconnexion
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
