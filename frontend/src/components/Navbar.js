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
import { useMemo, useState, useCallback } from 'react';
import { alpha } from '@mui/material/styles';
import BRAND_COLORS from '../theme/brandColors';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const brandColors = theme.palette.brand ?? BRAND_COLORS;
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

    const contrastText = theme.palette.primary.contrastText;
    const baseGradient = `linear-gradient(135deg, ${alpha('#1a1a1a', 0.85)} 0%, ${alpha('#D4AF37', 0.85)} 100%)`;
    const scrolledGradient = `linear-gradient(135deg, ${alpha('#1a1a1a', 0.95)} 0%, ${alpha('#B8860B', 0.92)} 100%)`;

    const navLinks = useMemo(() => ([
            { label: 'Home', to: '/' },
            { label: 'Packages', to: '/packages' },
            { label: 'Gallery', to: '/gallery' },
            { label: 'Contact', to: '/contact' }
        ]), []);

    const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 80 });

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleLogout = useCallback(() => {
        logout();
        navigate('/login');
        handleMenuClose();
    }, [logout, navigate, handleMenuClose]);

    const handleMenuOpen = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleMobileMenuOpen = useCallback((event) => {
        setMobileMenuAnchor(event.currentTarget);
    }, []);

    const handleMobileMenuClose = useCallback(() => {
        setMobileMenuAnchor(null);
    }, []);

    const handleDashboard = useCallback(() => {
        if (user.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/user/dashboard');
        }
        handleMenuClose();
    }, [user?.role, navigate, handleMenuClose]);

    return (
        <AppBar
            position="fixed"
            elevation={trigger ? 4 : 0}
            color="transparent"
            sx={{
                color: contrastText,
                transition: 'all 0.3s ease',
                background: trigger ? scrolledGradient : baseGradient,
                backdropFilter: 'blur(10px)',
                boxShadow: trigger ? `0 8px 28px -12px ${alpha(brandColors.green, 0.6)}` : `0 6px 18px -12px ${alpha(theme.palette.common.black, 0.45)}`,
                top: 0,
                zIndex: theme.zIndex.appBar
            }}
        >
            <Toolbar sx={{ py: 1, px: { xs: 2, md: 4 } }}>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
                    <Box
                        component={Link}
                        to="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        sx={{ 
                            color: contrastText, 
                            textDecoration: 'none', 
                            display: 'flex', 
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
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
                                        ? alpha(contrastText, 0.16)
                                        : `linear-gradient(135deg, ${brandColors.green} 0%, ${brandColors.gold} 100%)`,
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontWeight: 700,
                                    fontSize: 15,
                                    color: contrastText
                                }}
                            >
                                L
                            </Box>
                            {/* Show "LYAN" text always on desktop, on mobile only when scrolling */}
                            <Box 
                                component="span" 
                                sx={{ 
                                    fontWeight: 700, 
                                    fontSize: '1.1rem',
                                    display: { xs: trigger ? 'inline' : 'none', md: 'inline' },
                                    color: '#D4AF37',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                LYAN
                            </Box>
                        </Box>
                    </Box>
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
                                    color: contrastText,
                                    '&:hover': {
                                        bgcolor: alpha(contrastText, 0.12)
                                    }
                                }}
                            >
                                {link.label}
                            </Button>
                        ))}
                    </Box>
                )}

                <Box sx={{ flexGrow: 1 }} />
                
                {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isMobile && (
                            <IconButton
                                onClick={handleMobileMenuOpen}
                                sx={{ color: contrastText, '&:hover': { bgcolor: alpha(contrastText, 0.12) } }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{ 
                                color: contrastText,
                                '&:hover': { bgcolor: alpha(contrastText, 0.12) }
                            }}
                        >
                            <Avatar sx={{ 
                                width: 40, 
                                height: 40, 
                                bgcolor: alpha(contrastText, 0.2),
                                border: `2px solid ${contrastText}`,
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
                    <>
                        {isMobile && (
                            <IconButton
                                onClick={handleMobileMenuOpen}
                                sx={{ color: contrastText, '&:hover': { bgcolor: alpha(contrastText, 0.12) } }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/login"
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    color: contrastText,
                                    '&:hover': { bgcolor: alpha(contrastText, 0.12) }
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="contained"
                                component={Link}
                                to="/register"
                                color="secondary"
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 999,
                                    px: 3,
                                    background: `linear-gradient(135deg, ${brandColors.gold} 0%, ${brandColors.green} 100%)`,
                                    color: contrastText,
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${brandColors.green} 0%, ${brandColors.gold} 100%)`
                                    }
                                }}
                            >
                                Register
                            </Button>
                        </Box>
                    </>
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

