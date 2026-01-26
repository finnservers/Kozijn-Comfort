import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronDown, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useCart } from '../context/CartContext';
import logo from 'figma:asset/07b8f6cb8cf9ec9c0f2d2950a7eeb8463aef1f1e.png';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [showRemarks, setShowRemarks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    country: 'Nederland',
    firstName: '',
    lastName: '',
    postcode: '',
    houseNumber: '',
    place: '',
    street: '',
    remarks: ''
  });

  const handleBack = () => {
    navigate('/overview');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validate required fields (all except remarks)
    const requiredFields = {
      email: 'E-mailadres',
      firstName: 'Voornaam',
      lastName: 'Achternaam',
      street: 'Straat',
      houseNumber: 'Huisnummer',
      postcode: 'Postcode',
      place: 'Plaats',
      phone: 'Telefoonnummer',
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, _]) => !formData[key as keyof typeof formData] || formData[key as keyof typeof formData].trim() === '')
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      alert(`Vul alstublieft alle verplichte velden in:\n${missingFields.join(', ')}`);
      return;
    }

    if (cartItems.length === 0) {
      alert('Voeg alstublieft minstens één product toe aan uw kar.');
      return;
    }

    setIsSubmitting(true);
    
    // Build data object
    const submitData = {
      email: formData.email,
      phone: formData.phone,
      firstName: formData.firstName,
      lastName: formData.lastName,
      street: formData.street,
      houseNumber: formData.houseNumber,
      postcode: formData.postcode,
      place: formData.place,
      country: formData.country,
      remarks: formData.remarks,
      cartItems: cartItems,
    };
    
    console.log('=== FORM SUBMISSION ===');
    console.log('Form Data:', formData);
    console.log('Cart Items:', cartItems);
    console.log('Submit Data:', submitData);
    console.log('======================');
    
    try {
      // Send JSON directly to backend
      const apiUrl = import.meta.env.DEV 
        ? 'http://localhost:3001/api/send-order-email'
        : '/api/send-order-email';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Bedankt voor uw aanvraag! We nemen zo snel mogelijk contact met u op.\n\nU ontvangt een bevestigingsmail op het opgegeven e-mailadres.');
        navigate('/overview');
      } else {
        alert(`Er was een probleem: ${result.error || 'Probeer het later opnieuw.'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Er was een fout bij het verwerken van uw aanvraag. Probeer het later opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          
          <h2 className="text-center text-lg sm:text-xl font-normal">Gegevens</h2>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <h2>Uw gegevens</h2>

          {/* Contact Information */}
          <div>
            <h3 className="mb-4">Contactgegevens</h3>
            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="E-mailadres"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="bg-gray-50 border-gray-300"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-md px-3 w-24">
                  <span className="text-2xl">🇳🇱</span>
                  <span>+31</span>
                </div>
                <Input
                  type="tel"
                  placeholder=""
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="flex-1 bg-gray-50 border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="mb-4">Adresgegevens</h3>
            <div className="space-y-4">
              <div>
                <Select value={formData.country} onValueChange={(value) => handleChange('country', value)}>
                  <SelectTrigger className="bg-gray-50 border-gray-300">
                    <SelectValue placeholder="Selecteer land" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nederland">Nederland</SelectItem>
                    <SelectItem value="België">België</SelectItem>
                    <SelectItem value="Duitsland">Duitsland</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">Staat je land er niet tussen? Kies dan overige.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Voornaam"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="bg-gray-50 border-gray-300"
                />
                <Input
                  type="text"
                  placeholder="Achternaam"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="bg-gray-50 border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Postcode"
                  value={formData.postcode}
                  onChange={(e) => handleChange('postcode', e.target.value)}
                  className="bg-gray-50 border-gray-300"
                />
                <Input
                  type="text"
                  placeholder="Huisnummer"
                  value={formData.houseNumber}
                  onChange={(e) => handleChange('houseNumber', e.target.value)}
                  className="bg-gray-50 border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Plaats"
                  value={formData.place}
                  onChange={(e) => handleChange('place', e.target.value)}
                  className="bg-gray-50 border-gray-300"
                />
                <Input
                  type="text"
                  placeholder="Straatnaam"
                  value={formData.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                  className="bg-gray-50 border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Remarks Section */}
          <div>
            <button
              onClick={() => setShowRemarks(!showRemarks)}
              className="flex items-center justify-between w-full py-3 border-b"
            >
              <span>Opmerking toevoegen</span>
              <Plus className={`w-5 h-5 transition-transform ${showRemarks ? 'rotate-45' : ''}`} />
            </button>
            
            {showRemarks && (
              <div className="mt-4">
                <textarea
                  placeholder="Voeg hier eventuele opmerkingen toe..."
                  value={formData.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  className="w-full min-h-[100px] p-3 bg-gray-50 border border-gray-300 rounded-md resize-none"
                />
              </div>
            )}
          </div>

          {/* Hidden fields for form data */}
          <input type="hidden" name="email" value={formData.email} />
          <input type="hidden" name="phone" value={formData.phone} />
          <input type="hidden" name="firstName" value={formData.firstName} />
          <input type="hidden" name="lastName" value={formData.lastName} />
          <input type="hidden" name="street" value={formData.street} />
          <input type="hidden" name="houseNumber" value={formData.houseNumber} />
          <input type="hidden" name="postcode" value={formData.postcode} />
          <input type="hidden" name="place" value={formData.place} />
          <input type="hidden" name="country" value={formData.country} />
          <input type="hidden" name="remarks" value={formData.remarks} />
          
          {/* Hidden fields for each cart item */}
          {cartItems.map((item, index) => (
            <div key={index}>
              <input type="hidden" name={`cartItems[${index}][productName]`} value={item.productName || ''} />
              <input type="hidden" name={`cartItems[${index}][type]`} value={item.type || ''} />
              <input type="hidden" name={`cartItems[${index}][configuration]`} value={item.configuration || ''} />
              <input type="hidden" name={`cartItems[${index}][panels]`} value={item.panels || ''} />
              <input type="hidden" name={`cartItems[${index}][quantity]`} value={item.quantity || '1'} />
              <input type="hidden" name={`cartItems[${index}][width]`} value={item.width || ''} />
              <input type="hidden" name={`cartItems[${index}][height]`} value={item.height || ''} />
              <input type="hidden" name={`cartItems[${index}][insideColorName]`} value={item.insideColorName || ''} />
              <input type="hidden" name={`cartItems[${index}][outsideFixedColorName]`} value={item.outsideFixedColorName || ''} />
              <input type="hidden" name={`cartItems[${index}][outsideMovingColorName]`} value={item.outsideMovingColorName || ''} />
              <input type="hidden" name={`cartItems[${index}][glassType]`} value={item.glassType || ''} />
              <input type="hidden" name={`cartItems[${index}][glassFinish]`} value={item.glassFinish || ''} />
              <input type="hidden" name={`cartItems[${index}][direction]`} value={item.direction || ''} />
              <input type="hidden" name={`cartItems[${index}][screens]`} value={item.screens || ''} />
            </div>
          ))}
          
          {/* Debug: Show hidden data (comment out in production) */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
            <p className="font-bold text-blue-900 mb-2">📋 Gegevens die worden verzonden:</p>
            <pre className="text-blue-800 overflow-auto max-h-40 whitespace-pre-wrap break-words">
{JSON.stringify(
  {
    formData,
    cartItemsCount: cartItems.length,
    cartItems: cartItems.map(item => ({
      productName: item.productName,
      type: item.type,
      configuration: item.configuration,
      quantity: item.quantity,
      width: item.width,
      height: item.height,
      colors: {
        inside: item.insideColorName,
        outsideFixed: item.outsideFixedColorName,
        outsideMoving: item.outsideMovingColorName,
      },
    }))
  },
  null,
  2
)}
            </pre>
          </div>

          {/* Privacy Notice */}
          <div className="pt-4">
            <p className="text-xs text-gray-500">
              Door op de onderstaande knop te drukken ga je akkoord dat je gegevens worden verwerkt volgens ons{' '}
              <a href="#" className="underline">privacy beleid</a>
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#B59871] hover:bg-[#B59871]/90 h-12 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Bezig met versturen...' : 'Bevestig & vraag aan →'}
          </Button>
        </div>
      </div>
    </div>
  );
}