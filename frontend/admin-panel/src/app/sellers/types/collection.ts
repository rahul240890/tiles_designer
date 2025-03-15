// ✅ Base Collection Type (Common Fields)
export interface CollectionBase {
  name: string;
  size_id: string;
  series_id?: string | null;
  material_id?: string | null;
  finish_id?: string | null;
  category_id?: string | null;
  description?: string | null;
  suitable_places?: string[]; // ✅ Added Suitable Places Field
}

// ✅ Create Collection Type (Requires Seller ID)
export interface CollectionCreate extends CollectionBase {
  seller_id: string;
}

// ✅ Update Collection Type (Allows Partial Updates)
export interface CollectionUpdate extends Partial<CollectionBase> {
  status?: "active" | "inactive";
}

// ✅ Attribute Type (Used for Size, Series, Material, Finish, Category, and Suitable Places)
export interface Attribute {
  id: string;
  name: string;
}

// ✅ Modify CollectionResponse to Include "is_favorite" and "seller_name"
export interface CollectionResponse {
  id: string;
  seller_id: string;
  seller_name?: string; // ✅ Added seller name (optional)
  name: string;
  size: Attribute;
  series?: Attribute | null;
  material?: Attribute | null;
  finish?: Attribute | null;
  category: Attribute;
  suitable_places: Attribute[]; // ✅ New field to include Suitable Places
  description?: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  is_favorite?: boolean; // ✅ New field to track favorite status
}

// ✅ API Response Type for Fetching All Attributes (Including Suitable Places)
export interface AttributesResponse {
  sizes: Attribute[];
  series: Attribute[];
  materials: Attribute[];
  finishes: Attribute[];
  categories: Attribute[];
  suitable_places: Attribute[]; // ✅ New field for Suitable Places
}
