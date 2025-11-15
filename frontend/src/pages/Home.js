import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useMediaQuery from '@mui/material/useMediaQuery';
import partnerLogos from '../data/partnerLogos';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CelebrationIcon from '@mui/icons-material/Celebration';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import BungalowIcon from '@mui/icons-material/Bungalow';
import VerifiedIcon from '@mui/icons-material/Verified';

// Use a WebP, lower-resolution variant to reduce payload for first paint
const heroImage = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=60&fm=webp';

const signatureExperiences = [
  {
    title: 'Lavish Wedding Weekend',
    description: 'Full weekend celebration with cultural ceremonies, curated dining, and immersive decor.',
    image: 'https://s3-media0.fl.yelpcdn.com/bphoto/otr4id7b1Kxtwkf3lA9Ztg/l.jpg',
    accent: 'rgba(212,175,55,0.3)'
  },
  {
    title: 'Executive Corporate Summit',
    description: 'High-touch executive gatherings with concierge logistics and fine dining experiences.',
    image: 'https://cdn0.scrvt.com/7b8dc61d55f0deedb776692474194f7c/06ee2d2ffc35a9c9/be4216a3a22e/v/2bba2f461a77/siemens_healthineers_executive_summit_2022_opening.jpg',
    accent: 'rgba(7,137,48,0.25)'
  },
  {
    title: 'Milestone Celebration',
    description: 'Birthdays and anniversaries crafted with storytelling, live entertainment, and gourmet cuisine.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80',
    accent: 'rgba(218,18,26,0.25)'
  }
];

const serviceHighlights = [
  {
    title: 'Culinary artistry',
    description: 'Award-winning chefs blending Ethiopian flavors with global gastronomy for every palate.',
    icon: <RestaurantIcon fontSize="large" />,
    color: '#078930'
  },
  {
    title: 'Sensory design',
    description: 'Immersive environments, floral couture, lighting, and decor tailored to your narrative.',
    icon: <CelebrationIcon fontSize="large" />,
    color: '#D4AF37'
  },
  {
    title: 'Memory capture',
    description: 'Cinematic photography and film crews dedicated to telling your story authentically.',
    icon: <CameraAltIcon fontSize="large" />,
    color: '#DA121A'
  },
  {
    title: 'Venue curation',
    description: 'Exclusive partnerships with iconic venues across Addis Ababa and destination getaways.',
    icon: <BungalowIcon fontSize="large" />,
    color: '#0F5B4F'
  }
];

const journeySteps = [
  {
    title: 'Discover',
    subtitle: 'Vision mapping session',
    description: 'We listen, learn, and translate your story into a bespoke concept that reflects your heritage and aspirations.'
  },
  {
    title: 'Design',
    subtitle: 'Curation & planning',
    description: 'Our producers craft mood boards, menus, floor plans, and guest experiences with meticulous precision.'
  },
  {
    title: 'Deliver',
    subtitle: 'Flawless execution',
    description: 'Day-of specialists orchestrate every detail while you celebrate freely with the people you cherish.'
  }
];

const testimonials = [
  {
    name: 'Amanuel & Liya',
    title: 'Wedding weekend',
    quote:
      'From the coffee ceremony to the grand reception, every detail was authentically ours. The team handled everything so we could be present with family.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Yared T.',
    title: 'Corporate communications lead',
    quote:
      'Our leadership summit impressed stakeholders from five countries. Logistics, translation, and hospitality were executed flawlessly.',
    avatar: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Bethlehem S.',
    title: 'Event hostess',
    quote:
      'They transformed my milestone birthday into a cinematic experience. Guests still talk about the cuisine and ambiance months later.',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80'
  }
];

const stats = [
  { value: '500+', label: 'Celebrations orchestrated' },
  { value: '200+', label: 'Corporate partners' },
  { value: '50K+', label: 'Guests served' }
];

const buildSrcSet = (url, widths = [480, 768, 1200]) =>
  widths
    .map((width) => `${url.replace(/w=\d+/g, `w=${width}`)} ${width}w`)
    .join(', ');

