import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "#0F2E22", color: "rgba(251,248,241,0.7)", py: 3, mt: 6 }}
    >
      <Container maxWidth="xl">
        <Typography variant="body2">
          Product Explorer — built with React, MobX & MUI. Data from DummyJSON.
        </Typography>
      </Container>
    </Box>
  );
}
