import { createContext, useContext, useState, useEffect } from "react";
import type { CategoryColor } from "@shared/schema";

export type VerticalControl = "lateral-esquerda" | "lateral-direita" | "central-esquerda" | "central-direita" | "invertido-esquerda" | "invertido-direita";
export type VerticalBando = "sem-laterais" | "lateral-esquerda" | "lateral-direita" | "duas-laterais";

export interface CartItem {
  productId: string;
  productName: string;
  productSlug: string;
  width: number;
  height: number;
  commandHeight: number;
  bandoSide: "left" | "right";
  colorId?: string;
  colorName?: string;
  colorCode?: string;
  colorImage?: string;
  aluminumBando: boolean;
  aluminumBandoPrice: number;
  verticalControl?: VerticalControl;
  verticalBando?: VerticalBando;
  controlTypeId?: string;
  controlTypeName?: string;
  pricePerSqm: number;
  totalPrice: number;
  area: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (!saved) return [];
    
    const parsed = JSON.parse(saved);
    return parsed.map((item: any) => ({
      ...item,
      aluminumBando: item.aluminumBando ?? false,
      aluminumBandoPrice: item.aluminumBandoPrice ?? 0,
      commandHeight: item.commandHeight ?? 1.5,
    }));
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const getTotalItems = () => {
    return items.length;
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      clearCart,
      getTotalPrice,
      getTotalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
