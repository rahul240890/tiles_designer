export interface RoomTemplate {
    id: string;
    name: string;
    category: "Modern" | "Classic" | "Minimalist" | "Industrial";
    image_url: string;
    created_at: string;
  }
  
  export interface SegmentationResponse {
    segmentation_id: string;
    original_image_url: string;
    wall_mask_url: string;
    floor_mask_url: string;
    room_type: "Kitchen" | "Bathroom" | "Living Room" | "Bedroom" | "Dining Room" | "Balcony";
    created_at: string;
  }
  
  export interface Tile {
    id: string;
    name: string;
    category: "wall" | "floor";
    size: string;
    material: string;
    finish: string;
    color: string;
    texture_url: string;
    usage_count: number;
    trending_score: number;
    created_at: string;
  }
  
  export interface TileFilterOptions {
    category?: "wall" | "floor";
    size?: string;
    material?: string;
    finish?: string;
    color?: string;
    sort_by?: "trending" | "usage_count" | "newest";
  }
  
  export interface ApplyTilesRequest {
    segmentation_id: string;
    wall_tile_id?: string;
    floor_tile_id?: string;
  }
  
  export interface PaintColor {
    hex_code: string;
    name: string;
  }
  
  export interface ApplyPaintRequest {
    segmentation_id: string;
    paint_color: string;
  }
  
  export interface LightingMode {
    mode: "daylight" | "warm" | "cool" | "dimmed" | "custom";
    brightness?: number;
    contrast?: number;
  }
  
  export interface ApplyLightingRequest {
    image_path: string;
    mode: string;
    brightness: number;
    contrast: number;
  }
  
  export interface SavedDesign {
    id: string;
    seller_id: string;
    segmentation_id: string;
    applied_tiles: { wall?: string; floor?: string };
    applied_paint?: string;
    applied_lighting?: LightingMode;
    saved_image_url: string;
    created_at: string;
  }
  