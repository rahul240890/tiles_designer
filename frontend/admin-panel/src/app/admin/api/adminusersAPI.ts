import apiRequest from "@/utils/apiHelper";
import { User, UserCreate, UserUpdate } from "../types/adminuser";

// ✅ Fetch all Admin Users
export const fetchAdmins = async (): Promise<User[] | null> => {
  try {
    return await apiRequest(`/users/admin`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ Fetch a single Admin by ID
export const fetchAdminById = async (adminId: number): Promise<User | null> => {
  try {
    return await apiRequest(`/users/admin/${adminId}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ Create a new Admin
export const createAdmin = async (adminData: UserCreate): Promise<User | null> => {
  try {
    return await apiRequest(`/users/admin`, "POST", adminData);
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ Update an Admin
export const updateAdmin = async (adminId: number, adminData: UserUpdate): Promise<User | null> => {
  try {
    return await apiRequest(`/users/admin/${adminId}`, "PUT", adminData);
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ Delete an Admin
export const deleteAdmin = async (adminId: number): Promise<boolean> => {
  try {
    await apiRequest(`/users/admin/${adminId}`, "DELETE");
    return true; // ✅ Return success status
  } catch (error) {
    console.error(error);
    return false; // ✅ Handle error
  }
};
