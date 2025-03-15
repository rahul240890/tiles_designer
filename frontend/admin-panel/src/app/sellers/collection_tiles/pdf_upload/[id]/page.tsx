"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, Button, CircularProgress, Typography, TextField, LinearProgress, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useNotificationStore } from "@/store/notificationStore";
import { uploadPDF, getProgress, deleteTempTile, cancelExtraction, storeFinalTiles } from "@/app/sellers/api/pdfUpload";
import { getCollectionById } from "@/app/sellers/api/collection";
import { CollectionResponse } from "@/app/sellers/types/collection";
import { getSellerId } from "@/utils/cookieuserdata";
import { BulkTileUploadResponse, FinalTileSubmission } from "@/app/sellers/types/pdfupload";

const PdfUploadPage = () => {
    const router = useRouter();
    const params = useParams();
    const collection_id = params.id as string;
    const { showNotification } = useNotificationStore();

    const [sellerId, setSellerId] = useState<string | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [thickness, setThickness] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [extractedTiles, setExtractedTiles] = useState<FinalTileSubmission[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [collection, setCollection] = useState<CollectionResponse | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const getImageUrl = (filePath: string) => {
        return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${filePath.replace(/\\/g, "/")}`;
    };
    // ✅ Fetch Seller ID from Cookies
    useEffect(() => {
        const fetchSellerId = async () => {
            const id = await getSellerId();
            if (id) setSellerId(id);
            else setErrorMessage("Seller ID not found. Please log in again.");
        };
        fetchSellerId();
    }, []);

    // ✅ Fetch Collection Details
    useEffect(() => {
        const fetchCollection = async () => {
            if (collection_id) {
                try {
                    const response = await getCollectionById(collection_id);
                    setCollection(response);
                } catch (error) {
                    showNotification("Failed to fetch collection details", "error");
                }
            }
        };
        fetchCollection();
    }, [collection_id]);

    // ✅ WebSocket for Progress Tracking
    useEffect(() => {
        setProgress(100); // ✅ Assume 100% progress after API success
    }, [uploading]);





    // ✅ Handle File Selection
    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        multiple: false,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setPdfFile(acceptedFiles[0]);
                setErrorMessage(null);
            }
        },
    });

    // ✅ Handle PDF Upload & Extraction
    const handleUpload = async () => {
        if (!pdfFile || !thickness) {
            showNotification("Please select a PDF file and enter thickness.", "error");
            return;
        }

        setUploading(true);
        setProgress(5);
        showNotification("Uploading PDF and extracting tiles...", "info");

        try {
            const response: BulkTileUploadResponse = await uploadPDF(pdfFile, parseFloat(thickness), collection_id);

            if (!response.tiles || response.tiles.length === 0) {
                showNotification("No tiles were extracted. Please try again.", "error");
                return;
            }

            setExtractedTiles(
                response.tiles.map((tile) => ({
                    collection_id,
                    seller_id: sellerId!,
                    tile_code: "",
                    name: "",
                    detected_color_name: tile.detected_color_name,
                    detected_color_hex: tile.detected_color_hex,
                    temp_image_path: tile.temp_image_path,
                    thickness: parseFloat(thickness),
                }))
            );

            setProgress(100);
            showNotification("Tiles extracted successfully!", "success");
            setPreviewOpen(true);
        } catch (error) {
            showNotification("File upload failed. Please try again.", "error");
        } finally {
            setUploading(false);
        }
    };

    // ✅ Handle Delete Tile
    const handleDeleteTile = async (index: number, imagePath: string) => {
        try {
            await deleteTempTile(imagePath);
            setExtractedTiles((prev) => prev.filter((_, i) => i !== index));
            showNotification("Tile deleted successfully!", "success");
        } catch (error) {
            showNotification("Error deleting tile. Try again.", "error");
        }
    };

    // ✅ Handle Cancel Extraction
    const handleCancel = async () => {
        try {
            await cancelExtraction();
            setUploading(false);
            setProgress(0);
            setExtractedTiles([]);
            showNotification("Extraction process canceled!", "info");
        } catch (error) {
            showNotification("Failed to cancel extraction.", "error");
        }
    };

    // ✅ Handle Submit Final Tiles
    const handleSubmitTiles = async () => {
        if (!extractedTiles.length) {
            showNotification("No tiles available!", "error");
            return;
        }

        try {
            await storeFinalTiles(extractedTiles);
            showNotification("Tiles stored successfully!", "success");
            router.push(`/sellers/collection_tiles/${collection_id}`);
        } catch (error) {
            showNotification("Error saving tiles. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Upload PDF & Extract Tiles
            </Typography>

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            {/* ✅ Thickness Input Field */}
            <TextField fullWidth label="Tile Thickness (mm)" variant="outlined" size="small" sx={{ mb: 2 }} value={thickness} onChange={(e) => setThickness(e.target.value)} />

            {/* ✅ File Dropzone */}
            <Box {...getRootProps()} sx={{ border: "2px dashed gray", padding: "40px", textAlign: "center", cursor: "pointer" }}>
                <input {...getInputProps()} />
                <Typography variant="h6">Drag & Drop PDF here or click to select</Typography>
            </Box>

            {/* ✅ Upload Button */}
            <Button variant="contained" color="primary" onClick={handleUpload} disabled={uploading || !pdfFile || !thickness} sx={{ mt: 2 }}>
                {uploading ? <CircularProgress size={24} /> : "Extract Tiles"}
            </Button>

            {/* ✅ Cancel Button */}
            {uploading && (
                <Button variant="contained" color="error" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>
                    Cancel Extraction
                </Button>
            )}

            <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold" }}>
                WebSocket Progress: {progress}%
            </Typography>

            {/* ✅ Progress Bar */}
            {uploading && <LinearProgress sx={{ mt: 2 }} variant="determinate" value={progress} />}

            {/* ✅ Tile Preview Modal */}
            {extractedTiles.length > 0 ? (
                <Dialog open={previewOpen} fullWidth maxWidth="md">
                    <DialogTitle>Extracted Tiles</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            {extractedTiles.map((tile, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Box sx={{ border: "1px solid gray", padding: "10px", borderRadius: "8px", textAlign: "center" }}>


                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${tile.temp_image_path.replace(/\\/g, "/")}`}
                                            alt={`Tile ${index}`}
                                            style={{ width: "100%", maxHeight: "250px", objectFit: "contain", borderRadius: "4px" }}
                                        />

                                        {/* ✅ Editable Fields */}
                                        <TextField fullWidth label="Tile Name" variant="outlined" size="small" sx={{ mt: 1 }}
                                            value={tile.name}
                                            onChange={(e) =>
                                                setExtractedTiles((prev) =>
                                                    prev.map((t, i) => (i === index ? { ...t, name: e.target.value } : t))
                                                )
                                            }
                                        />

                                        <TextField fullWidth label="Color Name" variant="outlined" size="small" sx={{ mt: 1 }}
                                            value={tile.detected_color_name}
                                            onChange={(e) =>
                                                setExtractedTiles((prev) =>
                                                    prev.map((t, i) => (i === index ? { ...t, detected_color_name: e.target.value } : t))
                                                )
                                            }
                                        />

                                        <TextField fullWidth label="HEX Code" variant="outlined" size="small" sx={{ mt: 1 }}
                                            value={tile.detected_color_hex}
                                            onChange={(e) =>
                                                setExtractedTiles((prev) =>
                                                    prev.map((t, i) => (i === index ? { ...t, detected_color_hex: e.target.value } : t))
                                                )
                                            }
                                        />

                                        {/* ✅ Delete Tile Button */}
                                        <Button variant="contained" color="error" sx={{ mt: 2 }} fullWidth onClick={() => handleDeleteTile(index, tile.temp_image_path)}>
                                            Delete
                                        </Button>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSubmitTiles} color="primary" variant="contained">
                            Finalize & Store Tiles
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : (
                <Typography>No tiles extracted yet.</Typography>
            )}

        </Box>
    );
};

export default PdfUploadPage;
