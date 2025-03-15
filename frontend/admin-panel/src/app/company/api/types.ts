export interface TileCollection {
    id: number; // ✅ Remove optional `?`
    name: string;
    category_id: number;
    size_id: number;
    material_id: number;
    finish_id: number;
    description?: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface CollectionMetadataResponse {
    categories: { id: number; name: string }[];
    sizes: { id: number; dimension: string }[];
    materials: { id: number; name: string }[];
    finishes: { id: number; name: string }[];
    series: { id: number; name: string }[];
  }
  