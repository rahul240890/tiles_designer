"use client";

import React from "react";
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
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteTile, toggleTileStatus } from "../../../api/tilesInCollection";
import { TileResponse } from "../../../types/tilesInCollection";
import { getImageUrl } from "@/utils/backendPath";

interface TileTableProps {
  tiles: TileResponse[];
  onTileUpdate: () => void; // Callback to refresh list after actions
}

// ✅ Function to Display Priority as Text
const getPriorityText = (priority: number) => {
  switch (priority) {
    case 3:
      return "High";
    case 2:
      return "Medium";
    case 1:
      return "Low";
    default:
      return "Unknown";
  }
};

const TileTable: React.FC<TileTableProps> = ({ tiles, onTileUpdate }) => {
  const handleToggleStatus = async (tileId: string) => {
    await toggleTileStatus(tileId);
    onTileUpdate(); // Refresh tile list
  };

  const handleDeleteTile = async (tileId: string) => {
    if (confirm("Are you sure you want to delete this tile?")) {
      await deleteTile(tileId);
      onTileUpdate(); // Refresh tile list
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Tile Name</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Thickness (mm)</TableCell>
            <TableCell>Color</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Usage Count</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tiles.map((tile) => (
            <TableRow key={tile.id}>
              {/* ✅ Image */}
              <TableCell>
                <img
                  src={getImageUrl(tile.image_url)}
                  alt={tile.name}
                  style={{ width: 50, height: 50, objectFit: "contain", backgroundColor: "#f5f5f5" }}
                  onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                />
              </TableCell>

              {/* ✅ Tile Name */}
              <TableCell>{tile.name || "Untitled Tile"}</TableCell>

              {/* ✅ Priority (High, Medium, Low) */}
              <TableCell>{getPriorityText(tile.priority)}</TableCell>

              {/* ✅ Thickness */}
              <TableCell>{tile.thickness || "N/A"}</TableCell>

              {/* ✅ Color Name */}
              <TableCell>{tile.color_name || "N/A"}</TableCell>

              {/* ✅ Toggle Active/Inactive */}
              <TableCell>
                <Switch
                  checked={tile.status === "active"}
                  onChange={() => handleToggleStatus(tile.id)}
                  color="primary"
                />
              </TableCell>

              {/* ✅ Usage Count */}
              <TableCell>{tile.usage_count}</TableCell>

              {/* ✅ Actions: Favorite & Delete */}
              <TableCell>
                {/* Toggle Favorite (Placeholder - To Be Implemented Later) */}
                <Tooltip title="Mark as Favorite">
                  <IconButton color="error">
                    <FavoriteBorderIcon />
                  </IconButton>
                </Tooltip>

                {/* Delete Tile */}
                <Tooltip title="Delete Tile">
                  <IconButton color="error" onClick={() => handleDeleteTile(tile.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TileTable;
