import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { WindowVisual } from './WindowVisual';
import { useCart } from '../context/CartContext';
import { Badge } from './ui/badge';
import logo from 'figma:asset/07b8f6cb8cf9ec9c0f2d2950a7eeb8463aef1f1e.png';
import hrGlassImg from 'figma:asset/e1e645d65dd4a09090d3220d6b0fb7e1561c8d89.png';
import tripleGlassImg from 'figma:asset/b5a59ce9da89135da7929d5c18b54fe72c92bbed.png';
import clearGlassImg from 'figma:asset/070271d810a314c763f68ff0999136a615b48ac6.png';
import satinGlassImg from 'figma:asset/a2514f7eca12d038a016aecb80e3e00556bb7bfa.png';

interface Color {
  id: string;
  name: string;
  ral: string;
  hex: string;
}

const colors: Color[] = [
  { id: '1', name: 'Wit glad', ral: 'RAL 9016', hex: '#F1F0EA' },
  { id: '2', name: 'Wit houtnerf', ral: 'RAL 9010', hex: '#E8E6D1' },
  { id: '3', name: 'Crème glad', ral: 'RAL 9001', hex: '#E9E0D2' },
  { id: '4', name: 'Crème houtnerf', ral: 'RAL 9001', hex: '#E9E0D2' },
  { id: '5', name: 'Antraciet', ral: 'RAL 7016', hex: '#383E42' },
  { id: '6', name: 'Zwart', ral: 'RAL 9005', hex: '#0E0E10' },
  { id: '7', name: 'Spargroen houtnerf', ral: 'RAL 9006', hex: '#31442C' },
  { id: '8', name: 'Staalblauw houtnerf', ral: 'RAL 5011', hex: '#1A2B3C' },
  { id: '9', name: 'Monumentengroen houtnerf', ral: 'RAL 6064', hex: '#2C3A2B' }
];

interface ConfigurationDetailProps {
  productId: number;
  productName: string;
  configuration: string;
  type: string;
  panels: number;
  onBack: () => void;
  editingProductId?: string;
}

