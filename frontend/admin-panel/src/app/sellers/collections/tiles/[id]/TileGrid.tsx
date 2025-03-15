"use client";

import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  CardActions,
  Tooltip,
  Switch,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import { getImageUrl } from "@/utils/backendPath";
import { deleteTile, toggleFavoriteTile, toggleTileStatus } from "@/app/sellers/api/allSellerTiles";
import { Tile } from "@/app/sellers/types/allSellerTiles";

interface TilesGridViewProps {
  tiles?: Tile[]; // ✅ Make it optional to prevent undefined errors
  lastTileRef?: (node: HTMLDivElement | null) => void;
}

const TilesGridView: React.FC<TilesGridViewProps> = ({ tiles = [], lastTileRef }) => {  // ✅ Default to empty array

  const handleToggleFavorite = async (sellerId: string, tileId: string, isFavorite: boolean) => {
    await toggleFavoriteTile(tileId);
  };

  const handleDeleteTile = async (tileId: string) => {
    if (confirm("Are you sure you want to delete this tile?")) {
      await deleteTile(tileId);
    }
  };

  const handleToggleStatus = async (tileId: string) => {
    await toggleTileStatus(tileId);
  };

  return (
    <Grid container spacing={2}>
      {tiles.map((tile, index) => (
        <Grid item key={tile.id} xs={12} sm={6} md={3} ref={index === tiles.length - 1 ? lastTileRef : null}>
          <Card sx={{ maxWidth: "100%", position: "relative" }}>
            {/* Tile Image */}
            <CardMedia
              component="img"
              image={getImageUrl(tile.image_url)}
              alt={tile.name}
              sx={{
                width: "100%",
                height: "250px",
                objectFit: "contain",
                backgroundColor: "#f5f5f5",
              }}
              onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
            />

            {/* Tile Details */}
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {tile.name || "Untitled Tile"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Priority: {tile.priority} | Usage: {tile.usage_count}
              </Typography>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: tile.hex_code,
                  borderRadius: "50%",
                  display: "inline-block",
                  marginLeft: "8px",
                }}
              />
            </CardContent>

            {/* Tile Actions */}
            <CardActions>
              {/* Toggle Active/Inactive */}
              <Tooltip title={tile.status === "active" ? "Deactivate Tile" : "Activate Tile"}>
                <Switch checked={tile.status === "active"} onChange={() => handleToggleStatus(tile.id)} color="primary" />
              </Tooltip>

              {/* Toggle Favorite */}
              <Tooltip title="Mark as Favorite">
                <IconButton color="error" onClick={() => handleToggleFavorite("SELLER_ID_HERE", tile.id, tile.is_favorite)}>
                  {tile.is_favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>

              {/* Delete Tile */}
              <Tooltip title="Delete Tile">
                <IconButton color="error" onClick={() => handleDeleteTile(tile.id)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TilesGridView;