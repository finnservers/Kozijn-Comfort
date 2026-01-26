import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ShoppingCart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { KozijnOption } from './KozijnOption';
import { ConfigurationDetail } from './ConfigurationDetail';
import { Badge } from './ui/badge';
import { useCart } from '../context/CartContext';
import logo from 'figma:asset/07b8f6cb8cf9ec9c0f2d2950a7eeb8463aef1f1e.png';

interface SelectedProduct {
  id: number;
  name: string;
  configuration: string;
  type: string;
  panels: number;
}

const kozijnOptions = [
  {
    id: 1,
    name: 'Draaikiepraam',
    description: 'Stel hier jouw draaikiepraam samen!',
    panels: 1,
    isPopular: true,
    configuration: 'single',
    type: 'window'
  },
  {
    id: 2,
    name: '2 Draai-kiepraam | 2 vakken',
    description: 'Stel hier jouw 2 Draai-kiepraam | 2 vakken samen!',
    panels: 2,
    configuration: 'double',
    type: 'window'
  },
  {
    id: 3,
    name: 'Draai-kiepraam (L) en vast glas | 2 vakken',
    description: 'Stel hier jouw Draai-kiepraam (L) en vast glas | 2 vakken samen!',
    panels: 2,
    configuration: 'left-fixed',
    type: 'window'
  },
  {
    id: 4,
    name: 'Draai-kiepraam (L) en vast glas | 3 vakken',
    description: 'Stel hier jouw Draai-kiepraam (L) en vast glas | 3 vakken samen!',
    panels: 3,
    configuration: 'left-fixed-3',
    type: 'window'
  },
  {
    id: 5,
    name: 'Draai-kiepraam (M) en vast glas | 3 vakken',
    description: 'Stel hier jouw Draai-kiepraam (M) en vast glas | 3 vakken samen!',
    panels: 3,
    configuration: 'middle-fixed-3',
    type: 'window'
  },
  {
    id: 6,
    name: 'Draai-kiepraam (R) en vast glas | 2 vakken',
    description: 'Stel hier jouw Draai-kiepraam (R) en vast glas | 2 vakken samen!',
    panels: 2,
    configuration: 'right-fixed',
    type: 'window'
  },
  {
    id: 7,
    name: 'Draaikiepramen (L&R) en vast glas 3 vakken',
    description: 'Stel hier jouw Draaikiepramen (L&R) en vast glas 3 vakken samen!',
    panels: 3,
    configuration: 'both-fixed-3',
    type: 'window'
  }
];

const schuifpuienOptions = [
  {
    id: 11,
    name: '2-delige hefschuifpui',
    description: 'Stel hier jouw 2-delige hefschuifpui samen!',
    panels: 2,
    isPopular: true,
    configuration: 'sliding-2',
    type: 'sliding'
  },
  {
    id: 12,
    name: '4-delige hefschuifpui',
    description: 'Stel hier jouw 4-delige hefschuifpui samen!',
    panels: 4,
    configuration: 'sliding-4',
    type: 'sliding'
  }
];

const tuindeurenOptions = [
  {
    id: 21,
    name: 'Dubbele tuindeur',
    description: 'Stel hier jouw dubbele tuindeur samen!',
    panels: 2,
    isPopular: true,
    configuration: 'double-garden',
    type: 'garden-door'
  },
  {
    id: 22,
    name: 'Dubbele tuindeur met zijlichten',
    description: 'Stel hier jouw dubbele tuindeur met zijlichten samen!',
    panels: 4,
    configuration: 'double-garden-side',
    type: 'garden-door'
  },
  {
    id: 23,
    name: 'Dubbele tuindeur met bovenlicht',
    description: 'Stel hier jouw dubbele tuindeur met bovenlicht samen!',
    panels: 2,
    configuration: 'double-garden-top',
    type: 'garden-door'
  },
  {
    id: 24,
    name: 'Dubbele tuindeur met bovenlicht en zijlichten',
    description: 'Stel hier jouw dubbele tuindeur met bovenlicht en zijlichten samen!',
    panels: 4,
    configuration: 'double-garden-top-side',
    type: 'garden-door'
  }
];

