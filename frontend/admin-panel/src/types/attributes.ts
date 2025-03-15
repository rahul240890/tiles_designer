export interface AttributeBase {
  id: string;
  name: string;
}

// ✅ New Type: Used for Creating Attributes (without `id`)
export type AttributeCreate = Omit<AttributeBase, "id">;

// ✅ Tile Size
export interface TileSize extends AttributeBase {}

// ✅ Tile Series
export interface TileSeries extends AttributeBase {}

// ✅ Tile Material
export interface TileMaterial extends AttributeBase {}

// ✅ Tile Finish
export interface TileFinish extends AttributeBase {}

// ✅ Tile Category
export interface TileCategory extends AttributeBase {}

// ✅ Tile Color (With HEX Code)
export interface TileColor extends AttributeBase {
  hex_code?: string; // ✅ HEX Code is optional
}
