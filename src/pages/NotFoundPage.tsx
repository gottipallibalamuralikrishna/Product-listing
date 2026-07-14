import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Typography variant="h2" fontWeight={800}>
          404
        </Typography>
        <Typography variant="h6">This page doesn't exist</Typography>
        <Typography variant="body2" color="text.secondary">
          The page you're looking for may have been moved or removed.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          Back to products
        </Button>
      </Stack>
    </Container>
  );
}
