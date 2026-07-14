import { useEffect, useState, useCallback, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useSearchParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useProductStore } from "@/stores/StoreContext";
import { FilterPanel } from "@/components/FilterPanel";
import { ListingToolbar } from "@/components/ListingToolbar";
import { ProductGrid } from "@/components/ProductGrid";
import { LoadingGrid } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import type { ProductFilters, SortOption } from "@/types/product";
import { HeroBanner } from "@/components/HeroBanner";

/** Serializes the current filter state into a URLSearchParams-compatible record, dropping empty values. */
function filtersToParams(filters: ProductFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.category) params.category = filters.category;
  if (filters.brands.length) params.brands = filters.brands.join(",");
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.search) params.search = filters.search;
  if (filters.sort !== "default") params.sort = filters.sort;
  if (filters.page !== 1) params.page = String(filters.page);
  return params;
}

function paramsToFilters(params: URLSearchParams): Partial<ProductFilters> {
  const brands = params.get("brands");
  return {
    category: params.get("category"),
    brands: brands ? brands.split(",").filter(Boolean) : [],
    minPrice: params.get("minPrice") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
    search: params.get("search") ?? "",
    sort: (params.get("sort") as SortOption) ?? "default",
    page: Number(params.get("page") ?? "1") || 1,
  };
}

export const ProductListingPage = observer(function ProductListingPage() {
  const store = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const hasHydrated = useRef(false);

  // Hydrate store from the URL exactly once on mount (covers deep links and Back navigation).
  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;
    const initial = paramsToFilters(searchParams);
    store.hydrateFilters(initial);
    void store.loadCategories();
    void store.loadProducts(initial.category ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in sync whenever filters change, so the state is shareable and Back-safe.
  useEffect(() => {
    if (!hasHydrated.current) return;
    setSearchParams(filtersToParams(store.filters), { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    store.filters.category,
    store.filters.brands.length,
    store.filters.minPrice,
    store.filters.maxPrice,
    store.filters.search,
    store.filters.sort,
    store.filters.page,
  ]);

  const handleRetry = useCallback(() => {
    void store.loadProducts(store.filters.category);
  }, [store]);

  const returnQuery = `?${new URLSearchParams(filtersToParams(store.filters)).toString()}`;
  const showEmptyState =
    !store.listLoading && !store.listError && store.pagedProducts.length === 0;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Typography variant="h5" component="h1" fontWeight={700}>
          {store.filters.category
            ? store.categories.find((c) => c.slug === store.filters.category)?.name ?? 'Products'
            : 'All Products'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Browse the catalogue and narrow it down with the filters.
        </Typography>
      </Box> */}

      <HeroBanner />
      <Box sx={{ display: "flex", gap: { md: 4 }, alignItems: "flex-start" }}>
        {/* Desktop sidebar */}
        <Box
          component="aside"
          sx={{
            display: { xs: "none", md: "block" },
            width: 280,
            flexShrink: 0,
            position: "sticky",
            top: 88,
          }}
        >
          <FilterPanel />
        </Box>

        {/* Mobile filter drawer */}
        <Drawer
          anchor="left"
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          PaperProps={{ sx: { width: "85%", maxWidth: 340 } }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Filters
            </Typography>
            <IconButton
              onClick={() => setMobileFiltersOpen(false)}
              size="small"
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <FilterPanel />
        </Drawer>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <ListingToolbar onOpenFilters={() => setMobileFiltersOpen(true)} />

          {store.listLoading && <LoadingGrid />}

          {!store.listLoading && store.listError && (
            <ErrorState message={store.listError} onRetry={handleRetry} />
          )}

          {showEmptyState && (
            <EmptyState onClearFilters={() => store.resetFilters()} />
          )}

          {!store.listLoading &&
            !store.listError &&
            store.pagedProducts.length > 0 && (
              <>
                <ProductGrid
                  products={store.pagedProducts}
                  returnQuery={returnQuery}
                />
                <Stack alignItems="center" sx={{ mt: { xs: 3, md: 4 } }}>
                  <Pagination
                    count={store.totalPages}
                    page={Math.min(store.filters.page, store.totalPages)}
                    onChange={(_, page) => {
                      store.setPage(page);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    color="primary"
                    size="medium"
                    shape="rounded"
                  />
                </Stack>
              </>
            )}
        </Box>
      </Box>
    </Container>
  );
});
