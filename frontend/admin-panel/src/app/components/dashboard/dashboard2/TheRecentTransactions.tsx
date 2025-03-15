import React from "react";
import { Stack, Typography, Avatar, Box, Button, Divider } from "@mui/material";
import DashboardCard from "../../shared/DashboardCard";
import {
  IconCheck,
  IconCreditCard,
  IconCurrencyDollar,
  IconShield,
} from "@tabler/icons-react";

const RecentTransactions = () => {
  const stats = [
    {
      title: "PayPal Transfer",
      subtitle: "Money Added",
      price: 350,
      color: "primary",
      icon: <IconCurrencyDollar width={20} height={20} />,
    },
    {
      title: "Wallet",
      subtitle: "Bill payment",
      price: 60,
      color: "success",
      icon: <IconShield width={20} height={20} />,
    },
    {
      title: "Credit Card",
      subtitle: "Money reversed",
      price: 350,
      color: "error",
      icon: <IconCreditCard width={20} height={20} />,
    },
    {
      title: "Bank Transfer",
      subtitle: "Money added",
      price: 345,
      color: "warning",
      icon: <IconCheck width={20} height={20} />,
    },
    {
      title: "Refund",
      subtitle: "Payment Sent",
      price: 50,
      color: "primary",
      icon: <IconCurrencyDollar width={20} height={20} />,
    },
  ];

  return (
    <DashboardCard title="Recent Transactions">
      <>
        <Stack spacing={3} my={3}>
          {stats.map((stat, i) => (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
              key={i}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: stat.color + ".light",
                    color: stat.color + ".main",
                    width: 45,
                    height: 45,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="h5">
                    {stat.title}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {stat.subtitle}
                  </Typography>
                </Box>
              </Stack>
              {stat.price < 300 ? (
                <Typography variant="subtitle2" color="error.main">
                  -${stat.price}
                </Typography>
              ) : (
                <Typography variant="subtitle2" color="success.main">
                  +${stat.price}
                </Typography>
              )}
            </Stack>
          ))}
        </Stack>
        <Divider />
        <Stack
          direction="row" mt={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Button variant="contained" color="primary">
            Add
          </Button>
          <Typography variant="subtitle2" fontSize="12px">
            36 Recent Transactions
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default RecentTransactions;
