import { StateCreator } from "zustand";
import { IUser } from "@/types";

export interface AuthSlice {
  userInfo: IUser | null;
  setUserInfo: (userInfo: IUser) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
});
