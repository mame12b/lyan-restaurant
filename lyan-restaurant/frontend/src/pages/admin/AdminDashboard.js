import React, { useState } from "react";
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Box, 
  CssBaseline,
  IconButton,
 // Divider,
  useMediaQuery,
  useTheme,
  CircularProgress
} from "@mui/material";
import { 
  People, 
  ShoppingCart, 
  Settings, 
  Logout, 
  Menu,
  ChevronLeft,
  AccountCircle,
 
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const drawerWidth = 240;

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Typography variant="h6" sx={{ p: 4 }}>Please log in to access the dashboard</Typography>;
  }

  return (
    <Box sx={{ display: "flex", minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Collapsible Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: open ? drawerWidth : 56,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 56,
            boxSizing: 'border-box',
            backgroundColor: '#1976d2',
            color: '#fff',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            minHeight: 64
          }}>
            {open ? (
              <>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Admin Dashboard
                </Typography>
                <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
                  <ChevronLeft />
                </IconButton>
              </>
            ) : (
              <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
                <Menu />
              </IconButton>
            )}
          </Box>

          {/* Admin Profile Section */}
          {open && (
            <Box sx={{ 
              p: 2,
              textAlign: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.2)'
            }}>
              <AccountCircle sx={{ fontSize: 64, color: '#fff', mb: 1 }} />
              <Typography variant="subtitle1">{user.name}</Typography>
              <Typography variant="body2">{user.email}</Typography>
              <Typography variant="caption">Role: {user.role}</Typography>
            </Box>
          )}

          {/* Navigation Items */}
          <List sx={{ flexGrow: 1 }}>
            <ListItem 
              button 
              component={Link} 
              to="/admin/users"
              sx={{ 
                justifyContent: open ? 'initial' : 'center',
                px: 2.5
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto' }}>
                <People sx={{ color: "#fff" }} />
              </ListItemIcon>
              {open && <ListItemText primary="Manage Users" />}
            </ListItem>

            <ListItem 
              button 
              component={Link} 
              to="/admin/orders"
              sx={{ 
                justifyContent: open ? 'initial' : 'center',
                px: 2.5
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto' }}>
                <ShoppingCart sx={{ color: "#fff" }} />
              </ListItemIcon>
              {open && <ListItemText primary="Manage Orders" />}
            </ListItem>

            <ListItem 
              button 
              component={Link} 
              to="/admin/settings"
              sx={{ 
                justifyContent: open ? 'initial' : 'center',
                px: 2.5
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto' }}>
                <Settings sx={{ color: "#fff" }} />
              </ListItemIcon>
              {open && <ListItemText primary="Settings" />}
            </ListItem>
          </List>

          {/* Footer Section with Logout */}
          <Box sx={{ 
            mt: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}>
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&:hover': { 
                  backgroundColor: '#FF0000',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto' }}>
                <Logout sx={{ color: "#fff" }} />
              </ListItemIcon>
              {open && <ListItemText primary="Logout" />}
            </ListItem>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: open ? `${drawerWidth}px` : '56px',
          width: `calc(100% - ${open ? drawerWidth : 56}px)`,
          minHeight: '100vh'
        }}
      >
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4
        }}>
          <Typography variant="h4">
            Welcome, {user?.name || "Admin"} 🛠️
          </Typography>
          {/* <IconButton
            onClick={handleLogout}
            color="error"
            sx={{
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.2)' }
            }}
          >
            <Logout />
          </IconButton> */}
        </Box>
        
        <Typography variant="body1">
          Manage users, orders, and system settings.
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminDashboard;