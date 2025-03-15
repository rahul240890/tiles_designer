// ✅ Response for a Tile in the database
export interface TileResponse {
  id: string;
  collection_id: string;
  tile_code: string;
  name?: string;
  color_id: string;
  image_url: string;
  price?: number;
  stock_quantity?: number;
  description?: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

// ✅ Used when creating a new tile (Bulk Upload or Manual Entry)
export interface TileCreate {
  collection_id: string;
  tile_code?: string;
  name?: string;
  image_url: string;
  price?: number;
  stock_quantity?: number;
  description?: string;
  status?: "active" | "inactive";
}

// ✅ Response for Bulk Upload (Multiple tiles extracted)
export interface BulkTileUploadResponse {
  message: string;
  tiles: {
    name: string;
    temp_image_path: string;
    detected_color_name: string;
    detected_color_hex: string;
  }[];
}

// ✅ Used when selecting existing tile designs
export interface ExistingTileSelection {
tile_design_id: string;  // ✅ Already exists in tile_designs table
collection_id?: string;   // ✅ Collection where the tile will be added (Optional)
name: string;            // ✅ Editable tile name before adding
color_id: string;        // ✅ Stored color ID, no need for detected color hex/name
thickness: string;       // ✅ Editable thickness before adding
image_url: string;       // ✅ Now it exists permanently
selected?: boolean;      // ✅ Helps in UI selection (Multi-selection)
}

// ✅ Used for Bulk Upload & Existing Selection (Unified Type)
export interface FinalTileSubmission {
collection_id: string;
tile_design_id?: string;  // ✅ Required for existing tiles, optional for bulk upload
name: string;
color_id?: string;        // ✅ Color reference for existing & bulk
detected_color_name?: string;  // ✅ Only for bulk upload (AI-detected)
detected_color_hex?: string;   // ✅ Only for bulk upload (AI-detected)
temp_image_path?: string;  // ✅ Only needed for bulk upload
thickness: string;         // ✅ Editable thickness
}

// ✅ Used for fetching tile designs from backend (Existing Tiles)
export interface TileDesignResponse {
tile_design_id: string;  // ✅ Unique ID from tile_designs table
name: string;           // ✅ Tile name
color_id: string;       // ✅ Color reference
image_url: string;      // ✅ Tile image (Permanent)
thickness?: string;     // ✅ Default thickness (Editable before saving)
}

// New type for getTileDesignsByCollection response
export interface ApiTileDesignResponse {
  tile_design_id: string;
  name: string;
  color_name: string;
  image_url: string;
  thickness: string; // e.g., "10mm"
}