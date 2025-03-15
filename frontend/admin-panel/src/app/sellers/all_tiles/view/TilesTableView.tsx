"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Tooltip,
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

interface TilesTableViewProps {
  tiles: Tile[];
  setTiles: React.Dispatch<React.SetStateAction<Tile[]>>; // ✅ Ensure we can update state
}

const TilesTableView: React.FC<TilesTableViewProps> = ({ tiles, setTiles }) => {
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
      ); // ✅ Update UI instantly
      showNotification("Tile status updated successfully!", "success");
    } catch (error) {
      showNotification("Failed to update tile status.", "error");
    }
  };

  // ✅ Confirm Delete Tile
  const confirmDeleteTile = (tileId: string) => {
    setDeleteTileId(tileId); // ✅ Open Modal
  };

  // ✅ Handle Tile Deletion
  const handleDeleteTile = async () => {
    if (!deleteTileId) return;
    try {
      await deleteTile(deleteTileId);
      setTiles((prevTiles) => prevTiles.filter((tile) => tile.id !== deleteTileId)); // ✅ Remove from UI instantly
      showNotification("Tile deleted successfully!", "success");
    } catch (error) {
      showNotification("Failed to delete tile.", "error");
    } finally {
      setDeleteTileId(null); // ✅ Close Modal
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tile Name</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Usage Count</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tiles.map((tile) => (
              <TableRow key={tile.id}>
                <TableCell>{tile.name || "Untitled Tile"}</TableCell>
                <TableCell>{tile.priority}</TableCell>
                <TableCell>{tile.usage_count}</TableCell>
                <TableCell>
                  <Switch
                    checked={tile.status === "active"}
                    onChange={() => handleToggleStatus(tile.id)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Delete Tile">
                    <IconButton color="error" onClick={() => confirmDeleteTile(tile.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

export default TilesTableView;
