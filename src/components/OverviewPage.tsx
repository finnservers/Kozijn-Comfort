import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Trash2, Pencil, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '../context/CartContext';
import { WindowVisual } from './WindowVisual';
import { ConfigurationDetail } from './ConfigurationDetail';
import logo from 'figma:asset/07b8f6cb8cf9ec9c0f2d2950a7eeb8463aef1f1e.png';

export function OverviewPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [editingProduct, setEditingProduct] = useState<{
    productId: number;
    productName: string;
    configuration: string;
    type: string;
    panels: number;
    id: string;
  } | null>(null);

  const handleBack = () => {
    navigate('/');
  };

  const handleEdit = (item: any) => {
    setEditingProduct({
      productId: item.productId,
      productName: item.productName,
      configuration: item.configuration,
      type: item.type,
      panels: item.panels,
      id: item.id
    });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    navigate('/');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // If editing a product, show the ConfigurationDetail view
  if (editingProduct) {
    return (
      <ConfigurationDetail
        productId={editingProduct.productId}
        productName={editingProduct.productName}
        configuration={editingProduct.configuration}
        type={editingProduct.type}
        panels={editingProduct.panels}
        onBack={handleCancelEdit}
        editingProductId={editingProduct.id}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b">
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Kozijncomfort" className="h-8 sm:h-10" />
          </div>
          
          <h2 className="text-center text-lg sm:text-xl font-normal">Overzicht</h2>
        </div>

        <div className="p-4 sm:p-6">
          {/* Empty State */}
          {cartItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Je winkelwagen is leeg</p>
              <Button 
                onClick={handleAddProduct}
                className="mt-4 bg-[#B59871] hover:bg-[#B59871]/90"
              >
                Product toevoegen
              </Button>
            </div>
          )}

          {/* Cart Items */}
          {cartItems.length > 0 && (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  {/* Item Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3>{item.productName}</h3>
                      <p className="text-gray-500">
                        {item.width} x {item.height} mm
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Preview */}
                  <div className="flex justify-center py-4 bg-gray-50 rounded-lg mb-4">
                    <WindowVisual 
                      configuration={item.configuration} 
                      panels={item.panels}
                      type={item.type}
                    />
                  </div>

                  {/* Configuration Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kleur binnenkant:</span>
                      <span>{item.insideColorName}</span>
                    </div>
                    {item.panels > 1 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kleur buitenkant vast deel:</span>
                        <span>{item.outsideFixedColorName}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kleur buitenkant draaiende delen:</span>
                      <span>{item.outsideMovingColorName}</span>
                    </div>
                    {item.glassTypeName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type glas:</span>
                        <span>{item.glassTypeName}</span>
                      </div>
                    )}
                    {item.glassFinishName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Glassoort:</span>
                        <span>{item.glassFinishName}</span>
                      </div>
                    )}
                    {item.direction && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Draairichting:</span>
                        <span>{item.direction === 'left' ? 'Linksom' : 'Rechtsom'}</span>
                      </div>
                    )}
                    {item.screens && item.screens !== 'none' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Insectenhorren:</span>
                        <span>{item.screens} hor{item.screens !== '1' ? 'ren' : ''}</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-gray-600">Aantal:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="min-w-[30px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Another Product Button */}
              <Button 
                onClick={handleAddProduct}
                variant="outline"
                className="w-full"
              >
                + Product toevoegen
              </Button>

              {/* Checkout Button */}
              {cartItems.length > 0 && (
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-[#B59871] hover:bg-[#B59871]/90 h-12 mt-6 flex items-center justify-center gap-2"
                >
                  Naar gegevens →
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}