import React, { useState } from "react";
import { 
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  Typography, Box, CssBaseline, IconButton, 
  useMediaQuery, useTheme, CircularProgress, Chip
} from "@mui/material";
import { 
  People, 
  ShoppingCart, 
  Settings, 
  Logout, 
  ChevronLeft,
  AccountCircle, 
  Restaurant, 
  LocationOn,
  MenuBook as MenuBookIcon,  // Renamed here
  AddBusiness
} from "@mui/icons-material";  // Removed Menu import
import BackButton from '../../components/BackButton';
import { Link, useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Branches from './Branches';
import Menu from "./Menu";
import RestaurantList from "./RestaurantList";
import RestaurantDetails from "./RestaurantDetails";
import Users from "./User";
import Orders from "./Orders";
import SettingsPanel from "./Settings";
const drawerWidth = 240;

const navigationItems = [
  { path: "/admin/users", label: "Manage Users", icon: <People />, roles: ['super-admin'] },
  { path: "/admin/orders", label: "Manage Orders", icon: <ShoppingCart />, roles: ['admin', 'super-admin'] },
  { path: "/admin/branches", label: "Manage Branches", icon: <LocationOn />, roles: ['admin', 'super-admin'] },
  { path: "/admin/menu", label: "Menu Management", icon: <MenuBookIcon />, roles: ['admin', 'super-admin', 'manager'] },
  { path: "/admin/restaurants", label: "Restaurant List", icon: <Restaurant />, roles: ['admin', 'super-admin'] },
  { path: "/admin/settings", label: "Settings", icon: <Settings />, roles: ['admin', 'super-admin'] },
];

const PageWrapper = ({ children }) => (
  <Box sx={{ position: 'relative', minHeight: '100vh', p: 3 }}>
    <BackButton 
      sx={{ 
        position: 'absolute', 
        top: 16, 
        right: 16, 
        zIndex: 1,
        backgroundColor: 'background.paper',
        boxShadow: 1,
        '&:hover': { backgroundColor: 'action.hover' }
      }} 
    />
    <Box sx={{ pt: 6 }}>
      {children}
    </Box>
  </Box>
);


const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => setOpen(!open);
  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) return <CenteredSpinner />;
  if (!user) return <UnauthorizedMessage />;

  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    
    <Box sx={{ display: "flex", minHeight: '100vh' }}>
      <CssBaseline />
      
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={() => setOpen(false)}
        sx={drawerStyles(open, drawerWidth, theme)}
      >
        <DashboardHeader open={open} handleDrawerToggle={handleDrawerToggle} />
        <UserProfileSection open={open} user={user} />
        
        <List sx={{ flexGrow: 1 }}>
          {filteredNavItems.map((item) => (
            <NavItem 
              key={item.path}
              open={open}
              path={item.path}
              label={item.label}
              icon={item.icon}
            />
          ))}
          <QuickActionButton 
            open={open}
            label="Add New Branch"
            icon={<AddBusiness />}
            onClick={() => navigate('/admin/branches/new')}
          />
        </List>

        <LogoutSection open={open} handleLogout={handleLogout} />
      </Drawer>

      <Box component="main" sx={mainContentStyles(open, drawerWidth)}>
        <Routes>
          <Route path="users" element={<PageWrapper><Users /></PageWrapper>} />
          <Route path="orders" element={<PageWrapper><Orders /></PageWrapper>} />
          <Route path="branches/*" element={<PageWrapper><Branches /></PageWrapper>} />
          <Route path="menu" element={<PageWrapper><Menu /></PageWrapper>} />
          <Route path="restaurants" element={<PageWrapper><RestaurantList /></PageWrapper>} />
          <Route path="restaurants/:id" element={<PageWrapper><RestaurantDetails /></PageWrapper>} />
          <Route path="settings" element={<PageWrapper><SettingsPanel /></PageWrapper>} />
          <Route index element={
            <Box sx={{ p: 3 }}>
              {/* <BackButton sx={{ mb: 2 }} /> */}
              <DashboardWelcome user={user} />
            </Box>
          } />
          
        </Routes>
      </Box>
    </Box>
  );
};

