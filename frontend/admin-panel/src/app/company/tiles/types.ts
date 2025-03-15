export interface Tile {
    id?: number;  // ✅ id is now optional for new tiles
    name: string;
    category: string;
    series: string;
    collection: string;
    type: string;
    material: string;
    finish: string;
    size: string;
    color: string;
    price: string;
    image_url?: string;
    status: "Active" | "Inactive";
  }
  