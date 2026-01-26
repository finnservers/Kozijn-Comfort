import { Outlet } from 'react-router';
import { CartProvider } from '../context/CartContext';

export function RootLayout() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <Outlet />
      </div>
    </CartProvider>
  );
}
