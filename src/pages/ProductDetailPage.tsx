import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Skeleton from '@mui/material/Skeleton';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';

import { useProductStore } from '@/stores/StoreContext';
import { ErrorState } from '@/components/ErrorState';

export const ProductDetailPage = observer(function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const store = useProductStore();

  useEffect(() => {
    if (id) void store.loadProductDetail(id);
    return () => store.clearDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // The listing link carries the filters/page the user came from, so Back restores them exactly.
  const backHref = `/?${searchParams.toString()}`;

  const handleRetry = () => {
    if (id) void store.loadProductDetail(id);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate(backHref)}
        sx={{ mb: { xs: 2, md: 3 } }}
      >
        Back to products
      </Button>

      {store.detailLoading && <DetailSkeleton />}

      {!store.detailLoading && store.detailError && (
        <ErrorState message={store.detailError} onRetry={handleRetry} />
      )}

      {!store.detailLoading && !store.detailError && store.selectedProduct && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 3, md: 6 },
          }}
        >
          <Box
            sx={{
              bgcolor: '#FBF8F1',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              p: { xs: 3, md: 5 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component="img"
              src={store.selectedProduct.thumbnail}
              alt={store.selectedProduct.title}
              sx={{ width: '100%', maxWidth: 420, objectFit: 'contain' }}
            />
          </Box>

          <Stack spacing={2}>
            <Chip
              label={store.selectedProduct.category.replace(/-/g, ' ')}
              size="small"
              color="secondary"
              variant="outlined"
              sx={{ alignSelf: 'flex-start', textTransform: 'capitalize' }}
            />
            <Typography variant="h4" component="h1" fontWeight={700}>
              {store.selectedProduct.title}
            </Typography>

            {store.selectedProduct.brand && (
              <Typography variant="body1" color="text.secondary">
                by <strong>{store.selectedProduct.brand}</strong>
              </Typography>
            )}

            <Stack direction="row" alignItems="center" spacing={1}>
              <Rating value={store.selectedProduct.rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                {store.selectedProduct.rating.toFixed(2)} / 5
              </Typography>
            </Stack>

            <Typography variant="h4" color="primary.dark" fontWeight={800}>
              ${(
                store.selectedProduct.price *
                (1 - store.selectedProduct.discountPercentage / 100)
              ).toFixed(2)}
              {store.selectedProduct.discountPercentage > 0 && (
                <Typography
                  component="span"
                  variant="h6"
                  color="text.secondary"
                  sx={{ ml: 1.5, textDecoration: 'line-through' }}
                >
                  ${store.selectedProduct.price.toFixed(2)}
                </Typography>
              )}
            </Typography>

            <Divider />

            <Typography variant="subtitle1" fontWeight={700}>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {store.selectedProduct.description}
            </Typography>

            <Divider />

            <Stack direction="row" spacing={1} alignItems="center">
              <Inventory2RoundedIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {store.selectedProduct.stock > 0
                  ? `${store.selectedProduct.stock} in stock`
                  : 'Out of stock'}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      )}
    </Container>
  );
});

function DetailSkeleton() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: { xs: 3, md: 6 },
      }}
    >
      <Skeleton variant="rounded" height={380} />
      <Stack spacing={2}>
        <Skeleton width="30%" height={32} />
        <Skeleton width="80%" height={48} />
        <Skeleton width="40%" height={28} />
        <Skeleton width="50%" height={48} />
        <Skeleton width="100%" height={120} />
      </Stack>
    </Box>
  );
}
