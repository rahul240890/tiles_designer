"use client";

import React, { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tile } from "../../types/allSellerTiles";
import { deleteTile, toggleTileStatus } from "../../api/allSellerTiles";
import { useNotificationStore } from "@/store/notificationStore";
import { getImageUrl } from "@/utils/backendPath";

interface TilesGridViewProps {
  tiles: Tile[];
  setTiles: React.Dispatch<React.SetStateAction<Tile[]>>;
}

const TilesGridView: React.FC<TilesGridViewProps> = ({ tiles, setTiles }) => {
  const showNotification = useNotificationStore((state) => state.showNotification);
  const [deleteTileId, setDeleteTileId] = useState<string | null>(null);

  // ✅ Toggle Tile Status (Active/Inactive)
  const handleToggleStatus = async (tileId: string) => {
    try {
      await toggleTileStatus(tileId);
      setTiles((prevTiles) =>
        prevTiles.map((tile) =>
          tile.id === tileId ? { ...tile, status: tile.status === "active" ? "inactive" : "active" } : tile
        )
      );
      showNotification("Tile status updated successfully!", "success");
    } catch (error) {
      showNotification("Failed to update tile status.", "error");
    }
  };

  // ✅ Confirm Delete Tile
  const confirmDeleteTile = (tileId: string) => {
    setDeleteTileId(tileId);
  };

  // ✅ Handle Tile Deletion
  const handleDeleteTile = async () => {
    if (!deleteTileId) return;
    try {
      await deleteTile(deleteTileId);
      setTiles((prevTiles) => prevTiles.filter((tile) => tile.id !== deleteTileId));
      showNotification("Tile deleted successfully!", "success");
    } catch (error) {
      showNotification("Failed to delete tile.", "error");
    } finally {
      setDeleteTileId(null);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        {tiles.map((tile) => (
          <Grid item key={tile.id} xs={12} sm={6} md={3}>
            <Card sx={{ maxWidth: "100%", position: "relative" }}>
            <CardMedia
              component="img"
              image={getImageUrl(tile.image_url)}
              alt={tile.name}
              sx={{ width: "100%", height: "250px", objectFit: "contain", backgroundColor: "#f5f5f5" }}
              onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
            />
              <CardContent>
                <Typography>{tile.name || "Untitled Tile"}</Typography>
              </CardContent>
              <CardActions>
                <Tooltip title="Activate/Deactivate">
                  <Switch checked={tile.status === "active"} onChange={() => handleToggleStatus(tile.id)} />
                </Tooltip>
                <Tooltip title="Delete Tile">
                  <IconButton color="error" onClick={() => confirmDeleteTile(tile.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ✅ Delete Confirmation Modal */}
      <Dialog open={!!deleteTileId} onClose={() => setDeleteTileId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this tile?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTileId(null)}>Cancel</Button>
          <Button onClick={handleDeleteTile} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TilesGridView;
