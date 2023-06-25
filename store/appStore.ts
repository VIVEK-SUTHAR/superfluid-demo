import { create } from "zustand";

interface AppState {
  currentAddress: string;
  isConnected: boolean;
  setCurrentAddress: (address: string) => void;
  setIsConnected: (isConnected: boolean) => void;
}
const useAppState = create<AppState>((set) => ({
  currentAddress: "",
  isConnected: false,
  setCurrentAddress: (address) =>
    set({
      currentAddress: address,
    }),
  setIsConnected: (isConnected) =>
    set({
      isConnected: isConnected,
    }),
}));
export default useAppState;
