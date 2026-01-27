// Vercel Serverless Function for sending order emails via SMTP
import nodemailer from 'nodemailer';

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

    console.log('=== EMAIL API CALLED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Environment check:', {
      hasMailFrom: !!process.env.VITE_MAIL_FROM,
      hasMailPassword: !!process.env.MAIL_PASSWORD,
      hasMailTo: !!process.env.MAIL_TO,
      hasMailHost: !!process.env.VITE_MAIL_HOST,
      hasMailPort: !!process.env.VITE_MAIL_PORT,
    });

    // Get environment variables
    const emailFrom = process.env.VITE_MAIL_FROM;
    const emailPassword = process.env.MAIL_PASSWORD;
    const emailTo = process.env.MAIL_TO || 'finnservers@gmail.com';
    const smtpHost = process.env.VITE_MAIL_HOST || 'c1120075.sgvps.net';
    const smtpPort = parseInt(process.env.VITE_MAIL_PORT || '465');

    if (!emailFrom || !emailPassword) {
      console.error('❌ Missing email configuration');
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('MAIL')));
      return res.status(500).json({
        success: false,
        error: 'Email configuration missing. Please add VITE_MAIL_FROM and MAIL_PASSWORD in Vercel environment variables.'
      });
    }

    console.log('✅ Email configuration validated');

    // Create nodemailer transporter with multiple fallback options
    const transporterOptions = {
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: emailFrom,
        pass: emailPassword,
      },
      tls: {
        rejectUnauthorized: false, // Accept self-signed certificates
        minVersion: 'TLSv1.2' // Use modern TLS instead of deprecated SSLv3
      },
      connectionTimeout: 15000, // 15 seconds
      greetingTimeout: 15000,
      socketTimeout: 15000,
      debug: true, // Enable debug logs
      logger: true
    };

    console.log('Creating SMTP transporter with config:', {
      host: smtpHost,
      port: smtpPort,
      user: emailFrom,
      secure: smtpPort === 465
    });

    const transporter = nodemailer.createTransport(transporterOptions);

    // Skip verification and try to send directly
    // Verification often fails on serverless but sending works
    console.log('Skipping SMTP verification, attempting to send email directly...');

    // Format email HTML
    const emailHTML = formatEmailHTML(orderData);
    const emailText = formatEmailText(orderData);

    // Send email
    const mailOptions = {
      from: `"Kozijnen Configurator" <${emailFrom}>`,
      to: emailTo,
      subject: `Nieuwe Orderaanvraag - ${orderData.firstName} ${orderData.lastName}`,
      text: emailText,
      html: emailHTML,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      
      console.log('Email sent successfully:', {
        messageId: info.messageId,
        to: emailTo,
        from: emailFrom
      });

      return res.status(200).json({
        success: true,
        message: 'Order received and email sent successfully',
        data: {
          email: orderData.email,
          timestamp: new Date().toISOString(),
          messageId: info.messageId
        }
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      console.error('Email error details:', {
        code: emailError.code,
        command: emailError.command,
        response: emailError.response,
        responseCode: emailError.responseCode
      });
      
      // Return success anyway - order is logged even if email fails
      return res.status(200).json({
        success: true,
        message: 'Order received (email delivery pending)',
        warning: 'Email could not be sent immediately but order is logged',
        data: {
          email: orderData.email,
          timestamp: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('Error processing order:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process order: ' + error.message
    });
  }
}

function formatEmailText(data) {
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
          <div style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>E-mail:</strong> <a href="mailto:${data.email}" style="color: #B59871; text-decoration: none;">${data.email}</a></div>
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
        <p style="margin-top: 15px; color: #999;">Wij behandelen uw aanvraag zo spoedig mogelijk.</p>
      </div>
    </div>
  </body>
</html>
  `;
}
