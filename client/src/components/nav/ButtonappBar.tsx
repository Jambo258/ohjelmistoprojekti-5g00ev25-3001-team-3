import { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'

import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

import { AuthContext } from '../shared/auth'

export default function ButtonappBar() {
  const auth = useContext(AuthContext)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton component={NavLink} to="/">
            <Box
              component="img"
              sx={{
                height: 55
              }}
              alt="PricePal"
              src="/pricepalLogo.png"
            />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          {auth.isLoggedIn && auth.role === 'admin' && (
            <MenuItem
              component={NavLink}
              to="/adminpage"
              data-testid="admin-page"
            >
              <AdminPanelSettingsIcon />
            </MenuItem>
          )}
          {auth.isLoggedIn && (
            <MenuItem
              component={NavLink}
              to="/userfavorites"
              data-testid="favorites-page"
            >
              <FavoriteBorderIcon />
            </MenuItem>
          )}
          {auth.isLoggedIn && (
            <MenuItem
              component={NavLink}
              to="/profile"
              data-testid="profile-page"
            >
              <PersonIcon />
            </MenuItem>
          )}
          {auth.isLoggedIn && (
            <Button
              onClick={auth.logout}
              role="button"
              color="inherit"
              data-testid="logout-button"
            >
              <LogoutIcon />
            </Button>
          )}
          {!auth.isLoggedIn && (
            <MenuItem component={NavLink} to="/login" data-testid="login-page">
              <LoginIcon />
            </MenuItem>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
