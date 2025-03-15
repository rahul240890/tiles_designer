import React from "react";
import {
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Grid2 as Grid,
  Button,
  Divider,
  Tooltip,
  Stack,
} from "@mui/material";

import DashboardCard from "../../shared/DashboardCard";
import { IconDots } from "@tabler/icons-react";
import theme from "@/utils/theme";

const options = ["Action", "Another Action", "Something else here"];

const MedicalproBranding = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    (<DashboardCard
      title="MedicalPro Branding"
      action={
        <Box>
          <Tooltip title="Action">
            <IconButton
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
              size="small"
              aria-label="action"
            >
              <IconDots width={20} />
            </IconButton>
          </Tooltip>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {options.map((option) => (
              <MenuItem
                key={option}
                selected={option === "Pyxis"}
                onClick={handleClose}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      }
    >
      <>
        <Chip
          size="small"
          label="16 APR, 2021"
          sx={{
            backgroundColor: (theme) => theme.palette.secondary.light,
            color: (theme) => theme.palette.secondary.main,
            borderRadius: "6px",
            px: 1,
          }}
        />
        <Box mt={3}>
          <Grid container spacing={0}>
            <Grid
              sx={{
                pb: 2,
              }}
              size={{
                xs: 4,
                lg: 4
              }}>
              <Typography color="textSecondary" variant="subtitle2">
                Due Date
              </Typography>
              <Typography variant="subtitle2" fontWeight="500">
                Oct 23, 2021
              </Typography>
            </Grid>
            <Grid
              sx={{
                pb: 2,
                pl: 1,
                borderLeft: `1px solid ${theme.palette.divider}`,
                borderRight: `1px solid ${theme.palette.divider}`,
              }}
              size={{
                xs: 4,
                lg: 4
              }}>
              <Typography color="textSecondary" variant="subtitle2">
                Budget
              </Typography>
              <Typography variant="subtitle2" fontWeight="500">
                $98,500
              </Typography>
            </Grid>
            <Grid
              sx={{
                pl: 1,
                pb: 2,
              }}
              size={{
                xs: 4,
                lg: 4
              }}>
              <Typography color="textSecondary" variant="subtitle2">
                Expense
              </Typography>
              <Typography variant="subtitle2" fontWeight="500">
                $63,000
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Box
          sx={{
            pt: 2,
            pb: 3,
          }}
        >
          <Typography variant="h6" fontSize="14px">
            Teams
          </Typography>
          <Box display="flex" alignItems="center" mt={1} gap={1}>
            <Chip
              size="small"
              label="Bootstrap"
              color="warning"
              sx={{
                borderRadius: "6px",
                px: 1,
              }}
            />
            <Chip
              size="small"
              label="Angular"
              color="error"
              sx={{
                borderRadius: "6px",
                px: 1,
              }}
            />
          </Box>
        </Box>
        <Divider />
        <Box py={2}>
          <Typography variant="h6" fontSize="14px">
            Leaders
          </Typography>
          <Stack direction="row" spacing={1} mt={1}>
            <Avatar src="/images/users/1.jpg" sx={{ width: 35, height: 35 }} />
            <Avatar src="/images/users/2.jpg" sx={{ width: 35, height: 35 }} />
            <Avatar src="/images/users/3.jpg" sx={{ width: 35, height: 35 }} />
            <Avatar src="/images/users/4.jpg" sx={{ width: 35, height: 35 }} />
          </Stack>
        </Box>
        <Divider />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pt={3}
        >
          <Button variant="contained" color="primary">
            Add
          </Button>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            fontWeight="400"
          >
            36 Recent Transactions
          </Typography>
        </Box>
      </>
    </DashboardCard>)
  );
};

export default MedicalproBranding;