// Styled Components
const drawerStyles = (open, width, theme) => ({
  width: open ? width : 56,
  '& .MuiDrawer-paper': {
    width: open ? width : 56,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
});
const mainContentStyles = (open, width) => ({
  flexGrow: 1,
  p: 3,
  marginLeft: open ? `${width}px` : '56px',
  width: `calc(100% - ${open ? width : 56}px)`,
  minHeight: '100vh'
});

// Sub-components
const CenteredSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
    <CircularProgress />
  </Box>
);

const UnauthorizedMessage = () => (
  <Typography variant="h6" sx={{ p: 4 }}>
    Please log in to access the dashboard
  </Typography>
);

const DashboardHeader = ({ open, handleDrawerToggle }) => (
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
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'inherit' }}>
          <ChevronLeft />
        </IconButton>
      </>
    ) : (
      <IconButton onClick={handleDrawerToggle} sx={{ color: 'inherit' }}>
        <Menu />
      </IconButton>
    )}
  </Box>
);

const UserProfileSection = ({ open, user }) => open && (
  <Box sx={{ 
    p: 2,
    textAlign: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.2)'
  }}>
    <AccountCircle sx={{ fontSize: 64, mb: 1 }} />
    <Typography variant="subtitle1">{user.name}</Typography>
    <Typography variant="body2">{user.email}</Typography>
    <Chip 
      label={user.role} 
      size="small" 
      sx={{ 
        mt: 1,
        backgroundColor: user.role === 'super-admin' ? 'error.main' : 'secondary.main',
        color: 'white'
      }}
    />
  </Box>
);

const NavItem = ({ open, path, label, icon }) => (
  <ListItem 
    button 
    component={Link} 
    to={path}
    sx={{ 
      justifyContent: open ? 'initial' : 'center',
      px: 2.5,
      '&.active': {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRight: '3px solid white'
      }
    }}
  >
    <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', color: 'inherit' }}>
      {icon}
    </ListItemIcon>
    {open && <ListItemText primary={label} />}
  </ListItem>
);

const QuickActionButton = ({ open, label, icon, onClick }) => (
  <ListItem 
    button 
    onClick={onClick}
    sx={{ 
      justifyContent: open ? 'initial' : 'center',
      px: 2.5,
      backgroundColor: 'rgba(255,255,255,0.1)',
      '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
    }}
  >
    <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', color: 'inherit' }}>
      {icon}
    </ListItemIcon>
    {open && <ListItemText primary={label} />}
  </ListItem>
);

const LogoutSection = ({ open, handleLogout }) => (
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
        '&:hover': { backgroundColor: 'error.main' }
      }}
    >
      <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', color: 'inherit' }}>
        <Logout />
      </ListItemIcon>
      {open && <ListItemText primary="Logout" />}
    </ListItem>
  </Box>
);

const DashboardWelcome = ({ user }) => (
  
  <>
    
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 4
    }}>
      <Typography variant="h4">
        Welcome, {user?.name || "Admin"} 🛠️
      </Typography>
    </Box>
    
    <Typography variant="body1" sx={{ mb: 2 }}>
      Quick Stats:
    </Typography>
    
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: 3
    }}>
      <StatCard title="Total Branches" value="12" />
      <StatCard title="Active Orders" value="24" />
      <StatCard title="Menu Items" value="156" />
    </Box>
  </>
);

const StatCard = ({ title, value }) => (
  <Box sx={{ 
    p: 3,
    borderRadius: 2,
    backgroundColor: 'background.paper',
    boxShadow: 1,
    textAlign: 'center'
  }}>
    <Typography variant="h5" sx={{ mb: 1 }}>{value}</Typography>
    <Typography variant="body2" color="text.secondary">{title}</Typography>
  </Box>
);

export default AdminDashboard;