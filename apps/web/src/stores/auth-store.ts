import { create } from "zustand";
import { createAuthClient } from "better-auth/react";

export interface AuthState {
  user: any | null;
  session: any | null;
  isLoading: boolean;
  setUser: (user: any | null) => void;
  setSession: (session: any | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
}));

// Better Auth client
const baseURL = import.meta.env.VITE_PUBLIC_SITE_URL || "http://localhost:3004";
export const authClient = createAuthClient({
  baseURL,
});
