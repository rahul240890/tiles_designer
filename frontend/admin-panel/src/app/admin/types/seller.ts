// admin/types/seller.ts

export type Seller = {
  id: string;
  seller_name: string;
  seller_mobile: string;
  owner_name: string;
  email: string;
  password?: string;
  address: string;
  city: string;
  gst_number?: string;
  seller_type: string;
  plan_type?: string;
  plan_price?: number;
  payment_status: "Paid" | "Pending" | "Expired";
  renew_date: string;
  next_billing_date: string;
  trial_period_end?: string;
  last_payment_date?: string;
  subscribed_date?: string;
  max_users_allowed?: number;
  notes?: string;
  status: "Active" | "Inactive";
  created_at: string;
  updated_at: string;
};

// ✅ Ensure `password` is included in SellerCreate
export type SellerCreate = Omit<Seller, "id" | "created_at" | "updated_at"> & {
  password: string;
};

// types/seller.ts
export type SellerUpdate = {
  seller_name?: string;
  seller_mobile?: string;
  owner_name?: string;
  email?: string;
  address?: string;
  city?: string;
  gst_number?: string;
  logo_url?: string;
  seller_type?: string;
  status?: string;
  max_users_allowed?: number;
  plan_type?: string;
  plan_price?: number;
  payment_status?: string;
  subscribed_date?: string;
  renew_date?: string;
  next_billing_date?: string;
  trial_period_end?: string;
  last_payment_date?: string;
  notes?: string;
  password?: string; // Optional
};
