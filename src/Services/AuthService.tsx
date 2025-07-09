import axios from "axios";
import { create } from "zustand";
import { Client } from "@stomp/stompjs";

const base_url = "http://localhost:8080";
const axiosInstance = axios.create({
  baseURL: base_url,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
const loginUser = async (login: any) => {
  return axiosInstance.post(`/auth/login`, login)
    .then((res) => res.data)
    .catch((err) => { throw err; });
};

const loginUserWithOtpEmail = async (login: any) => {
  return axiosInstance.post(`/auth/login/with/otp/email`, login)
    .then((res) => res.data)
    .catch((err) => { throw err; });
};

const loginUserWithOtpMobile = async (login: any) => {
  return axiosInstance.post(`/auth/login/with/otp/mobile`, login)
    .then((res) => res.data)
    .catch((err) => { throw err; });
};

const navigateToLogin = (navigate: any) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};

// ✅ AuthStore Types
interface AuthState {
  authUser: any | null;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  client: Client | null;

  checkAuth: () => Promise<void>;
  connectSocket: (userId: number) => void;
  fetchOnlineUsers: () => Promise<void>;
}

// ✅ Zustand store
export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  onlineUsers: [],
  client: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get(`/auth/check`);
      set({ authUser: { ...res.data, id: res.data.profileId } });
      get().connectSocket(res.data.id);
      get().fetchOnlineUsers();
    } catch (err) {
      console.error("checkAuth failed:", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  connectSocket: (userId: number) => {
    
  },

  fetchOnlineUsers: async () => {
    try {
      const res = await axiosInstance.get(`/api/online`);
      set({ onlineUsers: res.data });
    } catch (err) {
      console.error("fetchOnlineUsers failed:", err);
    }
  },
}));

// ✅ Exports
export {
  loginUser,
  loginUserWithOtpEmail,
  loginUserWithOtpMobile,
  navigateToLogin,
  axiosInstance,
};
