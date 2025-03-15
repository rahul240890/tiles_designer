import React from "react";
import Image from "next/image";
import {
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
  Stack,
  Avatar,
} from "@mui/material";

// images
import background2x from "/public/images/backgrounds/blog-bg2-2x.jpg";

import { IconClock, IconMessageCircle } from "@tabler/icons-react";
import BlankCard from "../../shared/BlankCard";

const BlogCard = () => (
  <BlankCard>
    <Image
      src={background2x}
      alt="img"
      style={{ width: "100%", height: "205px" }}
    />
    <CardContent>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography color="textSecondary" display="flex" alignItems="center">
          <IconClock width="20" height="20" />
        </Typography>

        <Typography color="textSecondary" variant="subtitle2" ml={1}>
          22 March, 2024
        </Typography>
      </Box>
      <Typography variant="h4">
        Super awesome, React 19 is coming soon!
      </Typography>
      <Box display="flex" alignItems="center" mt={1} pb={3}>
        <Chip
          label="Medium"
          size="small"
          sx={{
            backgroundColor: (theme) => theme.palette.secondary.main,
            color: "#fff",
            pl: "3px",
            pr: "3px",
            borderRadius: "6px",
          }}
        />
        <Chip
          label="Low"
          size="small"
          sx={{
            backgroundColor: (theme) => theme.palette.error.main,
            color: "#fff",
            pl: "3px",
            pr: "3px",
            borderRadius: "6px",
            ml: 2,
          }}
        />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Stack direction="row" gap={1}>
          <Avatar src="/images/users/1.jpg" sx={{ width: 40, height: 40 }} />
          <Avatar src="/images/users/2.jpg" sx={{ width: 40, height: 40 }} />
          <Avatar src="/images/users/3.jpg" sx={{ width: 40, height: 40 }} />
        </Stack>

        <IconButton>
          <IconMessageCircle width="20" height="20" />
        </IconButton>
      </Box>
    </CardContent>
  </BlankCard>
);

export default BlogCard;
