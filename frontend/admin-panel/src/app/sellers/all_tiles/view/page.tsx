"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  CircularProgress,
  TextField,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
} from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import PageContainer from "@/app/components/container/PageContainer";
import { Tile } from "../../types/allSellerTiles";
import { fetchAllTiles } from "../../api/allSellerTiles";
import TilesSidebar from "./TilesSidebar";
import TilesGridView from "./TilesGridView";
import TilesTableView from "./TilesTableView";

const TilesPage = ({ sellerId }: { sellerId: string }) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewType, setViewType] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [favoriteOnly, setFavoriteOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lastTileId, setLastTileId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [totalTiles, setTotalTiles] = useState<number>(0); // Total tile count

  const observer = useRef<IntersectionObserver | null>(null);
  const isFetching = useRef(false); // Prevent multiple simultaneous fetches

  // Debounce search input
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchTiles = useCallback(
    async (reset = false) => {
      if (isFetching.current || (!reset && !hasMore)) return;
      isFetching.current = true;
      setLoading(true);

      try {
        const params: Record<string, any> = {
          seller_id: sellerId,
          last_id: reset ? undefined : lastTileId || undefined,
          limit: 2000,
          sort_by: sortBy,
          order,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
          favorite: favoriteOnly ? "true" : undefined,
          search: searchQuery || undefined,
        };

        // ✅ Ensure sidebar filters are added to the API request
        // ✅ Ensure sidebar filters are added to API request
        Object.entries(selectedFilters).forEach(([key, values]) => {
          if (values.length > 0) {
            const paramKey =
              key === "collections"
                ? "collection_id"
                : key === "categories"
                  ? "category_id"
                  : key === "series"
                    ? "series_id"
                    : key === "finishes"
                      ? "finish_id"
                      : key === "sizes"
                        ? "size_id"
                        : key === "materials"
                          ? "material_id"
                          : key === "colors"
                            ? "color_id"
                            : key;

            console.log(`Adding Filter: ${paramKey} → ${values}`); // ✅ Debugging

            params[paramKey] = values; // ✅ Send as an array instead of comma-separated string
          }
        });



        console.log("Fetching tiles with params:", params);

        const data = await fetchAllTiles(params);
        console.log("API Response:", data);

        // ✅ Handle case where API returns an array instead of an object
        if (!data || (!Array.isArray(data) && !data.tiles)) {
          console.error("Invalid API response format:", data);
          setHasMore(false);
          return;
        }

        const tilesData = Array.isArray(data) ? data : data.tiles; // ✅ Support both array & object response formats

        // ✅ Prevent duplicate tiles from appearing
        setTiles((prev) =>
          reset ? tilesData : [...prev, ...tilesData.filter((t: { id: string; }) => !prev.some((p) => p.id === t.id))]
        );

        setLastTileId(tilesData.length > 0 ? tilesData[tilesData.length - 1].id : null);
        setHasMore(tilesData.length === 20);

        // ✅ Update total tile count (if API returns total_count)
        if (reset) {
          setTotalTiles(data.total_count || tilesData.length);
        }
      } catch (error) {
        console.error("Error fetching tiles:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    },
    [
      sellerId,
      lastTileId,
      sortBy,
      order,
      statusFilter,
      priorityFilter,
      favoriteOnly,
      searchQuery,
      selectedFilters,
      hasMore,
    ]
  );



  // Fetch tiles on filter changes or initial load
  useEffect(() => {
    setTiles([]); // ✅ Clear tiles when filters change
    setLastTileId(null);
    setHasMore(true);
    fetchTiles(true); // ✅ Fetch new data when sidebar filter changes
  }, [sortBy, order, statusFilter, priorityFilter, favoriteOnly, searchQuery, selectedFilters]);

  useEffect(() => {
    fetchTiles(true); // Initial load
  }, []);

  const debouncedSearch = debounce((value: string) => setSearchQuery(value), 500);

  return (
    <PageContainer title="All Tiles" description="Browse and manage all tiles">
      <Box display="flex">
        <TilesSidebar
          sellerId={sellerId}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          totalTiles={totalTiles} // Pass total tile count to sidebar
        />
        <Box flex={1} p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField
                label="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                sx={{ minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="created_at">Created Date</MenuItem>
                <MenuItem value="usage_count">Usage Count</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
              </TextField>
              <TextField
                select
                label="Order"
                value={order}
                onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </TextField>
              <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
              <TextField
                select
                label="Priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="1">Low</MenuItem>
                <MenuItem value="2">Medium</MenuItem>
                <MenuItem value="3">High</MenuItem>
              </TextField>
              <TextField
                select
                label="Favorites"
                value={favoriteOnly ? "true" : "false"}
                onChange={(e) => setFavoriteOnly(e.target.value === "true")}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="false">All Tiles</MenuItem>
                <MenuItem value="true">Only Favorites</MenuItem>
              </TextField>
            </Box>
            <ToggleButtonGroup value={viewType} exclusive onChange={(_, newView) => newView && setViewType(newView)}>
              <ToggleButton value="grid">
                <GridViewIcon />
              </ToggleButton>
              <ToggleButton value="table">
                <TableViewIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {tiles.length === 0 && !loading ? (
            <Box textAlign="center" mt={4}>
              No tiles found.
            </Box>
          ) : viewType === "grid" ? (
            <TilesGridView tiles={tiles} setTiles={setTiles} />
          ) : (
            <TilesTableView tiles={tiles} setTiles={setTiles} />
          )}
          

          {loading && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Box>
    </PageContainer>
  );
};

export default TilesPage;