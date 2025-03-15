export interface TileResponse {
    id: string;
    collection_id: string;
    seller_id: string;
    tile_code: string;
    name?: string;
    color_id: string;
    image_url: string;
    price?: number;
    stock_quantity?: number;
    description?: string;
    thickness?: number;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface TileCreate {
    collection_id: string;
    seller_id: string;
    tile_code?: string;
    name?: string;
    image_url: string;
    price?: number;
    stock_quantity?: number;
    thickness?: number;
    description?: string;
    status?: "active" | "inactive";
}

export interface BulkTileUploadResponse {
    message: string;
    tiles: {
        temp_image_path: string;
        detected_color_name: string;
        detected_color_hex: string;
    }[];
}

export interface FinalTileSubmission {
    collection_id: string;
    seller_id: string;
    tile_code?: string;
    name?: string;
    detected_color_name: string;
    detected_color_hex: string;
    temp_image_path: string;
    thickness: number;
}
