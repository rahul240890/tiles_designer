"use client";

import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { TileCollectionResponse } from "@/app/sellers/types/tilesInCollection";

interface CollectionAttributesGridProps {
  collection: TileCollectionResponse["collection"];
}

const CollectionAttributesGrid: React.FC<CollectionAttributesGridProps> = ({ collection }) => {
  return (
    <Grid container spacing={1} sx={{ mb: 2 }}>
      {/* ✅ Size */}
      <Grid item xs={12} sm={6} lg={3}>
        <Box bgcolor="primary.light" p={3} borderRadius={2}>
          <Typography variant="subtitle1">Size</Typography>
          <Typography fontWeight={500}>{collection.size || "N/A"}</Typography>
        </Box>
      </Grid>

      {/* ✅ Series (Only Show if Available) */}
      {collection.series && (
        <Grid item xs={12} sm={6} lg={2}>
          <Box bgcolor="secondary.light" p={3} borderRadius={2}>
            <Typography variant="subtitle1">Series</Typography>
            <Typography fontWeight={500}>{collection.series}</Typography>
          </Box>
        </Grid>
      )}

      {/* ✅ Material (Only Show if Available) */}
      {collection.material && (
        <Grid item xs={12} sm={6} lg={2}>
          <Box bgcolor="success.light" p={3} borderRadius={2}>
            <Typography variant="subtitle1">Material</Typography>
            <Typography fontWeight={500}>{collection.material}</Typography>
          </Box>
        </Grid>
      )}

      {/* ✅ Finish (Only Show if Available) */}
      {collection.finish && (
        <Grid item xs={12} sm={6} lg={2}>
          <Box bgcolor="warning.light" p={3} borderRadius={2}>
            <Typography variant="subtitle1">Finish</Typography>
            <Typography fontWeight={500}>{collection.finish}</Typography>
          </Box>
        </Grid>
      )}

      {/* ✅ Category (Only Show if Available) */}
      {collection.category && (
        <Grid item xs={12} sm={6} lg={3}>
          <Box bgcolor="info.light" p={3} borderRadius={2}>
            <Typography variant="subtitle1">Category</Typography>
            <Typography fontWeight={500}>{collection.category}</Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default CollectionAttributesGrid;
