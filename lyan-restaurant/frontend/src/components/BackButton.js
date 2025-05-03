
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBack from '@mui/icons-material/ArrowBack';

const BackButton = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ margin: '10px'}}>
      <Button 
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        size="small"
      >
        Back
      </Button>
    </div>
  );
};

export default BackButton;