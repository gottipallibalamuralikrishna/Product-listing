import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <Stack alignItems="center" spacing={2} sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
      <SearchOffRoundedIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
      <Typography variant="h6">No products match your filters</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
        Try widening your price range or removing a brand filter.
      </Typography>
      <Button variant="outlined" onClick={onClearFilters}>
        Clear filters
      </Button>
    </Stack>
  );
}
