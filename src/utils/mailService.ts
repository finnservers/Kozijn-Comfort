/// <reference types="vite/client" />

/**
 * Mail Service Configuration
 * This file handles email sending for form submissions
 */

interface MailConfig {
  service: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
  to: string;
}

interface OrderData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  postcode: string;
  place: string;
  country: string;
  remarks?: string;
  cartItems: any[];
}

/**
 * Get mail configuration from environment variables
 */
export const getMailConfig = (): MailConfig => {
  const mailService = import.meta.env.VITE_MAIL_SERVICE || 'gmail';
  const mailFrom = import.meta.env.VITE_MAIL_FROM;
  const mailPassword = import.meta.env.MAIL_PASSWORD;
  const mailTo = import.meta.env.MAIL_TO || mailFrom;

  if (!mailFrom || !mailPassword) {
    throw new Error(
      'Mail configuration is missing. Please set VITE_MAIL_FROM and MAIL_PASSWORD in .env file'
    );
  }

  return {
    service: mailService,
    auth: {
      user: mailFrom,
      pass: mailPassword,
    },
    from: mailFrom,
    to: mailTo,
  };
};

/**
 * Format order data for email template
 */
export const formatOrderForEmail = (data: OrderData): string => {
  const cartSummary = data.cartItems
    .map((item, index) => `${index + 1}. ${item.name || 'Product'} - ${item.quantity || 1}x`)
    .join('\n');

  return `
NIEUWE ORDERAANVRAAG - KOZIJNEN CONFIGURATOR
============================================

CONTACTGEGEVENS:
===============
Naam: ${data.firstName} ${data.lastName}
E-mail: ${data.email}
Telefoon: +31${data.phone}

ADRESGEGEVENS:
==============
Straat: ${data.street} ${data.houseNumber}
Postcode: ${data.postcode}
Plaats: ${data.place}
Land: ${data.country}

GESELECTEERDE PRODUCTEN:
=======================
${cartSummary || 'Geen producten geselecteerd'}

OPMERKINGEN:
============
${data.remarks || 'Geen opmerkingen'}

============================================
Dit bericht is automatisch gegenereerd door de Kozijnen Configurator.
  `;
};

/**
 * Send order confirmation email
 * Note: This requires a backend endpoint. The actual sending happens server-side.
 */