export function ConfigurationDetail({
  productId,
  productName,
  configuration,
  type,
  panels,
  onBack,
  editingProductId
}: ConfigurationDetailProps) {
  const navigate = useNavigate();
  const { addToCart, updateProduct, cartItems } = useCart();

  // Load existing product data if editing
  const existingProduct = editingProductId 
    ? cartItems.find(item => item.id === editingProductId)
    : null;

  const [width, setWidth] = useState([existingProduct?.width || 860]);
  const [height, setHeight] = useState([existingProduct?.height || 500]);
  const [insideColor, setInsideColor] = useState(existingProduct?.insideColor || '1');
  const [outsideFixedColor, setOutsideFixedColor] = useState(existingProduct?.outsideFixedColor || '1');
  const [outsideMovingColor, setOutsideMovingColor] = useState(existingProduct?.outsideMovingColor || '1');
  const [glassType, setGlassType] = useState(existingProduct?.glassType || 'hr');
  const [glassFinish, setGlassFinish] = useState(existingProduct?.glassFinish || 'clear');
  const [direction, setDirection] = useState(existingProduct?.direction || 'left');
  const [screens, setScreens] = useState(existingProduct?.screens || 'none');
  const [quantity, setQuantity] = useState(existingProduct?.quantity || 1);

  const hasMultiplePanels = panels > 1;
  const isWindow = type === 'window';

  const handleSubmit = () => {
    const getColorName = (id: string) => colors.find(c => c.id === id)?.name || '';
    const getGlassTypeName = (type: string) => type === 'hr' ? 'HR++ glas' : 'Triple glas';
    const getGlassFinishName = (finish: string) => finish === 'clear' ? 'Helder glas' : 'Satijnglas';

    const product = {
      id: editingProductId || `${Date.now()}-${Math.random()}`,
      productId,
      productName,
      configuration,
      type,
      panels,
      width: width[0],
      height: height[0],
      insideColor,
      insideColorName: getColorName(insideColor),
      outsideFixedColor,
      outsideFixedColorName: getColorName(outsideFixedColor),
      outsideMovingColor,
      outsideMovingColorName: getColorName(outsideMovingColor),
      glassType: isWindow ? glassType : undefined,
      glassTypeName: isWindow ? getGlassTypeName(glassType) : undefined,
      glassFinish: isWindow ? glassFinish : undefined,
      glassFinishName: isWindow ? getGlassFinishName(glassFinish) : undefined,
      direction: isWindow ? direction : undefined,
      screens: isWindow ? screens : undefined,
      quantity
    };

    if (editingProductId) {
      updateProduct(product);
    } else {
      addToCart(product);
    }

    navigate('/overview');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b">
          <button
            onClick={onBack}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Cart Button (shown when cart has items and not editing) */}
          {cartItems.length > 0 && !editingProductId && (
            <button
              onClick={() => navigate('/overview')}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6" />
              <Badge className="absolute -top-1 -right-1 bg-[#B59871] hover:bg-[#B59871] min-w-[20px] h-[20px] flex items-center justify-center p-0 text-xs">
                {cartItems.length}
              </Badge>
            </button>
          )}
          
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Kozijncomfort" className="h-8 sm:h-10" />
          </div>
          
          <h2 className="text-center text-lg sm:text-xl font-normal">{productName}</h2>
        </div>

        <div className="p-6 space-y-8">
          {/* Visual Preview */}
          <div className="flex justify-center py-8 bg-gray-50 rounded-lg">
            <div className="scale-150">
              <WindowVisual configuration={configuration} panels={panels} type={type} />
            </div>
          </div>

          {/* Width Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3>Breedte</h3>
                <p className="text-gray-500">in millimeters</p>
              </div>
              <span className="text-gray-500">Verplicht</span>
            </div>
            <p className="text-gray-600 mb-4">
              Totale afmeting van de uitsparing invullen incl. eventuele zijlicht(en) en bovenlicht(en)
            </p>
            <div className="flex items-center gap-4">
              <span className="min-w-[60px]">{width[0]}</span>
              <Slider
                value={width}
                onValueChange={setWidth}
                min={400}
                max={6000}
                step={10}
                className="flex-1"
              />
              <span className="min-w-[60px] text-right text-gray-500">6000</span>
            </div>
          </div>

          {/* Height Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3>Hoogte</h3>
                <p className="text-gray-500">in millimeters</p>
              </div>
              <span className="text-gray-500">Verplicht</span>
            </div>
            <p className="text-gray-600 mb-4">
              Totale afmeting van de uitsparing invullen incl. eventuele zijlicht(en) en bovenlicht(en)
            </p>
            <div className="flex items-center gap-4">
              <span className="min-w-[60px]">{height[0]}</span>
              <Slider
                value={height}
                onValueChange={setHeight}
                min={400}
                max={3000}
                step={10}
                className="flex-1"
              />
              <span className="min-w-[60px] text-right text-gray-500">3000</span>
            </div>
          </div>

          {/* Inside Color */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3>Kleurkeuze binnenkant</h3>
              <span className="text-gray-500">Verplicht</span>
            </div>
            <RadioGroup value={insideColor} onValueChange={setInsideColor}>
              <div className="space-y-3">
                {colors.map((color) => (
                  <label
                    key={color.id}
                    htmlFor={`inside-${color.id}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 pointer-events-none">
                      <div>
                        <div className="font-normal">
                          {color.name}
                        </div>
                        <p className="text-gray-500">{color.ral}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pointer-events-none">
                      <div
                        className="w-20 h-12 rounded border"
                        style={{ backgroundColor: color.hex }}
                      />
                      <RadioGroupItem value={color.id} id={`inside-${color.id}`} />
                    </div>
                  </label>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Outside Fixed Color (only for multi-panel) */}
          {hasMultiplePanels && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3>Kleurkeuze buitenkant vast deel</h3>
                <span className="text-gray-500">Verplicht</span>
              </div>
              <RadioGroup value={outsideFixedColor} onValueChange={setOutsideFixedColor}>
                <div className="space-y-3">
                  {colors.map((color) => (
                    <label
                      key={color.id}
                      htmlFor={`fixed-${color.id}`}
                      className="flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1 pointer-events-none">
                        <div>
                          <div className="font-normal">
                            {color.name}
                          </div>
                          <p className="text-gray-500">{color.ral}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pointer-events-none">
                        <div
                          className="w-20 h-12 rounded border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <RadioGroupItem value={color.id} id={`fixed-${color.id}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Outside Moving Color */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3>Kleurkeuze buitenkant draaiende delen</h3>
              <span className="text-gray-500">Verplicht</span>
            </div>
            <RadioGroup value={outsideMovingColor} onValueChange={setOutsideMovingColor}>
              <div className="space-y-3">
                {colors.map((color) => (
                  <label
                    key={color.id}
                    htmlFor={`moving-${color.id}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 pointer-events-none">
                      <div>
                        <div className="font-normal">
                          {color.name}
                        </div>
                        <p className="text-gray-500">{color.ral}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pointer-events-none">
                      <div
                        className="w-20 h-12 rounded border"
                        style={{ backgroundColor: color.hex }}
                      />
                      <RadioGroupItem value={color.id} id={`moving-${color.id}`} />
                    </div>
                  </label>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Window-specific options */}
          {isWindow && (
            <>
              {/* Type Glas */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3>Type glas</h3>
                  <span className="text-gray-500">Verplicht</span>
                </div>
                <RadioGroup value={glassType} onValueChange={setGlassType}>
                  <div className="space-y-3">
                    <label
                      htmlFor="glass-hr"
                      className="flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1 pointer-events-none">
                        <span className="font-normal">HR++ glas</span>
                      </div>
                      <div className="flex items-center gap-3 pointer-events-none">
                        <img src={hrGlassImg} alt="HR++ glas" className="w-20 h-20 object-contain" />
                        <RadioGroupItem value="hr" id="glass-hr" />
                      </div>
                    </label>
                    <label
                      htmlFor="glass-triple"
                      className="flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1 pointer-events-none">
                        <span className="font-normal">Triple glas</span>
                      </div>
                      <div className="flex items-center gap-3 pointer-events-none">
                        <img src={tripleGlassImg} alt="Triple glas" className="w-20 h-20 object-contain" />
                        <RadioGroupItem value="triple" id="glass-triple" />
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Glassoort */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3>Glassoort</h3>
                  <span className="text-gray-500">Verplicht</span>
                </div>
                <RadioGroup value={glassFinish} onValueChange={setGlassFinish}>
                  <div className="space-y-3">
                    <label
                      htmlFor="finish-clear"
                      className="flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1 pointer-events-none">
                        <span className="font-normal">Helder glas</span>
                      </div>
                      <div className="flex items-center gap-3 pointer-events-none">
                        <img src={clearGlassImg} alt="Helder glas" className="w-20 h-20 object-contain" />
                        <RadioGroupItem value="clear" id="finish-clear" />
                      </div>
                    </label>
                    <label
                      htmlFor="finish-satin"
                      className="flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1 pointer-events-none">
                        <span className="font-normal">Satijnglas</span>
                      </div>
                      <div className="flex items-center gap-3 pointer-events-none">
                        <img src={satinGlassImg} alt="Satijnglas" className="w-20 h-20 object-contain" />
                        <RadioGroupItem value="satin" id="finish-satin" />
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Draairichting */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3>Draairichting</h3>
                  <span className="text-gray-500">Verplicht</span>
                </div>
                <RadioGroup value={direction} onValueChange={setDirection}>
                  <div className="space-y-3">
                    <label
                      htmlFor="direction-left"
                      className="flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <span className="flex-1 pointer-events-none font-normal">Linksom</span>
                      <div className="pointer-events-none">
                        <RadioGroupItem value="left" id="direction-left" />
                      </div>
                    </label>
                    <label
                      htmlFor="direction-right"
                      className="flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <span className="flex-1 pointer-events-none font-normal">Rechtsom</span>
                      <div className="pointer-events-none">
                        <RadioGroupItem value="right" id="direction-right" />
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Insectenhorren */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3>Insectenhorren</h3>
                  <span className="text-gray-500">Verplicht</span>
                </div>
                <RadioGroup value={screens} onValueChange={setScreens}>
                  <div className="space-y-3">
                    <label
                      htmlFor="screens-none"
                      className="flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <span className="flex-1 pointer-events-none font-normal">Geen</span>
                      <div className="pointer-events-none">
                        <RadioGroupItem value="none" id="screens-none" />
                      </div>
                    </label>
                    <label
                      htmlFor="screens-1"
                      className="flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <span className="flex-1 pointer-events-none font-normal">1 hor</span>
                      <div className="pointer-events-none">
                        <RadioGroupItem value="1" id="screens-1" />
                      </div>
                    </label>
                    <label
                      htmlFor="screens-2"
                      className="flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <span className="flex-1 pointer-events-none font-normal">2 horren</span>
                      <div className="pointer-events-none">
                        <RadioGroupItem value="2" id="screens-2" />
                      </div>
                    </label>
                    <label
                      htmlFor="screens-3"
                      className="flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                    >
                      <span className="flex-1 pointer-events-none font-normal">3 horren</span>
                      <div className="pointer-events-none">
                        <RadioGroupItem value="3" id="screens-3" />
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {/* Quantity Counter */}
          <div className="flex items-center gap-4 py-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center border rounded hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="min-w-[40px] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center border rounded hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            className="w-full bg-[#B59871] hover:bg-[#B59871]/90 h-12"
          >
            Offerte aanvragen +
          </Button>
        </div>
      </div>
    </div>
  );
}