import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h1" gutterBottom>404</Typography>
      <Typography variant="h4" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" paragraph>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/restaurants')}
        sx={{ mr: 2 }}
      >
        Browse Restaurants
      </Button>
      <Button 
        variant="outlined" 
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
    </Container>
  );
};

export default NotFound;