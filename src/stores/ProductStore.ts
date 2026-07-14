import { makeAutoObservable, runInAction } from "mobx";
import {
  fetchAllProducts,
  fetchCategories,
  fetchProductById,
} from "@/api/productApi";
import type {
  Category,
  Product,
  ProductFilters,
  SortOption,
} from "@/types/product";

const DEFAULT_FILTERS: ProductFilters = {
  category: null,
  brands: [],
  minPrice: "",
  maxPrice: "",
  search: "",
  sort: "default",
  page: 1,
};

export const PAGE_SIZE = 12;

export class ProductStore {
  allProducts: Product[] = [];
  categories: Category[] = [];
  listLoading = false;
  listError: string | null = null;

  filters: ProductFilters = { ...DEFAULT_FILTERS };

  selectedProduct: Product | null = null;
  detailLoading = false;
  detailError: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadCategories() {
    try {
      const categories = await fetchCategories();
      runInAction(() => {
        this.categories = categories;
      });
    } catch {
      // Categories are a "nice to have" filter; listing still works without them.
      runInAction(() => {
        this.categories = [];
      });
    }
  }

  async loadProducts(category?: string | null) {
    this.listLoading = true;
    this.listError = null;
    try {
      const products = await fetchAllProducts(category ?? undefined);
      runInAction(() => {
        this.allProducts = products;
        this.listLoading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.listError = extractErrorMessage(err);
        this.allProducts = [];
        this.listLoading = false;
      });
    }
  }

  async loadProductDetail(id: string) {
    this.detailLoading = true;
    this.detailError = null;
    this.selectedProduct = null;
    try {
      const product = await fetchProductById(id);
      runInAction(() => {
        this.selectedProduct = product;
        this.detailLoading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.detailError = extractErrorMessage(err);
        this.detailLoading = false;
      });
    }
  }

  clearDetail() {
    this.selectedProduct = null;
    this.detailError = null;
  }

  // ------------------------------------------------------------------------
  // Filter mutations — each resets the page back to 1, per the spec.
  // ------------------------------------------------------------------------

  setCategory(category: string | null) {
    if (this.filters.category === category) return;
    this.filters.category = category;
    this.filters.page = 1;
    // Category is the one dimension DummyJSON can filter server-side, so we
    // re-fetch the base dataset for it and let brand/price stay client-side.
    void this.loadProducts(category);
  }

  toggleBrand(brand: string) {
    const idx = this.filters.brands.indexOf(brand);
    if (idx === -1) {
      this.filters.brands = [...this.filters.brands, brand];
    } else {
      this.filters.brands = this.filters.brands.filter((b) => b !== brand);
    }
    this.filters.page = 1;
  }

  setPriceRange(min: string, max: string) {
    this.filters.minPrice = min;
    this.filters.maxPrice = max;
    this.filters.page = 1;
  }

  setSearch(term: string) {
    this.filters.search = term;
    this.filters.page = 1;
  }

  setSort(sort: SortOption) {
    this.filters.sort = sort;
  }

  setPage(page: number) {
    this.filters.page = page;
  }

  resetFilters() {
    const category = this.filters.category;
    this.filters = { ...DEFAULT_FILTERS, category };
  }

  hydrateFilters(filters: Partial<ProductFilters>) {
    this.filters = { ...DEFAULT_FILTERS, ...filters };
  }

  get availableBrands(): string[] {
    const brands = new Set<string>();
    this.allProducts.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort((a, b) => a.localeCompare(b));
  }

  get priceBounds(): { min: number; max: number } {
    if (this.allProducts.length === 0) return { min: 0, max: 0 };
    let min = Infinity;
    let max = 0;
    this.allProducts.forEach((p) => {
      if (p.price < min) min = p.price;
      if (p.price > max) max = p.price;
    });
    return { min: Math.floor(min), max: Math.ceil(max) };
  }

  get filteredProducts(): Product[] {
    const { brands, minPrice, maxPrice, search, sort } = this.filters;
    const min = minPrice.trim() !== "" ? Number(minPrice) : null;
    const max = maxPrice.trim() !== "" ? Number(maxPrice) : null;
    const term = search.trim().toLowerCase();

    let result = this.allProducts.filter((p) => {
      if (brands.length > 0 && (!p.brand || !brands.includes(p.brand)))
        return false;
      if (min !== null && !Number.isNaN(min) && p.price < min) return false;
      if (max !== null && !Number.isNaN(max) && p.price > max) return false;
      if (term && !p.title.toLowerCase().includes(term)) return false;
      return true;
    });

    result = sortProducts(result, sort);
    return result;
  }

  get totalFilteredCount(): number {
    return this.filteredProducts.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalFilteredCount / PAGE_SIZE));
  }

  get pagedProducts(): Product[] {
    const page = Math.min(this.filters.page, this.totalPages);
    const start = (page - 1) * PAGE_SIZE;
    return this.filteredProducts.slice(start, start + PAGE_SIZE);
  }

  get hasActiveFilters(): boolean {
    const { brands, minPrice, maxPrice, search } = this.filters;
    return (
      brands.length > 0 || minPrice !== "" || maxPrice !== "" || search !== ""
    );
  }
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating-desc":
      return copy.sort((a, b) => b.rating - a.rating);
    case "title-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return copy;
  }
}

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return (
      String((err as { message: unknown }).message) ||
      "Something went wrong. Please try again."
    );
  }
  return "Something went wrong. Please try again.";
}
