"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Stack, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import TableChartIcon from "@mui/icons-material/TableChart";
import PageContainer from "@/app/components/container/PageContainer";
import { getCollections, toggleFavoriteCollection } from "../../api/collection";
import GridCollections from "./GridCollections";
import TableCollections from "./TableCollections";
import ParentCard from "@/app/components/shared/ParentCard";
import { useRouter } from "next/navigation";
import { CollectionResponse } from "../../types/collection";
import BlankCard from "@/app/components/shared/BlankCard";

const CollapsibleTable = () => {
    const [collections, setCollections] = useState<CollectionResponse[]>([]);
    const [viewMode, setViewMode] = useState<"grid" | "table">("table");
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        async function fetchCollections() {
            try {
                const data = await getCollections();
                setCollections(data.filter((collection) => !collection.deleted_at)); // ✅ Exclude Soft Deleted Collections
            } catch (error) {
                console.error("Error fetching collections:", error);
            }
        }
        fetchCollections();
    }, []);

    // ✅ Toggle Favorite Status
    const handleToggleFavorite = async (collectionId: string) => {
        try {
            const response = await toggleFavoriteCollection(collectionId);
            setCollections((prev) =>
                prev.map((collection) =>
                    collection.id === collectionId ? { ...collection, is_favorite: response.is_favorite } : collection
                )
            );
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    return (
        <PageContainer title="Tile Collections" description="Manage your tile collections">
            <BlankCard>
                <Box>
                    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="Search Collections"
                            variant="outlined"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button
                                variant="contained"
                                startIcon={<AddCircleOutlineIcon />}
                                sx={{ fontSize: "16px", fontWeight: "bold", whiteSpace: "nowrap" }}
                                onClick={() => router.push("/sellers/collections/create")}
                            >
                                Add New Tile Collection
                            </Button>
                            

                            <IconButton onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}>
                                {viewMode === "grid" ? (
                                    <TableChartIcon fontSize="large" sx={{ color: "#ff9800" }} />
                                ) : (
                                    <ViewModuleIcon fontSize="large" sx={{ color: "#4caf50" }} />
                                )}
                            </IconButton>
                        </Stack>
                    </Stack>

                    {viewMode === "grid" ? (
                        <GridCollections
                            collections={collections}
                            setCollections={setCollections}
                            searchQuery={searchQuery}
                        />
                    ) : (
                        <TableCollections
                            collections={collections}
                            setCollections={setCollections}
                            searchQuery={searchQuery}
                        />
                    )}
                </Box>
            </BlankCard>
        </PageContainer>
    );
};

export default CollapsibleTable;
