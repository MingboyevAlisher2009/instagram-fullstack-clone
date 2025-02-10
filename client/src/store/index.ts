import { create } from "zustand";
import { createAuthSlice, AuthSlice } from "./slices/auth-slice";

export const useAppStore = create<AuthSlice>((set) => ({
  ...createAuthSlice(set),
}));
