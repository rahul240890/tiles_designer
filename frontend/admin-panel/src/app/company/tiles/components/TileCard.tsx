"use client";
import React from "react";
import { Grid, Card, CardContent, Typography, IconButton, CardMedia } from "@mui/material";
import { IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react";
import { Tile } from "../types";

interface TileCardProps {
  tiles: Tile[];
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
}

export default function TileCard({ tiles, onDelete, onActivate, onDeactivate }: TileCardProps) {
  return (
    <Grid container spacing={2}>
      {tiles.map((tile) => (
        <Grid item xs={12} sm={6} md={4} key={tile.id || Math.random()}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={tile.image_url || "/default-tile.jpg"}
              alt={tile.name}
            />
            <CardContent>
              <Typography variant="h6">{tile.name}</Typography>
              <Typography variant="body2">{tile.category}</Typography>
              <Typography variant="body2">{tile.size}</Typography>
              <Typography variant="body2">{tile.material}</Typography>
              <Typography variant="body2">
                {tile.status === "Active" ? "✅ Active" : "❌ Inactive"}
              </Typography>
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
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
