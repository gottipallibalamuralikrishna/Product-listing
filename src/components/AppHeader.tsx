import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Storefront from "@mui/icons-material/StorefrontRounded";
import { observer } from "mobx-react-lite";
import { useProductStore } from "@/stores/StoreContext";

export const AppHeader = observer(function AppHeader() {
  const store = useProductStore();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: { xs: 1.5, sm: 3 }, py: 1 }}>
        <Box
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Storefront />
          <Typography
            variant="h6"
            component="span"
            sx={{
              display: { xs: "none", sm: "block" },
              fontWeight: 700,
              letterSpacing: 0.2,
            }}
          >
            Product Explorer
          </Typography>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            bgcolor: "rgba(255,255,255,0.12)",
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            maxWidth: 480,
            ml: { xs: 0, sm: "auto" },
          }}
        >
          <SearchRoundedIcon
            sx={{ color: "rgba(255,255,255,0.7)", mr: 1 }}
            fontSize="small"
          />
          <InputBase
            placeholder="Search products…"
            value={store.filters.search}
            onChange={(e) => store.setSearch(e.target.value)}
            fullWidth
            sx={{ color: "#FBF8F1", fontSize: 14 }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
});