export const sendOrderEmail = async (orderData: OrderData): Promise<boolean> => {
  try {
    // Send to backend API
    const apiUrl = import.meta.env.DEV 
      ? 'http://localhost:3001/api/send-order-email'
      : '/api/send-order-email';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Email sending failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const getEmailTemplate = (data: OrderData): string => {
  console.log('📧 Email Template - Data received:', {
    email: data.email,
    firstName: data.firstName,
    cartItemsType: typeof data.cartItems,
    cartItemsLength: Array.isArray(data.cartItems) ? data.cartItems.length : 'not array',
    firstItem: Array.isArray(data.cartItems) ? data.cartItems[0] : null,
  });

  // Ensure cartItems is an array
  let cartItems = [];
  if (Array.isArray(data.cartItems)) {
    cartItems = data.cartItems;
  } else if (typeof data.cartItems === 'string') {
    try {
      cartItems = JSON.parse(data.cartItems);
    } catch (e) {
      console.error('Failed to parse cartItems:', e);
      cartItems = [];
    }
  }

  let cartSummary = '';
  
  if (cartItems && cartItems.length > 0) {
    cartSummary = cartItems
      .map((item, index) => {
        console.log(`📧 Processing product ${index + 1}:`, item);
        
        // Extract color info - handle nested structure
        const getColor = (item, field) => {
          return item[field] || item.colors?.[field] || '';
        };

        const productHTML = `
          <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid #B59871; background: #f9f9f9; border-radius: 3px;">
            <strong style="display: block; margin-bottom: 12px; color: #B59871; font-size: 15px;">📦 Product ${index + 1}</strong>
            
            <div style="font-size: 13px; line-height: 1.8; color: #333;">
              ${item.productName ? `<div><strong>Producttype:</strong> ${item.productName}</div>` : ''}
              ${item.type ? `<div><strong>Type:</strong> ${item.type}</div>` : ''}
              ${item.configuration ? `<div><strong>Configuratie:</strong> ${item.configuration}</div>` : ''}
              ${item.panels ? `<div><strong>Panelen:</strong> ${item.panels}</div>` : ''}
              ${item.width || item.height ? `<div><strong>Afmetingen:</strong> ${item.width || '?'}mm (breedte) x ${item.height || '?'}mm (hoogte)</div>` : ''}
              ${getColor(item, 'insideColorName') || getColor(item, 'inside') ? `<div><strong>Kleur binnenkant:</strong> ${getColor(item, 'insideColorName') || getColor(item, 'inside')}</div>` : ''}
              ${getColor(item, 'outsideFixedColorName') || getColor(item, 'outsideFixed') ? `<div><strong>Kleur buitenkant vast deel:</strong> ${getColor(item, 'outsideFixedColorName') || getColor(item, 'outsideFixed')}</div>` : ''}
              ${getColor(item, 'outsideMovingColorName') || getColor(item, 'outsideMoving') ? `<div><strong>Kleur buitenkant beweegbare delen:</strong> ${getColor(item, 'outsideMovingColorName') || getColor(item, 'outsideMoving')}</div>` : ''}
              ${item.glassTypeName ? `<div><strong>Glastype:</strong> ${item.glassTypeName}</div>` : ''}
              ${item.glassFinishName ? `<div><strong>Glasafwerking:</strong> ${item.glassFinishName}</div>` : ''}
              ${item.direction ? `<div><strong>Richting:</strong> ${item.direction}</div>` : ''}
              ${item.screens ? `<div><strong>Schermen:</strong> ${item.screens}</div>` : ''}
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
                <strong style="color: #B59871;">✓ Aantal: ${item.quantity || 1}</strong>
              </div>
            </div>
          </div>`;
        
        return productHTML;
      })
      .join('');
  } else {
    cartSummary = '<div style="padding: 15px; text-align: center; color: #999;">Geen producten in winkelwagen</div>';
  }

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background: #f9f9f9; margin: 0; padding: 0; }
      .container { max-width: 650px; margin: 20px auto; padding: 0; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #f5f5f5 0%, #efefef 100%); padding: 30px 20px; text-align: center; border-bottom: 3px solid #B59871; }
      .header h1 { margin: 0; font-size: 24px; color: #333; }
      .header p { margin: 8px 0 0 0; font-size: 14px; color: #666; }
      .content { padding: 30px 20px; }
      .section { margin: 25px 0; }
      .section-title { font-weight: bold; font-size: 16px; margin: 15px 0 12px 0; color: #333; padding-bottom: 8px; border-bottom: 2px solid #B59871; }
      .info-row { padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
      .info-row strong { color: #333; min-width: 150px; }
      .info-row span { color: #555; text-align: right; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th { background: #f5f5f5; padding: 12px; text-align: left; font-weight: bold; color: #333; border-bottom: 2px solid #B59871; }
      td { padding: 10px; border-bottom: 1px solid #eee; }
      .remarks-box { background: #f9f9f9; padding: 12px; border-left: 4px solid #B59871; margin-top: 10px; border-radius: 3px; }
      .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; }
      .footer p { margin: 5px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Nieuwe Orderaanvraag</h1>
        <p>Kozijnen Configurator</p>
      </div>

      <div class="content">
        <div class="section">
          <div class="section-title">👤 Contactgegevens</div>
          <div class="info-row"><strong>Naam:</strong> <span>${data.firstName} ${data.lastName}</span></div>
          <div class="info-row"><strong>E-mailadres:</strong> <span><a href="mailto:${data.email}" style="color: #B59871; text-decoration: none;">${data.email}</a></span></div>
          <div class="info-row"><strong>Telefoonnummer:</strong> <span>+31 ${data.phone}</span></div>
        </div>

        <div class="section">
          <div class="section-title">📍 Adresgegevens</div>
          <div class="info-row"><strong>Straat & Huisnummer:</strong> <span>${data.street} ${data.houseNumber}</span></div>
          <div class="info-row"><strong>Postcode:</strong> <span>${data.postcode}</span></div>
          <div class="info-row"><strong>Plaats:</strong> <span>${data.place}</span></div>
          <div class="info-row"><strong>Land:</strong> <span>${data.country}</span></div>
        </div>

        <div class="section">
          <div class="section-title">🪟 Geselecteerde Producten</div>
          ${cartSummary}
        </div>

        ${
          data.remarks
            ? `<div class="section">
          <div class="section-title">📝 Opmerkingen</div>
          <div class="remarks-box">${data.remarks.replace(/\n/g, '<br>')}</div>
        </div>`
            : ''
        }
      </div>

      <div class="footer">
        <p><strong>Dit bericht is automatisch gegenereerd door de Kozijnen Configurator</strong></p>
        <p>Datum en tijd: ${new Date().toLocaleString('nl-NL')}</p>
        <p style="margin-top: 15px; color: #999;">Wij behandelen uw aanvraag zo spoedig mogelijk.</p>
      </div>
    </div>
  </body>
</html>
  `;
};
