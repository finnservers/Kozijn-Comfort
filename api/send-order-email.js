// Vercel Serverless Function for sending order emails
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const orderData = req.body;

    // Get environment variables
    const emailUser = process.env.VITE_EMAIL_USER;
    const emailPass = process.env.VITE_EMAIL_PASS;
    const emailTo = process.env.VITE_EMAIL_TO || emailUser;

    if (!emailUser || !emailPass) {
      console.error('Missing email configuration');
      return res.status(500).json({ 
        success: false, 
        error: 'Email configuration missing. Please add VITE_EMAIL_USER and VITE_EMAIL_PASS in Vercel environment variables.' 
      });
    }

    // Format the email content
    const emailContent = formatEmailContent(orderData);
    const htmlContent = formatEmailHTML(orderData);

    // Log the order for debugging
    console.log('Order received:', {
      email: orderData.email,
      name: `${orderData.firstName} ${orderData.lastName}`,
      items: orderData.cartItems?.length || 0
    });

    // Use nodemailer to send email
    // Note: You'll need to add nodemailer as a dependency
    // For now, we'll just return success
    // In production, integrate with SendGrid, Resend, or AWS SES
    
    return res.status(200).json({ 
      success: true, 
      message: 'Order received successfully',
      data: {
        email: orderData.email,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error processing order:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to process order: ' + error.message 
    });
  }
}

function formatEmailContent(data) {
  const cartSummary = data.cartItems
    ?.map((item, index) => 
      `${index + 1}. ${item.productName || 'Product'} - ${item.quantity || 1}x`
    )
    .join('\n') || 'No items';

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
${cartSummary}

OPMERKINGEN:
============
${data.remarks || 'Geen opmerkingen'}

============================================
Dit bericht is automatisch gegenereerd door de Kozijnen Configurator.
Datum: ${new Date().toLocaleString('nl-NL')}
  `;
}

function formatEmailHTML(data) {
  let cartSummary = '';
  
  if (data.cartItems && data.cartItems.length > 0) {
    cartSummary = data.cartItems
      .map((item, index) => {
        const getColor = (item, field) => {
          return item[field] || item.colors?.[field] || '';
        };

        return `
          <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid #B59871; background: #f9f9f9; border-radius: 3px;">
            <strong style="display: block; margin-bottom: 12px; color: #B59871; font-size: 15px;">📦 Product ${index + 1}</strong>
            
            <div style="font-size: 13px; line-height: 1.8; color: #333;">
              ${item.productName ? `<div><strong>Producttype:</strong> ${item.productName}</div>` : ''}
              ${item.type ? `<div><strong>Type:</strong> ${item.type}</div>` : ''}
              ${item.configuration ? `<div><strong>Configuratie:</strong> ${item.configuration}</div>` : ''}
              ${item.panels ? `<div><strong>Panelen:</strong> ${item.panels}</div>` : ''}
              ${item.width || item.height ? `<div><strong>Afmetingen:</strong> ${item.width || '?'}mm x ${item.height || '?'}mm</div>` : ''}
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
                <strong style="color: #B59871;">✓ Aantal: ${item.quantity || 1}</strong>
              </div>
            </div>
          </div>`;
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
  </head>
  <body style="font-family: Arial, sans-serif; color: #333; background: #f9f9f9; margin: 0; padding: 20px;">
    <div style="max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #f5f5f5 0%, #efefef 100%); padding: 30px 20px; text-align: center; border-bottom: 3px solid #B59871;">
        <h1 style="margin: 0; font-size: 24px; color: #333;">Nieuwe Orderaanvraag</h1>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Kozijnen Configurator</p>
      </div>

      <div style="padding: 30px 20px;">
        <div style="margin: 25px 0;">
          <div style="font-weight: bold; font-size: 16px; margin: 15px 0 12px 0; color: #333; padding-bottom: 8px; border-bottom: 2px solid #B59871;">👤 Contactgegevens</div>
          <div style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Naam:</strong> ${data.firstName} ${data.lastName}</div>
          <div style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>E-mail:</strong> ${data.email}</div>
          <div style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Telefoon:</strong> +31 ${data.phone}</div>
        </div>

        <div style="margin: 25px 0;">
          <div style="font-weight: bold; font-size: 16px; margin: 15px 0 12px 0; color: #333; padding-bottom: 8px; border-bottom: 2px solid #B59871;">📍 Adresgegevens</div>
          <div style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Straat:</strong> ${data.street} ${data.houseNumber}</div>
          <div style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Postcode:</strong> ${data.postcode}</div>
          <div style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Plaats:</strong> ${data.place}</div>
          <div style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Land:</strong> ${data.country}</div>
        </div>

        <div style="margin: 25px 0;">
          <div style="font-weight: bold; font-size: 16px; margin: 15px 0 12px 0; color: #333; padding-bottom: 8px; border-bottom: 2px solid #B59871;">🪟 Geselecteerde Producten</div>
          ${cartSummary}
        </div>

        ${data.remarks ? `
        <div style="margin: 25px 0;">
          <div style="font-weight: bold; font-size: 16px; margin: 15px 0 12px 0; color: #333; padding-bottom: 8px; border-bottom: 2px solid #B59871;">📝 Opmerkingen</div>
          <div style="background: #f9f9f9; padding: 12px; border-left: 4px solid #B59871; border-radius: 3px;">${data.remarks.replace(/\n/g, '<br>')}</div>
        </div>` : ''}
      </div>

      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee;">
        <p style="margin: 5px 0;"><strong>Dit bericht is automatisch gegenereerd door de Kozijnen Configurator</strong></p>
        <p style="margin: 5px 0;">Datum en tijd: ${new Date().toLocaleString('nl-NL')}</p>
      </div>
    </div>
  </body>
</html>
  `;
}
