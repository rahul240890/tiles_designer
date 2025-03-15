export interface TileResponse {
    id: string;
    tile_code: string;
    name: string;
    image_url: string;
    stock_quantity: number;
    batch_number?: string;
    thickness?: number;
    usage_count: number;
    priority: number;
    status: string;
    color_name?: string;
  }
  
  export interface TileCollectionResponse {
    collection: {
      id: string;
      name: string;
      size?: string;
      series?: string;
      material?: string;
      finish?: string;
      category?: string;
    };
    tiles: TileResponse[];
  }
  export interface SimpleCollectionResponse {
    id: string;
    name: string;
    status: string;
}
