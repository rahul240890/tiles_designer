"use client";

import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { CollectionResponse } from "@/app/sellers/types/collection";

interface CollectionAttributesGridProps {
  collection: CollectionResponse;
}

const CollectionAttributesGrid: React.FC<CollectionAttributesGridProps> = ({ collection }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} lg={3}>
        <Box bgcolor="primary.light" p={3}>
          <Typography variant="subtitle1">Size</Typography>
          <Typography fontWeight={500}>{collection.size.name}</Typography>
        </Box>
      </Grid>
      {collection.series && (
        <Grid item xs={12} sm={6} lg={3}>
          <Box bgcolor="secondary.light" p={3}>
            <Typography variant="subtitle1">Series</Typography>
            <Typography fontWeight={500}>{collection.series.name}</Typography>
          </Box>
        </Grid>
      )}
      {collection.material && (
        <Grid item xs={12} sm={6} lg={3}>
          <Box bgcolor="success.light" p={3}>
            <Typography variant="subtitle1">Material</Typography>
            <Typography fontWeight={500}>{collection.material.name}</Typography>
          </Box>
        </Grid>
      )}
      {collection.finish && (
        <Grid item xs={12} sm={6} lg={3}>
          <Box bgcolor="warning.light" p={3}>
            <Typography variant="subtitle1">Finish</Typography>
            <Typography fontWeight={500}>{collection.finish.name}</Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default CollectionAttributesGrid;