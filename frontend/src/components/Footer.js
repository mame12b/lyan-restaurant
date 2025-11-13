import React, { memo, useMemo } from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Facebook,
  Instagram,
  Tiktok,
  LinkedIn,
  WhatsApp,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';
import BRAND_COLORS from '../theme/brandColors';

const QUICK_LINKS = Object.freeze([
  { title: 'Home', path: '/' },
  { title: 'Packages', path: '/packages' },
  { title: 'Gallery', path: '/gallery' },
  { title: 'Contact', path: '/contact' }
]);

const SERVICES = Object.freeze([
  'Wedding Catering',
  'Birthday Parties',
  'Corporate Events',
  'Engagement Ceremonies',
  'Venue Decoration',
  'Photography Services'
]);

const Footer = () => {
  const theme = useTheme();
  const brandColors = theme.palette.brand ?? BRAND_COLORS;
  const quickLinks = QUICK_LINKS;
  const services = SERVICES;
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        pt: 6,
        pb: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: brandColors.gold,
                mb: 2
              }}
            >
              LYAN Events
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#B0B0B0' }}>
              Making your special days extraordinary with authentic Ethiopian hospitality and world-class service.
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0B0B0', fontStyle: 'italic' }}>
              የልያን ካተሪንግ እና ኢቬንት
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 2, color: brandColors.gold }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: '#B0B0B0',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.3s',
                    '&:hover': {
                      color: brandColors.gold,
                      pl: 1
                    }
                  }}
                >
                  {link.title}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Our Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 2, color: brandColors.gold }}
            >
              Our Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {services.map((service, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{ color: '#B0B0B0', fontSize: '0.9rem' }}
                >
                  • {service}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 2, color: brandColors.gold }}
            >
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 20, color: brandColors.green }} />
                <Link
                  href="tel:+971563561803"
                  sx={{
                    color: '#B0B0B0',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': { color: brandColors.gold }
                  }}
                >
                  +971 56 356 1803
                </Link>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 20, color: brandColors.green }} />
                <Link
                  href="mailto:info@lyan-events.com"
                  sx={{
                    color: '#B0B0B0',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': { color: brandColors.gold }
                  }}
                >
                  info@lyan-events.com
                </Link>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn sx={{ fontSize: 20, color: brandColors.green, mt: 0.3 }} />
                <Typography variant="body2" sx={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  Kasanchis, Addis Ababa<br />Ethiopia
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WhatsApp sx={{ fontSize: 20, color: '#25D366' }} />
                <Link
                  href="https://wa.me/+971563561803"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#B0B0B0',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': { color: '#25D366' }
                  }}
                >
                  Chat on WhatsApp
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Social Media */}
  <Divider sx={{ my: 3, backgroundColor: alpha(theme.palette.common.white, 0.12) }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
            © {currentYear} LYAN Catering & Events. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              sx={{
                color: '#B0B0B0',
                '&:hover': {
                  color: '#1877F2',
                  backgroundColor: alpha('#1877F2', 0.12)
                }
              }}
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook />
            </IconButton>

            <IconButton
              sx={{
                color: '#B0B0B0',
                '&:hover': {
                  color: '#E4405F',
                  backgroundColor: alpha('#E4405F', 0.12)
                }
              }}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram />
            </IconButton>

            <IconButton
              sx={{
                color: '#B0B0B0',
                '&:hover': {
                  color: '#1DA1F2',
                  backgroundColor: alpha('#1DA1F2', 0.12)
                }
              }}
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Tiktok />
            </IconButton>

            <IconButton
              sx={{
                color: '#B0B0B0',
                '&:hover': {
                  color: '#0A66C2',
                  backgroundColor: alpha('#0A66C2', 0.12)
                }
              }}
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedIn />
            </IconButton>
          </Box>
        </Box>

        {/* Bottom Links */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link
            href="#"
            sx={{
              color: '#B0B0B0',
              textDecoration: 'none',
              fontSize: '0.85rem',
              mx: 1,
              '&:hover': { color: brandColors.gold }
            }}
          >
            Privacy Policy
          </Link>
          <Typography component="span" sx={{ color: '#B0B0B0' }}>|</Typography>
          <Link
            href="#"
            sx={{
              color: '#B0B0B0',
              textDecoration: 'none',
              fontSize: '0.85rem',
              mx: 1,
              '&:hover': { color: brandColors.gold }
            }}
          >
            Terms of Service
          </Link>
          <Typography component="span" sx={{ color: '#B0B0B0' }}>|</Typography>
          <Link
            href="#"
            sx={{
              color: '#B0B0B0',
              textDecoration: 'none',
              fontSize: '0.85rem',
              mx: 1,
              '&:hover': { color: brandColors.gold }
            }}
          >
            Cookie Policy
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default memo(Footer);