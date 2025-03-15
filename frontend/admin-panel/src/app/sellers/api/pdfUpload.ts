import apiRequest from "@/utils/apiHelper";
import { getSellerId } from "@/utils/cookieuserdata";
import { BulkTileUploadResponse, FinalTileSubmission } from "../types/pdfupload";

// ✅ Upload PDF & Extract Tiles
export const uploadPDF = async (pdfFile: File, thickness: number, collectionId: string): Promise<BulkTileUploadResponse> => {
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("thickness", thickness.toString());
    formData.append("collection_id", collectionId);

    return await apiRequest("/pdf/upload", "POST", formData);
};

// ✅ Fetch Real-Time Progress
export const getProgress = async (): Promise<{ progress: number }> => {
    return await apiRequest("/progress");
};

// ✅ Delete Unwanted Tile (Remove from Temp Storage)
export const deleteTempTile = async (imagePath: string): Promise<{ message: string }> => {
    return await apiRequest(`/pdf/temp-delete/${imagePath}`, "DELETE");
};

// ✅ Cancel Extraction Process
export const cancelExtraction = async (): Promise<{ message: string }> => {
    return await apiRequest("/pdf/cancel-extraction", "DELETE");
};

// ✅ Store Finalized Tiles in DB
export const storeFinalTiles = async (finalTiles: FinalTileSubmission[]): Promise<{ message: string }> => {
    const sellerId = await getSellerId();
    if (!sellerId) throw new Error("Seller ID is missing");

    const requestBody = {
        seller_id: sellerId,
        tiles: finalTiles
    };

    return await apiRequest("/tiles/store-final-pdf", "POST", requestBody);
};
