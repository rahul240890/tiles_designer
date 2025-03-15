"use client";
import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react";
import { Tile } from "../types";

interface TileTableProps {
  tiles: Tile[];
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
}

export default function TileTable({ tiles, onDelete, onActivate, onDeactivate }: TileTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Material</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tiles.map((tile) => (
            <TableRow key={tile.id || Math.random()}>  {/* ✅ Ensure unique key */}
              <TableCell>{tile.name}</TableCell>
              <TableCell>{tile.category}</TableCell>
              <TableCell>{tile.size}</TableCell>
              <TableCell>{tile.material}</TableCell>
              <TableCell>{tile.status === "Active" ? "✅ Active" : "❌ Inactive"}</TableCell>
              <TableCell>
                <IconButton color="primary"><IconEdit /></IconButton>
                {tile.id && (  // ✅ Only show delete/activate buttons if `id` exists
                  <>
                    <IconButton color="error" onClick={() => onDelete(tile.id!)}><IconTrash /></IconButton>
                    {tile.status === "Active" ? (
                      <IconButton color="warning" onClick={() => onDeactivate(tile.id!)}><IconX /></IconButton>
                    ) : (
                      <IconButton color="success" onClick={() => onActivate(tile.id!)}><IconCheck /></IconButton>
                    )}
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
