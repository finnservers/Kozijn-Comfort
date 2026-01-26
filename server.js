import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create email transporter
// Support for both service-based (Gmail) and host-based (SiteGround, custom SMTP) configurations
const createTransporter = () => {
  const mailService = process.env.VITE_MAIL_SERVICE || 'gmail';
  
  // If custom host is provided (for SiteGround or other providers)
  if (process.env.VITE_MAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.VITE_MAIL_HOST,
      port: parseInt(process.env.VITE_MAIL_PORT || '465', 10),
      secure: process.env.VITE_MAIL_SECURE === 'true' || process.env.VITE_MAIL_PORT === '465',
      auth: {
        user: process.env.VITE_MAIL_FROM,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }
  
  // Otherwise use service-based configuration (Gmail, etc.)
  return nodemailer.createTransport({
    service: mailService,
    auth: {
      user: process.env.VITE_MAIL_FROM,
      pass: process.env.MAIL_PASSWORD,
    },
  });
};

const transporter = createTransporter();

/**
 * Generate customer confirmation email (to customer)
 */
function getCustomerConfirmationEmail(data) {
  const productDetails = (data.cartItems && data.cartItems.length > 0)
    ? data.cartItems.map((item, idx) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">Producttype</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.productName || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">Materiaal</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.material || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">Afmetingen</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.width || '?'} x ${item.height || '?'} mm</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">Kleur binnenzijde</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.insideColorName || item.inside || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">Kleur buitenzijde</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.outsideFixedColorName || item.outsideFixed || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">Beglazing</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.glassTypeName || 'N/A'}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="2" style="padding: 12px;">Geen producten geselecteerd</td></tr>';

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background: #f9f9f9; margin: 0; padding: 0; }
      .container { max-width: 650px; margin: 20px auto; padding: 0; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #8B7355 0%, #A0826D 100%); padding: 30px 20px; text-align: center; border-bottom: 3px solid #B59871; color: white; }
      .header h1 { margin: 0; font-size: 24px; }
      .header p { margin: 8px 0 0 0; font-size: 14px; }
      .content { padding: 30px 20px; }
      .section { margin: 25px 0; }
      .section-title { font-weight: bold; font-size: 16px; margin: 15px 0 12px 0; color: #333; padding-bottom: 8px; border-bottom: 2px solid #B59871; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; background: #f9f9f9; }
      td { padding: 12px; text-align: left; }
      .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; }
      .footer p { margin: 8px 0; }
      .contact-info { background: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 15px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Bevestiging van uw kozijnen-aanvraag</h1>
        <p>Kozijn Comfort</p>
      </div>

      <div class="content">
        <p>Beste ${data.firstName},</p>
        
        <p>Hartelijk dank voor het samenstellen van uw kozijnen via de configurator van Kozijn Comfort.</p>
        <p><strong>Wij hebben uw aanvraag succesvol ontvangen.</strong></p>
        
        <p>Hieronder vindt u een overzicht van de door u samengestelde keuzes:</p>

        <div class="section">
          <div class="section-title">📋 Overzicht van uw configuratie</div>
          <table>
            ${productDetails}
          </table>
        </div>

        <div class="section">
          <p style="line-height: 1.6;">
            Wij nemen binnen 24 tot 48 uur persoonlijk contact met u op om uw aanvraag te bespreken, eventuele vragen te beantwoorden en de vervolgstappen toe te lichten.
          </p>
          <p style="line-height: 1.6;">
            Heeft u in de tussentijd aanvullende informatie of wensen? Dan kunt u altijd reageren op deze e-mail.
          </p>
        </div>

        <div class="contact-info">
          <p style="margin: 5px 0;"><strong>Met vriendelijke groet,</strong></p>
          <p style="margin: 8px 0;">Kozijn Comfort</p>
          <p style="margin: 3px 0;">📧 info@kozijncomfort.nl</p>
          <p style="margin: 3px 0;">📞 +31 623432448</p>
          <p style="margin: 3px 0;">🌐 www.kozijncomfort.nl</p>
        </div>
      </div>

      <div class="footer">
        <p>Dit is een automatisch gegenereerde bevestigingsmail.</p>
        <p>Antwoord op deze mail of neem contact op voor vragen.</p>
      </div>
    </div>
  </body>
</html>
  `;
}

/**
 * Generate admin notification email (to company)
 */
function getAdminNotificationEmail(data) {
  const productDetails = (data.cartItems && data.cartItems.length > 0)
    ? data.cartItems.map((item, idx) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px;"><strong>Product ${idx + 1}</strong></td>
          <td style="padding: 10px;">
            <div><strong>Producttype:</strong> ${item.productName || 'N/A'}</div>
            <div><strong>Materiaal:</strong> ${item.material || 'N/A'}</div>
            <div><strong>Afmetingen:</strong> ${item.width || '?'} x ${item.height || '?'} mm</div>
            <div><strong>Kleur binnenzijde:</strong> ${item.insideColorName || item.inside || 'N/A'}</div>
            <div><strong>Kleur buitenzijde:</strong> ${item.outsideFixedColorName || item.outsideFixed || 'N/A'}</div>
            <div><strong>Beglazing:</strong> ${item.glassTypeName || 'N/A'}</div>
          </td>
        </tr>
      `).join('')
    : '<tr><td colspan="2" style="padding: 10px;">Geen producten geselecteerd</td></tr>';

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background: #f9f9f9; margin: 0; padding: 0; }
      .container { max-width: 750px; margin: 20px auto; padding: 0; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #8B7355 0%, #A0826D 100%); padding: 30px 20px; text-align: center; border-bottom: 3px solid #B59871; color: white; }
      .header h1 { margin: 0; font-size: 24px; }
      .content { padding: 30px 20px; }
      .section { margin: 25px 0; }
      .section-title { font-weight: bold; font-size: 16px; margin: 15px 0 12px 0; color: #333; padding-bottom: 8px; border-bottom: 2px solid #B59871; background: #f5f5f5; padding: 10px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; background: #f9f9f9; }
      td { padding: 12px; border: 1px solid #eee; }
      .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 3px; }
      .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>⭐ Nieuwe Configurator-Aanvraag</h1>
        <p>${data.firstName} ${data.lastName}</p>
      </div>

      <div class="content">
        <div class="alert">
          <strong>👉 Actie:</strong> Neem binnen 24-48 uur contact op met de klant voor verdere afstemming en het opstellen van een passende offerte.
        </div>

        <div class="section">
          <div class="section-title">👤 Klantgegevens</div>
          <table>
            <tr><td><strong>Naam:</strong></td><td>${data.firstName} ${data.lastName}</td></tr>
            <tr><td><strong>E-mailadres:</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td><strong>Telefoonnummer:</strong></td><td>${data.phone}</td></tr>
            <tr><td><strong>Adres:</strong></td><td>${data.street} ${data.houseNumber}, ${data.postcode} ${data.place}</td></tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">🔧 Samengestelde Configuratie</div>
          <table>
            ${productDetails}
          </table>
        </div>

        <div class="section">
          <div class="section-title">📝 Opmerking van Klant</div>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 3px;">
            ${data.remarks || '<em>Geen opmerkingen</em>'}
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Dit bericht is automatisch gegenereerd door de Kozijnen Configurator.</p>
        <p>Neem contact op met de klant op het bovenstaande e-mailadres of telefoonnummer.</p>
      </div>
    </div>
  </body>
</html>
  `;
}


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
}

/**
 * API endpoint to send order email
 */
app.post('/api/send-order-email', async (req, res) => {
  try {
    let orderData = req.body;

    console.log('\n========================================');
    console.log('📨 NEW ORDER RECEIVED');
    console.log('========================================');
    console.log('Raw body type:', typeof orderData.cartItems);
    console.log('Raw body:', JSON.stringify(orderData, null, 2));

    // Parse cartItems if it's a string
    if (typeof orderData.cartItems === 'string') {
      orderData.cartItems = JSON.parse(orderData.cartItems);
      console.log('✓ Parsed cartItems from string');
    }

    console.log('\nContact Info:', {
      name: `${orderData.firstName} ${orderData.lastName}`,
      email: orderData.email,
      phone: orderData.phone,
    });
    console.log('\nAddress Info:', {
      street: orderData.street,
      houseNumber: orderData.houseNumber,
      postcode: orderData.postcode,
      place: orderData.place,
      country: orderData.country,
    });
    console.log('\nCart Items Count:', orderData.cartItems?.length || 0);
    if (orderData.cartItems && orderData.cartItems.length > 0) {
      orderData.cartItems.forEach((item, idx) => {
        console.log(`\nProduct ${idx + 1}:`, JSON.stringify(item, null, 2));
      });
    }
    console.log('========================================\n');

    // Validate required fields (all required EXCEPT remarks/textarea)
    const requiredFields = ['email', 'firstName', 'lastName', 'street', 'houseNumber', 'postcode', 'place', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !orderData[field] || orderData[field].trim() === '');
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Verplichte velden ontbreken: ${missingFields.join(', ')}`,
        missingFields: missingFields,
      });
    }

    // Check if there are cart items
    if (!orderData.cartItems || orderData.cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Voeg minstens één product toe aan uw kar',
      });
    }

    console.log('========================================');
    console.log('📧 NEW ORDER SUBMISSION');
    console.log('========================================');
    console.log('Customer:', `${orderData.firstName} ${orderData.lastName}`);
    console.log('Email:', orderData.email);
    console.log('Phone:', orderData.phone);
    console.log('Address:', `${orderData.street} ${orderData.houseNumber}, ${orderData.postcode} ${orderData.place}`);
    console.log('Cart Items:', orderData.cartItems.length);
    console.log('========================================\n');

    // 1️⃣ Send confirmation email to customer
    const customerConfirmation = {
      from: process.env.VITE_MAIL_FROM,
      to: orderData.email,
      subject: `Bevestiging van uw kozijnen-aanvraag - Kozijn Comfort`,
      html: getCustomerConfirmationEmail(orderData),
      replyTo: process.env.VITE_MAIL_FROM,
    };

    const customerInfo = await transporter.sendMail(customerConfirmation);
    console.log('✅ Customer confirmation email sent:', customerInfo.messageId);

    // 2️⃣ Send admin notification email to company
    const adminNotification = {
      from: process.env.VITE_MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `Nieuwe configurator-aanvraag - ${orderData.firstName} ${orderData.lastName}`,
      html: getAdminNotificationEmail(orderData),
      replyTo: orderData.email,
    };

    const adminInfo = await transporter.sendMail(adminNotification);
    console.log('✅ Admin notification email sent:', adminInfo.messageId);

    res.json({
      success: true,
      message: 'Uw aanvraag is ontvangen! Controleer uw e-mail voor de bevestiging.',
      customerEmailId: customerInfo.messageId,
      adminEmailId: adminInfo.messageId,
    });
  } catch (error) {
    console.error('❌ Email sending error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Er is een fout opgetreden bij het verzenden van uw aanvraag',
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Mail server running on http://localhost:${PORT}`);
  console.log(`📧 Mail service: ${process.env.VITE_MAIL_SERVICE || 'gmail'}`);
  console.log(`📬 Sending from: ${process.env.VITE_MAIL_FROM}`);
  console.log(`📭 Receiving at: ${process.env.MAIL_TO}`);
});
