import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { useProductStore } from "@/stores/StoreContext";

export const HeroBanner = observer(function HeroBanner() {
  const store = useProductStore();
  const topCategories = store.categories.slice(0, 8);

  return (
    <Box
      sx={{
        backgroundImage:
          "linear-gradient(120deg, #0F2E22 0%, #16402F 55%, #1E5240 100%)",
        color: "#FBF8F1",
        pb: { xs: 5, md: 7 },
        pt: { xs: 4, md: 6 },
        mb: { xs: 3, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={2} sx={{ maxWidth: 640 }}>
          <Typography variant="h3" fontWeight={800}>
            Find exactly what you're looking for
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(251,248,241,0.8)" }}>
            {store.allProducts.length > 0
              ? `${store.allProducts.length}+ products across ${store.categories.length} categories — filter by price, brand and category below.`
              : "Browse products, filter by price and brand, and drill into any category."}
          </Typography>
        </Stack>

        {topCategories.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 3 }}
          >
            <Chip
              label="All"
              onClick={() => store.setCategory(null)}
              variant={store.filters.category === null ? "filled" : "outlined"}
              sx={chipSx(store.filters.category === null)}
            />
            {topCategories.map((cat) => (
              <Chip
                key={cat.slug}
                label={cat.name}
                onClick={() => store.setCategory(cat.slug)}
                variant={
                  store.filters.category === cat.slug ? "filled" : "outlined"
                }
                sx={chipSx(store.filters.category === cat.slug)}
              />
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
});

function chipSx(selected: boolean) {
  return {
    color: selected ? "#12372A" : "#FBF8F1",
    bgcolor: selected ? "#FBF8F1" : "transparent",
    borderColor: "rgba(251,248,241,0.4)",
    fontWeight: 600,
    "&:hover": {
      color: selected ? "#12372A" : "#FBF8F1",
      bgcolor: selected ? "#FBF8F1" : "rgba(251,248,241,0.12)",
      borderColor: "rgba(251,248,241,0.6)",
    },
    "&:focus": {
      color: selected ? "#12372A" : "#FBF8F1",
      bgcolor: selected ? "#FBF8F1" : "rgba(251,248,241,0.12)",
    },
  };
}
