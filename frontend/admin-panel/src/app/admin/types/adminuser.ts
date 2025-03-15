export type User = {
    id: number;
    username: string;
    email: string;
    role: "admin";
    seller_id?: number | null;
    created_at: string;
    updated_at: string;
  };
  
  export type UserCreate = Omit<User, "id" | "created_at" | "updated_at"> & {
    password: string;
  };
  
  export type UserUpdate = Partial<Omit<User, "id" | "created_at" | "updated_at">>;
  