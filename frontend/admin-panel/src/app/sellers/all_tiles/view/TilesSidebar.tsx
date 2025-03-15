"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { SidebarFilters } from "../../types/allSellerTiles";
import { fetchSidebarFilters } from "../../api/allSellerTiles";

const drawerWidth = 280;

interface TilesSidebarProps {
  sellerId: string;
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  priorityFilter: string;
  setPriorityFilter: React.Dispatch<React.SetStateAction<string>>;
  totalTiles: number; // Total tile count
}

const TilesSidebar: React.FC<TilesSidebarProps> = ({
  sellerId,
  selectedFilters,
  setSelectedFilters,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  totalTiles,
}) => {
  const [filters, setFilters] = useState<SidebarFilters | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await fetchSidebarFilters();
        setFilters(data);
      } catch (error) {
        console.error("Error fetching sidebar filters:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFilters();
  }, [sellerId]);

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      if (!updatedFilters[category]) updatedFilters[category] = [];
  
      if (updatedFilters[category].includes(value)) {
        updatedFilters[category] = updatedFilters[category].filter((v) => v !== value);
      } else {
        updatedFilters[category].push(value);
      }
  
      console.log("Updated Filters:", updatedFilters); // ✅ Debugging filters being applied
      return updatedFilters;
    });
  };
  

  const handleClearFilter = (category: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((v) => v !== value),
    }));
  };

  if (loading) {
    return (
      <Box width={drawerWidth} display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, position: "relative" } }}
    >
      <Box sx={{ width: drawerWidth, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>

        {/* Display total tile count */}
        <Typography variant="subtitle2" color="textSecondary" mb={2}>
          Total Tiles: {totalTiles}
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {Object.entries(selectedFilters).flatMap(([category, values]) =>
            values.map((value) => (
              <Chip
                key={`${category}-${value}`}
                label={`${category}: ${filters?.[category as keyof SidebarFilters]?.find((f) => f.id === value)?.name || value}`}
                onDelete={() => handleClearFilter(category, value)}
                deleteIcon={<CloseIcon />}
                color="primary"
                variant="outlined"
              />
            ))
          )}
        </Box>

        {[
          { name: "Collection", key: "collections" },
          { name: "Category", key: "categories" },
          { name: "Series", key: "series" },
          { name: "Finishing", key: "finishes" },
          { name: "Size", key: "sizes" },
          { name: "Material", key: "materials" },
          { name: "Colors", key: "colors" },
        ].map(({ name, key }) => (
          <Accordion
            key={key}
            expanded={expanded === key}
            onChange={() => setExpanded(expanded === key ? false : key)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {filters?.[key as keyof SidebarFilters]?.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    control={
                      <Checkbox
                        checked={selectedFilters[key]?.includes(item.id) || false}
                        onChange={() => handleFilterChange(key, item.id)}
                      />
                    }
                    label={
                      key === "colors" ? (
                        <Box display="flex" alignItems="center">
                          <Box
                            sx={{ width: 20, height: 20, mr: 1, borderRadius: "50%" }}
                          />
                          {item.name}
                        </Box>
                      ) : (
                        item.name
                      )
                    }
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Drawer>
  );
};

export default TilesSidebar;