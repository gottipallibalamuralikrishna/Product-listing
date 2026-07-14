import { createContext, useContext, type ReactNode } from 'react';
import { ProductStore } from '@/stores/ProductStore';

const productStore = new ProductStore();

const StoreContext = createContext(productStore);

export function StoreProvider({ children }: { children: ReactNode }) {
  return <StoreContext.Provider value={productStore}>{children}</StoreContext.Provider>;
}

export function useProductStore(): ProductStore {
  return useContext(StoreContext);
}
