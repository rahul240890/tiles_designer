import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import { IconCurrencyDollar } from "@tabler/icons-react";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";

const EarningsShop = () => {
  const customizer = useSelector((state: AppState) => state.customizer);

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        backgroundColor: (theme) =>
          `${theme.palette.mode === "dark" ? "#32363e" : ""}`,
        "&:before": {
          content: `""`,
          position: "absolute",
          right: customizer.activeDir === "rtl" ? "-138px" : "-135px",
          width: "100%",
          height: "100%",
          background: `url('/images/backgrounds/welcome-bg-2x-svg.svg') no-repeat center`,
          backgroundSize: "cover",
          transform: customizer.activeDir === "rtl" ? "scaleX(-1)" : "unset",
        },
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" mb={4}>
          <Box>
            <Typography fontWeight="500" variant="h4" color="textSecondary">
              Earnings
            </Typography>
            <Typography variant="h3">$63,438.78</Typography>
          </Box>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "secondary.main", color: "white"
            }}
          >
            <IconCurrencyDollar width="24" height="24" />
          </Avatar>
        </Stack>
        <Button variant="contained" color="primary">
          Download
        </Button>
      </CardContent>
    </Card>
  );
};

export default EarningsShop;
