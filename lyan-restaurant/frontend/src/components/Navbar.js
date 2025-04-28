import { AppBar, Toolbar, Typography, Button, Switch } from "@mui/material";
import { useThemeContext } from '../context/ThemeContext';
import { Link } from "react-router-dom";

 const Navbar = () => {
    const { isDarkTheme, toggleTheme } = useThemeContext();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ color: "white", textDecoration: "none" }}>Restaurant App</Link>
                </Typography>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/catering-order">Catering Order</Button>
                <Button color="inherit" component={Link} to="/restaurants">Restaurants</Button>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Sign up</Button>
                <Switch 
                    checked={isDarkTheme} 
                    onChange={toggleTheme}  // Fixed this line
                />
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

// import React from 'react';
// import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <AppBar position="static" color="primary">
//       <Toolbar>
//         <Typography variant="h6" sx={{ flexGrow: 1 }}>
//           <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
//             Lyan Restaurant
//           </Link>
//         </Typography>
//         {user ? (
//           <Box>
//             {user.role === 'admin' && (
//               <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>
//                 Admin Dashboard
//               </Button>
//             )}
//             {user.role === 'user' && (
//               <Button color="inherit" onClick={() => navigate('/user/dashboard')}>
//                 My Dashboard
//               </Button>
//             )}
//             <Button color="inherit" onClick={handleLogout}>
//               Logout
//             </Button>
//           </Box>
//         ) : (
//           <>
//             <Button color="inherit" component={Link} to="/login">Login</Button>
//             <Button color="inherit" component={Link} to="/register">Register</Button>
//           </>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;

