import { observer } from 'mobx-react-lite';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useProductStore } from '@/stores/StoreContext';
import type { SortOption } from '@/types/product';

interface ListingToolbarProps {
  onOpenFilters: () => void;
}

export const ListingToolbar = observer(function ListingToolbar({ onOpenFilters }: ListingToolbarProps) {
  const store = useProductStore();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{ mb: { xs: 2, md: 3 } }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Button
          variant="outlined"
          size="small"
          startIcon={<TuneRoundedIcon />}
          onClick={onOpenFilters}
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
        >
          Filters
        </Button>
        <Typography variant="body2" color="text.secondary">
          {store.listLoading ? 'Loading…' : `${store.totalFilteredCount} products`}
        </Typography>
      </Stack>

      <FormControl size="small" sx={{ minWidth: { xs: 130, sm: 170 } }}>
        <InputLabel id="sort-label">Sort by</InputLabel>
        <Select
          labelId="sort-label"
          label="Sort by"
          value={store.filters.sort}
          onChange={(e) => store.setSort(e.target.value as SortOption)}
        >
          <MenuItem value="default">Relevance</MenuItem>
          <MenuItem value="price-asc">Price: Low to High</MenuItem>
          <MenuItem value="price-desc">Price: High to Low</MenuItem>
          <MenuItem value="rating-desc">Rating</MenuItem>
          <MenuItem value="title-asc">Name: A–Z</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
});
