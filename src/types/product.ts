/** A single product as returned by the DummyJSON API. */
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
}

/** Shape of the paginated list endpoint (GET /products, /products/category/:slug). */
export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

/** Shape of a single category entry from GET /products/categories. */
export interface Category {
  slug: string;
  name: string;
  url: string;
}

/** Sort order applied to the product grid. */
export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc' | 'title-asc';

/** All filter criteria the user can apply, mirrored into the URL query string. */
export interface ProductFilters {
  category: string | null;
  brands: string[];
  minPrice: string;
  maxPrice: string;
  search: string;
  sort: SortOption;
  page: number;
}