const Home = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.9 } }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7 } }
  };

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <Box sx={{ bgcolor: '#f6f8fb' }}>
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '75vh', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          backgroundImage: `linear-gradient(115deg, rgba(7,137,48,0.82) 0%, rgba(212,175,55,0.65) 45%, rgba(20,20,20,0.6) 100%), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 45%)'
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <Chip
                  label="LYAN Catering & Events"
                  sx={{
                    mb: 3,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600,
                    letterSpacing: 1,
                    borderRadius: 999,
                    px: 2
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.05,
                    fontSize: { xs: '2.5rem', md: '3.6rem' },
                    display: { xs: 'none', md: 'block' }
                  }}
                >
                  Celebrate boldly. We translate your story into unforgettable moments.
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    fontSize: { xs: '2.1rem', sm: '2.4rem' },
                    display: { xs: 'block', md: 'none' }
                  }}
                >
                  Plan unforgettable events with LYAN Catering & Events.
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ opacity: 0.92, mt: 2, maxWidth: 620, fontWeight: 400, display: { xs: 'none', md: 'block' } }}
                >
                  Trusted planners, designers, and culinary artists crafting elevated Ethiopian and
                  global celebrations for weddings, milestones, and corporate experiences.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.92,
                    mt: 2,
                    maxWidth: 520,
                    fontWeight: 500,
                    display: { xs: 'block', md: 'none' }
                  }}
                >
                  Discover venues, menus, and full-service planners in one hub designed for weddings,
                  milestones, and corporate gatherings.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ mt: 4 }}>
                  <Button
                    component={Link}
                    to="/packages"
                    variant="contained"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.4,
                      borderRadius: 999,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #F6F6F6 100%)',
                      color: '#078930',
                      '&:hover': { background: 'linear-gradient(135deg, #F0F0F0 0%, #FFFFFF 100%)' }
                    }}
                  >
                    Browse signature packages
                  </Button>
                  <Button
                    component={Link}
                    to="/contact"
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.4,
                      borderRadius: 999,
                      fontWeight: 600,
                      borderColor: 'rgba(255,255,255,0.7)',
                      color: 'white',
                      '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.12)' }
                    }}
                  >
                    Plan with our experts
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={5}>
              <motion.div initial="hidden" animate="visible" variants={slideUp}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.15)',
                    borderRadius: 4,
                    p: 3,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', opacity: 0.8 }}>
                    By the numbers
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    {stats.map((stat) => (
                      <Box key={stat.label} sx={{ flex: 1 }}>
                        <Typography variant="h4" fontWeight={700}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.75 }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.25)' }} />
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                        <FavoriteIcon />
                      </Avatar>
                      <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        Complete event architecture: culinary, design, entertainment, logistics, and
                        guest hospitality.
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                        <VerifiedIcon />
                      </Avatar>
                      <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        Dedicated producer for every celebration with 24/7 coordination support.
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp}>
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              textAlign: 'center',
              letterSpacing: 4,
              color: 'primary.main'
            }}
          >
            Signature experiences
          </Typography>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ fontWeight: 700, mt: 1, mb: 2 }}
          >
            Crafted celebrations for every milestone
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 640, mx: 'auto', mb: 6 }}
          >
            Explore fully produced experiences designed to capture culture, story, and modern flair.
          </Typography>

          <Grid container spacing={4}>
            {signatureExperiences.map((experience) => (
              <Grid item xs={12} md={4} key={experience.title}>
                <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      boxShadow: '0 18px 45px -24px rgba(7,137,48,0.35)'
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={experience.image}
                      srcSet={buildSrcSet(experience.image)}
                      sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      height="240"
                      alt={experience.title}
                      loading="lazy"
                      decoding="async"
                    />
                    <CardContent sx={{ minHeight: 220 }}>
                      <Chip
                        label="Featured"
                        size="small"
                        sx={{ bgcolor: experience.accent, fontWeight: 600, mb: 2 }}
                      />
                      <Typography variant="h5" fontWeight={700} gutterBottom>
                        {experience.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {experience.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={6}>
            <Button
              component={Link}
              to="/packages"
              variant="contained"
              size="large"
              sx={{
                px: 5,
                py: 1.4,
                borderRadius: 999,
                background: 'linear-gradient(135deg, #078930 0%, #D4AF37 100%)',
                fontWeight: 600,
                '&:hover': { background: 'linear-gradient(135deg, #D4AF37 0%, #078930 100%)' }
              }}
            >
              View the full package catalog
            </Button>
          </Box>
        </motion.div>
      </Container>

      <Box sx={{ bgcolor: '#ffffff', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={5}>
                <Typography variant="overline" sx={{ letterSpacing: 4, color: 'primary.main' }}>
                  Why partner with us
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
                  Elevated services at every touchpoint
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  A multidisciplinary team delivering immersive hospitality, on-time logistics, and
                  design excellence anchored in Ethiopian warmth.
                </Typography>
                <Stack spacing={2.5}>
                  {serviceHighlights.map((item) => (
                    <Paper
                      key={item.title}
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: `1px solid ${item.color}22`
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar sx={{ bgcolor: `${item.color}1A`, color: item.color }}>
                          {item.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={700}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={7}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, rgba(7,137,48,0.08) 0%, rgba(212,175,55,0.12) 100%)'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: 'primary.main' }}>
                    Your journey with us
                  </Typography>
                  <Stack spacing={3} sx={{ mt: 3 }}>
                    {journeySteps.map((step, index) => (
                      <Stack key={step.title} direction="row" spacing={3} alignItems="flex-start">
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            bgcolor: '#078930',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 18
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {step.title}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                            {step.subtitle}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {step.description}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp}>
          <Typography
            variant="overline"
            sx={{ textAlign: 'center', letterSpacing: 4, color: 'primary.main' }}
          >
            Stories from our clients
          </Typography>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ fontWeight: 700, mt: 1, mb: 2 }}
          >
            Celebrations that become cherished memories
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 620, mx: 'auto', mb: 6 }}
          >
            Hear from couples, executives, and families who trusted LYAN with their milestone moments.
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial) => (
              <Grid item xs={12} md={4} key={testimonial.name}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#ffffff' }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={testimonial.avatar} alt={testimonial.name} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testimonial.title}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      “{testimonial.quote}”
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" variants={fadeIn} viewport={{ once: true }}>
            <Typography
              variant="overline"
              sx={{ display: 'block', textAlign: 'center', letterSpacing: 4, color: 'primary.main' }}
            >
              Trusted collaborations
            </Typography>
            <Typography variant="h3" textAlign="center" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
              Brands that rely on LYAN hospitality
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ maxWidth: 640, mx: 'auto', mb: 6 }}
            >
              From national enterprises to global partners, our events create meaningful connections.
            </Typography>

            <Grid container spacing={4} justifyContent="center" alignItems="center">
              {partnerLogos.map((company, index) => {
                const logoSrc = prefersDarkMode ? company.darkLogo : company.lightLogo;
                const logoSrcSet = `${logoSrc} 1x, ${prefersDarkMode ? company.darkLogo : company.lightLogo} 2x`;
                return (
                <Grid item xs={6} sm={4} md={2} key={company.name}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 100,
                        borderRadius: 3,
                        bgcolor: '#f4f6f8',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: '0 14px 30px -18px rgba(0,0,0,0.35)',
                          bgcolor: '#ffffff'
                        }
                      }}
                    >
                      <img
                        src={logoSrc}
                        srcSet={logoSrcSet}
                        alt={company.name}
                        loading="lazy"
                        decoding="async"
                        style={{ maxWidth: '100%', maxHeight: 60, objectFit: 'contain' }}
                      />
                    </Paper>
                  </motion.div>
                </Grid>
              );
              })}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 9, md: 11 },
          background: 'linear-gradient(135deg, rgba(212,175,55,0.32) 0%, rgba(7,137,48,0.3) 100%)'
        }}
      >
        <Container maxWidth="md">
          <motion.div initial="hidden" whileInView="visible" variants={slideUp} viewport={{ once: true }}>
            <Typography
              variant="h3"
              textAlign="center"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Ready to bring your celebration to life?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ maxWidth: 520, mx: 'auto', mb: 4 }}
            >
              Schedule a design consultation or chat with our planners to begin crafting a bespoke
              experience tailored to you.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/booking"
                sx={{
                  borderRadius: 999,
                  px: 4,
                  py: 1.4,
                  fontWeight: 600,
                  backgroundColor: '#078930',
                  '&:hover': { backgroundColor: '#056624' }
                }}
              >
                Book a Consultation
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => window.open('https://wa.me/+971563561803', '_blank')}
                sx={{
                  borderRadius: 999,
                  px: 4,
                  py: 1.4,
                  fontWeight: 600,
                  borderColor: '#078930',
                  color: '#078930',
                  '&:hover': { borderColor: '#056624', color: '#056624' }
                }}
              >
                Chat on WhatsApp
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
