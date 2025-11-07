import { Container, Box } from '@mui/material';

export const AuthLayout = ({ children }) => (
  <Container component="main" maxWidth="xs" sx={{ py: 6 }}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3
      }}
    >
      {children}
    </Box>
  </Container>
);