const achterdeurenOptions = [
  {
    id: 31,
    name: 'Achterdeur zonder zij- en bovenlichten',
    description: 'Stel hier jouw achterdeur zonder zij- en bovenlichten samen!',
    panels: 1,
    isPopular: true,
    configuration: 'back-door-simple',
    type: 'back-door'
  },
  {
    id: 32,
    name: 'Achterdeur met bovenlicht',
    description: 'Stel hier jouw achterdeur met bovenlicht samen!',
    panels: 1,
    configuration: 'back-door-top',
    type: 'back-door'
  },
  {
    id: 33,
    name: 'Achterdeur met zijlicht links',
    description: 'Stel hier jouw achterdeur met zijlicht links samen!',
    panels: 2,
    configuration: 'back-door-left',
    type: 'back-door'
  },
  {
    id: 34,
    name: 'Achterdeur met zijlicht rechts',
    description: 'Stel hier jouw achterdeur met zijlicht rechts samen!',
    panels: 2,
    configuration: 'back-door-right',
    type: 'back-door'
  },
  {
    id: 35,
    name: 'Achterdeur met zijlicht links en borstwering',
    description: 'Stel hier jouw achterdeur met zijlicht links en borstwering samen!',
    panels: 2,
    configuration: 'back-door-left-rail',
    type: 'back-door'
  },
  {
    id: 36,
    name: 'Achterdeur met zijlicht rechts en borstwering',
    description: 'Stel hier jouw met zijlicht rechts en borstwering samen!',
    panels: 2,
    configuration: 'back-door-right-rail',
    type: 'back-door'
  }
];

const voordeurenOptions = [
  {
    id: 41,
    name: 'Geen zijlicht en bovenlicht',
    description: 'Stel hier jouw voordeur zonder zij- en bovenlicht samen!',
    panels: 1,
    isPopular: true,
    configuration: 'front-door-simple',
    type: 'front-door'
  },
  {
    id: 42,
    name: 'Voordeur met bovenlicht',
    description: 'Stel hier jouw voordeur met bovenlicht samen!',
    panels: 1,
    configuration: 'front-door-top',
    type: 'front-door'
  },
  {
    id: 43,
    name: 'Voordeur met zijlicht links',
    description: 'Stel hier jouw voordeur met zijlicht links samen!',
    panels: 2,
    configuration: 'front-door-left',
    type: 'front-door'
  },
  {
    id: 44,
    name: 'Voordeur met zijlicht rechts',
    description: 'Stel hier jouw voordeur met zijlicht rechts samen!',
    panels: 2,
    configuration: 'front-door-right',
    type: 'front-door'
  },
  {
    id: 45,
    name: 'Voordeur met bovenlicht en zijlicht links',
    description: 'Stel hier jouw voordeur met bovenlicht zijlicht links samen!',
    panels: 2,
    configuration: 'front-door-top-left',
    type: 'front-door'
  },
  {
    id: 46,
    name: 'Voordeur met bovenlicht en zijlicht rechts',
    description: 'Stel hier jouw voordeur met bovenlicht zijlicht rechts samen!',
    panels: 2,
    configuration: 'front-door-top-right',
    type: 'front-door'
  }
];

