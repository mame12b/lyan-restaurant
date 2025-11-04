import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
    Divider,
    ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dashboard, Logout as LogoutIcon } from '@mui/icons-material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useMemo, useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState(null);
        const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

    const ethiopianColors = { gold: '#D4AF37', green: '#078930', red: '#DA121A', yellow: '#FCDD09' };

        const navLinks = useMemo(() => ([
            { label: 'Home', to: '/' },
            { label: 'Packages', to: '/packages' },
            { label: 'Gallery', to: '/gallery' },
            { label: 'Contact', to: '/contact' }
        ]), []);

        const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 80 });

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleMenuClose();
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

        const handleMenuClose = () => {
                setAnchorEl(null);
        };

        const handleMobileMenuOpen = (event) => {
            setMobileMenuAnchor(event.currentTarget);
        };

        const handleMobileMenuClose = () => {
            setMobileMenuAnchor(null);
        };

    const handleDashboard = () => {
        if (user.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/user/dashboard');
        }
        handleMenuClose();
    };

    return (
                <AppBar
                    position="sticky"
                    elevation={trigger ? 4 : 0}
                    color="transparent"
                    sx={{
                        transition: 'background 0.3s ease, box-shadow 0.3s ease',
                        backgroundColor: trigger ? 'rgba(15, 91, 79, 0.95)' : 'transparent',
                        backdropFilter: trigger ? 'blur(10px)' : 'none',
                        boxShadow: trigger ? '0 8px 28px -12px rgba(7,137,48,0.4)' : 'none'
                    }}
                >
                        <Toolbar sx={{ py: 1, px: { xs: 2, md: 4 } }}>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
                                        <Link
                                            to="/"
                                            style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                                        >
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        fontSize: { xs: '1rem', md: '1.1rem' }
                                                    }}
                                                >
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: '50%',
                                                            background: trigger
                                                                ? 'rgba(255,255,255,0.16)'
                                                                : `linear-gradient(135deg, ${ethiopianColors.green} 0%, ${ethiopianColors.gold} 100%)`,
                                                            display: 'inline-flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            fontWeight: 700,
                                                            fontSize: 15
                                                        }}
                                                    >
                                                        L
                                                    </Box>
                                                    LYAN Catering & Events
                                                </Box>
                    </Link>
                </Typography>
                
                                {!isMobile && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 3 }}>
                                        {navLinks.map((link) => (
                                            <Button
                                                key={link.to}
                                                color="inherit"
                                                component={Link}
                                                to={link.to}
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: 500,
                                                    borderRadius: 999,
                                                    px: 2.5,
                                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' }
                                                }}
                                            >
                                                {link.label}
                                            </Button>
                                        ))}
                                    </Box>
                                )}

                                {isMobile && (
                                    <IconButton
                                        onClick={handleMobileMenuOpen}
                                        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                )}
                
                {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{ 
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            <Avatar sx={{ 
                                width: 40, 
                                height: 40, 
                                bgcolor: 'rgba(255,255,255,0.2)',
                                border: '2px solid white',
                                fontSize: '1rem',
                                fontWeight: 'bold'
                            }}>
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem disabled sx={{ opacity: 1, '&.Mui-disabled': { opacity: 1 } }}>
                                <Box>
                                    <Typography variant="body2" fontWeight="bold">{user.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                                </Box>
                            </MenuItem>
                                                        <Divider sx={{ my: 0.5 }} />
                            <MenuItem onClick={handleDashboard}>
                                                                <ListItemIcon>
                                                                    <Dashboard fontSize="small" />
                                                                </ListItemIcon>
                                                                {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                                                <ListItemIcon>
                                                                    <LogoutIcon fontSize="small" />
                                                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    color="inherit"
                                                    component={Link}
                                                    to="/login"
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontWeight: 500,
                                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' }
                                                    }}
                                                >
                                                    Login
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    component={Link}
                                                    to="/register"
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        borderRadius: 999,
                                                        px: 3,
                                                        background: `linear-gradient(135deg, ${ethiopianColors.gold} 0%, ${ethiopianColors.green} 100%)`,
                                                        '&:hover': {
                                                            background: `linear-gradient(135deg, ${ethiopianColors.green} 0%, ${ethiopianColors.gold} 100%)`
                                                        }
                                                    }}
                                                >
                                                    Register
                                                </Button>
                    </Box>
                )}
            </Toolbar>

                        <Menu
                            anchorEl={mobileMenuAnchor}
                            open={Boolean(mobileMenuAnchor)}
                            onClose={handleMobileMenuClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            {navLinks.map((link) => (
                                <MenuItem
                                    key={link.to}
                                    component={Link}
                                    to={link.to}
                                    onClick={handleMobileMenuClose}
                                >
                                    {link.label}
                                </MenuItem>
                            ))}
                            {!user ? (
                                <>
                                    <Divider sx={{ my: 1 }} />
                                    <MenuItem component={Link} to="/login" onClick={handleMobileMenuClose}>
                                        Login
                                    </MenuItem>
                                    <MenuItem component={Link} to="/register" onClick={handleMobileMenuClose}>
                                        Register
                                    </MenuItem>
                                </>
                            ) : (
                                <>
                                    <Divider sx={{ my: 1 }} />
                                    <MenuItem onClick={() => { handleDashboard(); handleMobileMenuClose(); }}>
                                        {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleLogout(); handleMobileMenuClose(); }}>
                                        Logout
                                    </MenuItem>
                                </>
                            )}
                        </Menu>
        </AppBar>
    );
};

export default Navbar;

