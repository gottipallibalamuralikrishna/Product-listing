import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import type { Product } from "@/types/product";
import { Box } from "@mui/material";

interface ProductCardProps {
  product: Product;
  /** Query string (e.g. "?category=beauty&page=2") appended to the detail link so filters survive Back. */
  returnQuery: string;
}

export function ProductCard({ product, returnQuery }: ProductCardProps) {
  const navigate = useNavigate();
  const hasDiscount = product.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 2px 8px rgba(18,55,42,0.06)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: { xs: "none", sm: "translateY(-6px)" },
          boxShadow: "0 20px 32px rgba(18, 55, 42, 0.16)",
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/product/${product.id}${returnQuery}`)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            image={product.thumbnail}
            alt={product.title}
            loading="lazy"
            sx={{
              height: { xs: 180, sm: 210, md: 230 },
              objectFit: "contain",
              bgcolor: "#FBF8F1",
              p: 2.5,
            }}
          />
          {hasDiscount && (
            <Chip
              label={`-${Math.round(product.discountPercentage)}%`}
              size="small"
              color="secondary"
              sx={{ position: "absolute", top: 10, left: 10, fontWeight: 800 }}
            />
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1, width: "100%", p: 2.5 }}>
          <Stack spacing={0.75}>
            <Chip
              label={product.category.replace(/-/g, " ")}
              size="small"
              variant="outlined"
              color="secondary"
              sx={{ alignSelf: "flex-start", textTransform: "capitalize" }}
            />
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                minHeight: { xs: "auto", sm: "3em" },
              }}
            >
              {product.title}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={0.5}>
              <StarRoundedIcon sx={{ fontSize: 18, color: "secondary.main" }} />
              <Typography variant="body2" color="text.secondary">
                {product.rating.toFixed(1)}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="baseline" spacing={1} pt={0.5}>
              <Typography
                variant="h6"
                component="span"
                color="primary.dark"
                fontWeight={700}
              >
                ${discountedPrice.toFixed(2)}
              </Typography>
              {hasDiscount && (
                <Typography
                  variant="body2"
                  component="span"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through" }}
                >
                  ${product.price.toFixed(2)}
                </Typography>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
