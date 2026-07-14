import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export function LoadingGrid({ count = 8 }: { count?: number }) {
  return (
    <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={{ xs: 6, sm: 4, md: 4, lg: 3 }}>
          <Box>
            <Skeleton variant="rounded" height={180} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="30%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
