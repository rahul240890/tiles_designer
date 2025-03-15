import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Fab,
  Box,
  Stack,
  Avatar,
} from "@mui/material";
import { IconCurrencyDollar } from "@tabler/icons-react";

const Earnings = () => (
  <Card
    sx={{
      backgroundColor: "secondary.main",
    }}
  >
    <CardContent>
      <Stack direction="row" justifyContent="space-between" gap={2}>
        <Typography variant="h3" color="#fff">
          Earnings
        </Typography>
        <Avatar
          sx={{
            bgcolor: "primary.main",
            color: "white",
            width: 48,
            height: 48,
          }}
        >
          <IconCurrencyDollar width="24" height="24" />
        </Avatar>
      </Stack>

      <Typography variant="h1" color="#fff" mt={4}>
        $93,438
      </Typography>
      <Typography
        variant="subtitle1"
        color="#fff"
        mt="-4px"
        sx={{
          opacity: "0.5",
        }}
      >
        Monthly revenue
      </Typography>
    </CardContent>
  </Card>
);

export default Earnings;
