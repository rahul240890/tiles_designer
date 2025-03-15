"use client";

import React, { useState } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Switch,
    Modal,
    Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notificationStore";
import { deleteCollection, toggleCollectionStatus, toggleFavoriteCollection } from "../../api/collection";
import { CollectionResponse } from "../../types/collection";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface GridCollectionsProps {
    collections: CollectionResponse[];
    setCollections: React.Dispatch<React.SetStateAction<CollectionResponse[]>>;
    searchQuery: string;
}

const GridCollections: React.FC<GridCollectionsProps> = ({ collections, setCollections, searchQuery }) => {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState<"delete" | "duplicate" | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

    // ✅ Handle Toggle Activation Status
    const handleToggleStatus = async (collectionId: string, currentStatus: "active" | "inactive") => {
        try {
            await toggleCollectionStatus(collectionId);
            setCollections((prev) =>
                prev.map((c) => (c.id === collectionId ? { ...c, status: currentStatus === "active" ? "inactive" : "active" } : c))
            );
            showNotification(`Collection is now ${currentStatus === "active" ? "Inactive" : "Active"}`, "success");
        } catch (error) {
            showNotification("Failed to update collection status", "error");
        }
    };

    // ✅ Handle Toggle Favorite Status
    const handleToggleFavorite = async (collectionId: string) => {
        try {
            const response = await toggleFavoriteCollection(collectionId);
            setCollections((prev) =>
                prev.map((collection) =>
                    collection.id === collectionId ? { ...collection, is_favorite: response.is_favorite } : collection
                )
            );
            showNotification(
                response.is_favorite ? "Collection added to favorites!" : "Collection removed from favorites!",
                "success"
            );
        } catch (error) {
            console.error("Error toggling favorite:", error);
            showNotification("Failed to update favorite status", "error");

        }
    };

    // ✅ Handle Delete Collection
    const handleDelete = async () => {
        if (!selectedCollection) return;
        try {
            await deleteCollection(selectedCollection);
            setCollections((prev) => prev.filter((c) => c.id !== selectedCollection));
            showNotification("Collection deleted successfully", "success");
        } catch (error) {
            showNotification("Failed to delete collection", "error");
        }
        setOpenModal(false);
    };

    // ✅ Handle Duplicate Collection - Redirect to Duplication Page
    const handleDuplicateRedirect = () => {
        if (!selectedCollection) return;
        router.push(`/sellers/collections/duplicate/${selectedCollection}`);
        setOpenModal(false);
    };

    return (
        <Box>
            <Grid container spacing={3}>
                {collections
                    .filter((collection) =>
                        collection.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((collection) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={collection.id}>
                            <Card
                                sx={{
                                    height: "300px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    padding: 2,
                                    background: "url(/collection_grid/image4.jpg) no-repeat center center",
                                    backgroundSize: "cover",
                                    color: "#fff",
                                    boxShadow: 3,
                                    borderRadius: 2,
                                    position: "relative"
                                }}
                            >

                                {/* ✅ Favorite Icon in Top Right */}
                                <Box sx={{ position: "absolute", top: 8, right: 8, cursor: "pointer" }} onClick={() => handleToggleFavorite(collection.id)}>
                                    {collection.is_favorite ? <AiFillHeart color="red" size={24} /> : <AiOutlineHeart className="text-gray-400" size={24} />}
                                </Box>

                                <CardContent>
                                    <Typography variant="h4" fontWeight="bold" align="center">
                                        {collection.name}
                                    </Typography>
                                    <Typography variant="h5" align="center" sx={{ fontWeight: "bold" }}>
                                        {collection.category?.name} - {collection.size?.name}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="body2" align="left">Series: {collection.series?.name || "N/A"}</Typography>
                                    <Typography variant="body2" align="left">Material: {collection.material?.name || "N/A"}</Typography>
                                    <Typography variant="body2" align="left">Finish: {collection.finish?.name || "N/A"}</Typography>
                                </CardContent>

                                <Stack direction="row" justifyContent="space-between">
                                    <Stack direction="row" spacing={1}>
                                        <Button size="small" variant="contained" color="primary" onClick={() => router.push(`/sellers/collections/update/${collection.id}`)}>
                                            Edit
                                        </Button>
                                        <Button size="small" variant="contained" color="primary" onClick={() => router.push(`/sellers/collection_tiles/bulk_upload/${collection.id}`)}>
                                            View Tiles
                                        </Button>
                                        <Button size="small" variant="contained" color="secondary" onClick={() => {
                                            setSelectedCollection(collection.id);
                                            setModalType("duplicate");
                                            setOpenModal(true);
                                        }}>
                                            Duplicate
                                        </Button>
                                        <Button size="small" variant="contained" color="error" onClick={() => {
                                            setSelectedCollection(collection.id);
                                            setModalType("delete");
                                            setOpenModal(true);
                                        }}>
                                            Delete
                                        </Button>
                                    </Stack>

                                    <Switch
                                        checked={collection.status === "active"}
                                        onChange={() => handleToggleStatus(collection.id, collection.status)}
                                        color={collection.status === "active" ? "success" : "error"}
                                    />
                                </Stack>
                            </Card>
                        </Grid>
                    ))}
            </Grid>

            {/* ✅ Delete / Duplicate Confirmation Modal */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    textAlign: "center",
                }}>
                    <Typography variant="h6" gutterBottom>
                        {modalType === "delete"
                            ? "Are you sure you want to delete this collection?"
                            : "This will redirect to duplicate collection setup page. Continue?"}
                    </Typography>
                    <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={modalType === "delete" ? handleDelete : handleDuplicateRedirect}>
                            Confirm
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => setOpenModal(false)}>
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
};

export default GridCollections;
