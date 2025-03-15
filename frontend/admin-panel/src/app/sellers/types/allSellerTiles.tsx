export interface Tile {
    id: string;
    tile_code: string;
    name: string;
    image_url: string;
    price?: number;
    stock_quantity?: number;
    batch_number?: string;
    thickness?: number;
    usage_count: number;
    priority: number;
    status: "active" | "inactive";
    color_name?: string;
    hex_code?: string; // ✅ For color palette
    is_favorite: boolean; // ✅ Added this property
  }
  
  export interface Collection {
    id: string;
    name: string;
  }
  
  export interface SidebarFilters {
    collections: Collection[];
    categories: { id: string; name: string }[];
    series: { id: string; name: string }[];
    finishes: { id: string; name: string }[];
    sizes: { id: string; name: string }[];
    materials: { id: string; name: string }[];
    colors: { id: string; name: string; hex_code: string }[]; // ✅ Includes hex codes for palette
  }
  
  export interface TileListResponse {
    tiles: Tile[];
    collections: Collection;
  }
  