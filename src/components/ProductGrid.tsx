import Grid from '@mui/material/Grid2';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/ProductCard';

interface ProductGridProps {
  products: Product[];
  returnQuery: string;
}

export function ProductGrid({ products, returnQuery }: ProductGridProps) {
  return (
    <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 6, sm: 4, md: 4, lg: 3 }}>
          <ProductCard product={product} returnQuery={returnQuery} />
        </Grid>
      ))}
    </Grid>
  );
}