export function ProductConfigurator() {
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const handleSelectProduct = (product: SelectedProduct) => {
    setSelectedProduct(product);
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  const handleCartClick = () => {
    navigate('/overview');
  };

  // If a product is selected, show the detail view
  if (selectedProduct) {
    return (
      <ConfigurationDetail
        productId={selectedProduct.id}
        productName={selectedProduct.name}
        configuration={selectedProduct.configuration}
        type={selectedProduct.type}
        panels={selectedProduct.panels}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm relative">
      {/* Logo and Title Section */}
      <div className="p-4 sm:p-8 pb-0">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Kozijncomfort" className="h-10 sm:h-12" />
        </div>

        <h1 className="text-center mb-6 sm:mb-8 text-xl sm:text-2xl font-normal">Kies een product</h1>
      </div>

      {/* Cart Button (shown when cart has items) */}
      {cartItems.length > 0 && (
        <button
          onClick={handleCartClick}
          className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-colors shadow-lg bg-white z-50"
        >
          <ShoppingCart className="w-5 sm:w-6 h-5 sm:h-6" />
          <Badge className="absolute -top-1 -right-1 bg-[#B59871] hover:bg-[#B59871] min-w-[20px] h-[20px] flex items-center justify-center p-1 text-xs">
            {cartItems.length}
          </Badge>
        </button>
      )}
      
      <Tabs defaultValue="kozijnen" className="w-full">
        <div className="px-4 sm:px-8">
          <TabsList className="w-full justify-start sm:justify-between mb-8 bg-transparent border-b rounded-none h-auto p-0 overflow-x-auto">
            <TabsTrigger 
              value="kozijnen" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#B59871] rounded-none pb-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 sm:px-6 flex-shrink-0 sm:flex-1"
            >
              Kozijnen
            </TabsTrigger>
            <TabsTrigger 
              value="schuifpuien"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#B59871] rounded-none pb-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 sm:px-6 flex-shrink-0 sm:flex-1"
            >
              Schuifpuien
            </TabsTrigger>
            <TabsTrigger 
              value="tuindeuren"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#B59871] rounded-none pb-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 sm:px-6 flex-shrink-0 sm:flex-1"
            >
              Tuindeuren
            </TabsTrigger>
            <TabsTrigger 
              value="achterdeuren"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#B59871] rounded-none pb-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 sm:px-6 flex-shrink-0 sm:flex-1"
            >
              Achterdeuren
            </TabsTrigger>
            <TabsTrigger 
              value="voordeuren"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#B59871] rounded-none pb-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 sm:px-6 flex-shrink-0 sm:flex-1"
            >
              Voordeuren
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="px-4 sm:px-8 pb-4 sm:pb-8">
          <TabsContent value="kozijnen" className="mt-0">
            <h2 className="mb-6">Kozijnen</h2>
            
            <div className="space-y-4">
              {kozijnOptions.map((option) => (
                <KozijnOption
                  key={option.id}
                  {...option}
                  isSelected={false}
                  onClick={() => handleSelectProduct(option)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schuifpuien" className="mt-0">
            <h2 className="mb-6">Schuifpuien</h2>
            
            <div className="space-y-4">
              {schuifpuienOptions.map((option) => (
                <KozijnOption
                  key={option.id}
                  {...option}
                  isSelected={false}
                  onClick={() => handleSelectProduct(option)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tuindeuren" className="mt-0">
            <h2 className="mb-6">Tuindeuren</h2>
            
            <div className="space-y-4">
              {tuindeurenOptions.map((option) => (
                <KozijnOption
                  key={option.id}
                  {...option}
                  isSelected={false}
                  onClick={() => handleSelectProduct(option)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achterdeuren" className="mt-0">
            <h2 className="mb-6">Achterdeuren</h2>
            
            <div className="space-y-4">
              {achterdeurenOptions.map((option) => (
                <KozijnOption
                  key={option.id}
                  {...option}
                  isSelected={false}
                  onClick={() => handleSelectProduct(option)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="voordeuren" className="mt-0">
            <h2 className="mb-6">Voordeuren</h2>
            
            <div className="space-y-4">
              {voordeurenOptions.map((option) => (
                <KozijnOption
                  key={option.id}
                  {...option}
                  isSelected={false}
                  onClick={() => handleSelectProduct(option)}
                />
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}