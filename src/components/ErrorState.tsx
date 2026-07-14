import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Stack alignItems="center" spacing={2} sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
      <ErrorOutlineRoundedIcon sx={{ fontSize: 48, color: 'error.main' }} />
      <Typography variant="h6">Couldn't load products</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
        {message}
      </Typography>
      <Button variant="contained" onClick={onRetry}>
        Try again
      </Button>
    </Stack>
  );
}
