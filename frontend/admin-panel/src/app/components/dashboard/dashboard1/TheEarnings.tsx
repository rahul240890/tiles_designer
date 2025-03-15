import React from "react";
import { Card, CardContent, Typography, Avatar, Stack } from "@mui/material";
import { IconCurrencyDollar } from "@tabler/icons-react";

const Earnings = () => (
  <Card
    sx={{
      backgroundColor: (theme) => theme.palette.secondary.main,
      color: "white",
    }}
  >
    <CardContent>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h3" gutterBottom>
          Earnings
        </Typography>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: "white",
            color: (theme:any) => theme.palette.mode === 'light' ? "#000" : "#000",
          }}
        >
          <IconCurrencyDollar width="20" height="20" />
        </Avatar>
      </Stack>
      <Typography variant="h1" fontWeight="500" mt={5}>
        $93,438.78
      </Typography>
      <Typography
        variant="h6"
        fontWeight="400"
        sx={{
          opacity: "0.6",
        }}
      >
        Monthly Revenue
      </Typography>
    </CardContent>
  </Card>
);

export default Earnings;
