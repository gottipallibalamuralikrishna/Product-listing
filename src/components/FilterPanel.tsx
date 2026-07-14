import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import { useProductStore } from "@/stores/StoreContext";
import type { Category } from "@/types/product";

export const FilterPanel = observer(function FilterPanel() {
  const store = useProductStore();
  const { filters, categories, availableBrands, hasActiveFilters } = store;

  const selectedCategory =
    categories.find((c) => c.slug === filters.category) ?? null;

  return (
    <Stack spacing={3} sx={{ p: { xs: 2, md: 0 } }}>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1.5 }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Filters
          </Typography>
          {hasActiveFilters && (
            <Button
              size="small"
              onClick={() => store.resetFilters()}
              color="secondary"
            >
              Clear all
            </Button>
          )}
        </Stack>
        <Divider />
      </Box>

      {/* Category — single-select dropdown */}
      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Category
        </Typography>
        <Autocomplete
          size="small"
          options={categories}
          value={selectedCategory}
          getOptionLabel={(opt: Category) => opt.name}
          isOptionEqualToValue={(opt, val) => opt.slug === val.slug}
          onChange={(_, value) => store.setCategory(value ? value.slug : null)}
          renderInput={(params) => (
            <TextField {...params} placeholder="All categories" />
          )}
        />
      </Box>

      <Divider />

      {/* Price range — unchanged, plain inputs */}
      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Price range
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <TextField
            label="Min"
            type="number"
            size="small"
            fullWidth
            value={filters.minPrice}
            onChange={(e) =>
              store.setPriceRange(e.target.value, filters.maxPrice)
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="Max"
            type="number"
            size="small"
            fullWidth
            value={filters.maxPrice}
            onChange={(e) =>
              store.setPriceRange(filters.minPrice, e.target.value)
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </Box>

      <Divider />

      {/* Brand — multi-select dropdown with chips, replaces the checkbox list */}
      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Brand
        </Typography>
        <Autocomplete
          multiple
          size="small"
          options={availableBrands}
          value={filters.brands}
          disableCloseOnSelect
          onChange={(_, value) => {
            const removed = filters.brands.filter((b) => !value.includes(b));
            const added = value.filter((b) => !filters.brands.includes(b));
            [...removed, ...added].forEach((b) => store.toggleBrand(b));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={filters.brands.length ? "" : "Any brand"}
            />
          )}
          noOptionsText="No brands available"
        />
      </Box>
    </Stack>
  );
});
