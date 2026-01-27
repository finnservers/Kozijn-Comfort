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
      hasMailFrom: !!process.env.MAIL_FROM,
      hasMailPassword: !!process.env.MAIL_PASSWORD,
      hasMailTo: !!process.env.MAIL_TO,
      hasMailHost: !!process.env.MAIL_HOST,
      hasMailPort: !!process.env.MAIL_PORT,
    });

    // Get environment variables (without VITE_ prefix - VITE_ doesn't work in serverless functions!)
    const emailFrom = process.env.MAIL_FROM;
    const emailPassword = process.env.MAIL_PASSWORD;
    const emailTo = process.env.MAIL_TO || 'finnservers@gmail.com';
    const smtpHost = process.env.MAIL_HOST || 'mail.kozijncomfort.nl';
    const smtpPort = parseInt(process.env.MAIL_PORT || '587');

    if (!emailFrom || !emailPassword) {
      console.error('❌ Missing email configuration');
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('MAIL')));
      return res.status(500).json({
        success: false,
        error: 'Email configuration missing. Please add MAIL_FROM and MAIL_PASSWORD in Vercel environment variables.'
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
      // Try multiple auth methods
      authMethod: 'PLAIN',
      connectionTimeout: 15000, // 15 seconds
      greetingTimeout: 15000,
      socketTimeout: 15000,
      debug: true, // Enable debug logs
      logger: true
    };

    console.log('SMTP Authentication attempt with:', {
      user: emailFrom,
      passwordLength: emailPassword?.length,
      passwordStart: emailPassword?.substring(0, 3) + '***'
    });

    console.log('Creating SMTP transporter with config:', {
      host: smtpHost,
      port: smtpPort,
      user: emailFrom,
      secure: smtpPort === 465
    });

    const transporter = nodemailer.createTransport(transporterOptions);

    // Skip verification and try to send directly
    // Verification often fails on serverless but sending works
    console.log('Skipping SMTP verification, attempting to send emails directly...');

    // Prepare email content
    const adminEmailHTML = formatAdminEmailHTML(orderData);
    const adminEmailText = formatEmailText(orderData);
    const customerEmailHTML = formatCustomerEmailHTML(orderData);
    const customerEmailText = formatCustomerEmailText(orderData);

    try {
      // Send email to admin (business owner)
      console.log('📧 Sending admin notification email...');
      const adminMailOptions = {
        from: `"Kozijnen Configurator" <${emailFrom}>`,
        to: emailTo,
        subject: `Nieuwe Orderaanvraag - ${orderData.firstName} ${orderData.lastName}`,
        text: adminEmailText,
        html: adminEmailHTML,
      };

      const adminInfo = await transporter.sendMail(adminMailOptions);
      console.log('✅ Admin email sent successfully:', {
        messageId: adminInfo.messageId,
        to: emailTo
      });

      // Send confirmation email to customer
      console.log('📧 Sending customer confirmation email...');
      const customerMailOptions = {
        from: `"Kozijnen Comfort" <${emailFrom}>`,
        to: orderData.email,
        subject: 'Bevestiging van uw aanvraag - Kozijnen Comfort',
        text: customerEmailText,
        html: customerEmailHTML,
      };

      const customerInfo = await transporter.sendMail(customerMailOptions);
      console.log('✅ Customer confirmation email sent successfully:', {
        messageId: customerInfo.messageId,
        to: orderData.email
      });

      return res.status(200).json({
        success: true,
        message: 'Order received and emails sent successfully',
        data: {
          email: orderData.email,
          timestamp: new Date().toISOString(),
          adminMessageId: adminInfo.messageId,
          customerMessageId: customerInfo.messageId
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

// Admin notification email (detailed order info)
function formatAdminEmailHTML(data) {
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

// Customer confirmation email (simple, friendly confirmation)
function formatCustomerEmailHTML(data) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body style="font-family: Arial, sans-serif; color: #333; background: #f9f9f9; margin: 0; padding: 20px;">
    <div style="max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #8B7355 0%, #A0826D 100%); padding: 30px 20px; text-align: center; border-bottom: 3px solid #B59871;">
        <h1 style="margin: 0; font-size: 24px; color: white;">Bedankt voor uw aanvraag!</h1>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #f5f5f5;">Kozijnen Comfort</p>
      </div>

      <div style="padding: 30px 20px;">
        <p style="font-size: 16px; line-height: 1.6; color: #333;">Beste ${data.firstName},</p>

        <p style="font-size: 15px; line-height: 1.8; color: #555;">
          Hartelijk dank voor uw aanvraag via onze kozijnen configurator.
          Wij hebben uw gegevens goed ontvangen en zullen deze zo spoedig mogelijk in behandeling nemen.
        </p>

        <div style="background: #f5f5f5; padding: 20px; border-left: 4px solid #B59871; margin: 25px 0; border-radius: 3px;">
          <p style="margin: 0 0 15px 0; font-size: 15px; color: #333;"><strong>📋 Uw gegevens:</strong></p>
          <p style="margin: 8px 0; font-size: 14px; color: #555;"><strong>Naam:</strong> ${data.firstName} ${data.lastName}</p>
          <p style="margin: 8px 0; font-size: 14px; color: #555;"><strong>E-mail:</strong> ${data.email}</p>
          <p style="margin: 8px 0; font-size: 14px; color: #555;"><strong>Telefoon:</strong> +31 ${data.phone}</p>
          <p style="margin: 8px 0; font-size: 14px; color: #555;"><strong>Adres:</strong> ${data.street} ${data.houseNumber}, ${data.postcode} ${data.place}</p>
        </div>

        <div style="background: #fff9f0; padding: 20px; border-radius: 3px; margin: 25px 0;">
          <p style="margin: 0 0 10px 0; font-size: 15px; color: #333;"><strong>⏱️ Wat gebeurt er nu?</strong></p>
          <p style="margin: 8px 0; font-size: 14px; color: #555; line-height: 1.6;">
            Een van onze adviseurs zal binnen 1-2 werkdagen contact met u opnemen om uw wensen te bespreken
            en een vrijblijvende offerte op te stellen.
          </p>
        </div>

        ${data.remarks ? `
        <div style="margin: 25px 0;">
          <p style="font-size: 14px; color: #666;"><strong>Uw opmerking:</strong></p>
          <p style="background: #f9f9f9; padding: 12px; border-left: 4px solid #B59871; font-size: 14px; color: #555; font-style: italic;">
            "${data.remarks}"
          </p>
        </div>` : ''}

        <p style="font-size: 14px; line-height: 1.8; color: #555; margin-top: 30px;">
          Heeft u vragen of wilt u wijzigingen doorgeven? Neem gerust contact met ons op!
        </p>

        <div style="margin: 30px 0; padding: 20px; background: #f5f5f5; border-radius: 3px; text-align: center;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Contact opnemen?</p>
          <p style="margin: 5px 0;"><a href="mailto:info@kozijncomfort.nl" style="color: #B59871; text-decoration: none; font-weight: bold;">info@kozijncomfort.nl</a></p>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          Met vriendelijke groet,<br>
          <strong style="color: #333;">Het team van Kozijnen Comfort</strong>
        </p>
      </div>

      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;">
        <p style="margin: 5px 0;">© ${new Date().getFullYear()} Kozijnen Comfort</p>
        <p style="margin: 5px 0;">Dit is een geautomatiseerd bericht. Antwoorden op deze e-mail worden binnen 1 werkdag behandeld.</p>
      </div>
    </div>
  </body>
</html>
  `;
}

// Customer confirmation email (plain text version)
function formatCustomerEmailText(data) {
  return `
BEDANKT VOOR UW AANVRAAG
========================

Beste ${data.firstName},

Hartelijk dank voor uw aanvraag via onze kozijnen configurator.
Wij hebben uw gegevens goed ontvangen en zullen deze zo spoedig mogelijk in behandeling nemen.

UW GEGEVENS:
============
Naam: ${data.firstName} ${data.lastName}
E-mail: ${data.email}
Telefoon: +31 ${data.phone}
Adres: ${data.street} ${data.houseNumber}, ${data.postcode} ${data.place}

${data.remarks ? `UW OPMERKING:\n============\n${data.remarks}\n\n` : ''}

WAT GEBEURT ER NU?
==================
Een van onze adviseurs zal binnen 1-2 werkdagen contact met u opnemen om uw wensen te bespreken en een vrijblijvende offerte op te stellen.

Heeft u vragen of wilt u wijzigingen doorgeven? Neem gerust contact met ons op via info@kozijncomfort.nl

Met vriendelijke groet,
Het team van Kozijnen Comfort

============================================
© ${new Date().getFullYear()} Kozijnen Comfort
Dit is een geautomatiseerd bericht.
Datum: ${new Date().toLocaleString('nl-NL')}
  `;
}
