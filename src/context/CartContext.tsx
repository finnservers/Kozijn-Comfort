import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartProduct {
  id: string;
  productId: number;
  productName: string;
  configuration: string;
  type: string;
  panels: number;
  width: number;
  height: number;
  insideColor: string;
  insideColorName: string;
  outsideFixedColor: string;
  outsideFixedColorName: string;
  outsideMovingColor: string;
  outsideMovingColorName: string;
  glassType?: string;
  glassTypeName?: string;
  glassFinish?: string;
  glassFinishName?: string;
  direction?: string;
  screens?: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartProduct[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateProduct: (product: CartProduct) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);

  const addToCart = (product: CartProduct) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const updateProduct = (product: CartProduct) => {
    setCartItems(cartItems.map(item => 
      item.id === product.id ? product : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      updateProduct,
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
