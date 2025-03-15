"use client";

import React, { useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Switch,
    Modal,
    Typography,
    Stack,
    IconButton,
} from "@mui/material";
import { useNotificationStore } from "@/store/notificationStore";
import { useRouter } from "next/navigation";
import { deleteCollection, toggleCollectionStatus, toggleFavoriteCollection } from "../../api/collection";
import { Attribute, CollectionResponse } from "../../types/collection";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface TableCollectionsProps {
    collections: CollectionResponse[];
    setCollections: React.Dispatch<React.SetStateAction<CollectionResponse[]>>;
    searchQuery: string;
}

const TableCollections: React.FC<TableCollectionsProps> = ({ collections, setCollections, searchQuery }) => {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    const [sortField, setSortField] = useState<"name" | "category" | "size" | "created_at">("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
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

    // ✅ Open Modal & Set Collection ID
    const openDeleteModal = (collectionId: string) => {
        setSelectedCollection(collectionId);
        setModalType("delete");
        setOpenModal(true);
    };

    const openDuplicateModal = (collectionId: string) => {
        setSelectedCollection(collectionId);
        setModalType("duplicate");
        setOpenModal(true);
    };

    // ✅ Filter & Sort Collections (Sort Favorites First)
    const filteredCollections = collections
        .filter((collection) =>
            collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            collection.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            collection.size.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            // ✅ Sort by Favorite First
            if (a.is_favorite !== b.is_favorite) {
                return b.is_favorite ? 1 : -1; // Move favorites to top
            }

            // ✅ Sort by Created Date
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Favorite</TableCell>
                            <TableCell>Collection Name</TableCell>
                            <TableCell>Category - Size</TableCell>
                            <TableCell>Series</TableCell>
                            <TableCell>Material</TableCell>
                            <TableCell>Finishing</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredCollections.map((collection, index) => (
                            <TableRow key={collection.id}>
                                <TableCell>
                                    <IconButton onClick={() => handleToggleFavorite(collection.id)}>
                                        {collection.is_favorite ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
                                    </IconButton>
                                </TableCell>
                                <TableCell>{collection.name}</TableCell>
                                <TableCell>{collection.category.name} - {collection.size.name}</TableCell>
                                <TableCell>{collection.series?.name || "N/A"}</TableCell>
                                <TableCell>{collection.material?.name || "N/A"}</TableCell>
                                <TableCell>{collection.finish?.name || "N/A"}</TableCell>
                                <TableCell>{new Date(collection.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={collection.status === "active"}
                                        onChange={() => handleToggleStatus(collection.id, collection.status)}
                                        color={collection.status === "active" ? "success" : "error"}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Stack direction={"row"} spacing={1}>
                                        <Button size="small" variant="contained" color="primary" onClick={() => router.push(`/sellers/collections/update/${collection.id}`)}>
                                            Edit
                                        </Button>
                                        <Button size="small" variant="contained" color="secondary" onClick={() => openDuplicateModal(collection.id)}>
                                            Duplicate
                                        </Button>
                                        <Button size="small" variant="contained" color="error" onClick={() => openDeleteModal(collection.id)}>
                                            Delete
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
                    <Typography variant="h6">
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

export default TableCollections;
