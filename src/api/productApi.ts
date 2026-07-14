import axios from 'axios';
import type { Category, Product, ProductListResponse } from '@/types/product';

const BASE_URL = 'https://dummyjson.com';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

/**
 * Fetches the full product catalogue (or a single category slice) in one call
 * using `limit=0`, which DummyJSON treats as "no limit". Client-side filtering
 * and pagination is then applied on top of this dataset — this keeps combined
 * filters (category + brand + price) instant and consistent, since the API
 * itself does not support combining all three server-side.
 */
export async function fetchAllProducts(category?: string | null): Promise<Product[]> {
  const path = category ? `/products/category/${encodeURIComponent(category)}` : '/products';
  const { data } = await client.get<ProductListResponse>(path, {
    params: { limit: 0 },
  });
  return data.products;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await client.get<Array<Category | string>>('/products/categories');
  // DummyJSON has shipped both a string[] and a {slug,name,url}[] shape historically.
  // Normalize defensively so the app keeps working regardless of which is live.
  return data.map((entry) =>
    typeof entry === 'string'
      ? { slug: entry, name: toTitleCase(entry), url: '' }
      : entry
  );
}

export async function fetchProductById(id: string | number): Promise<Product> {
  const { data } = await client.get<Product>(`/products/${id}`);
  return data;
}

function toTitleCase(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
