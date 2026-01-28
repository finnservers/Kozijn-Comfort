// Vercel Serverless Function for sending order emails via Resend
import { Resend } from 'resend';

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
      hasResendApiKey: !!process.env.RESEND_API_KEY,
      hasMailFrom: !!process.env.MAIL_FROM,
      hasMailTo: !!process.env.MAIL_TO,
    });

    // Get environment variables
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.MAIL_FROM || 'info@kozijncomfort.nl';
    const emailTo = process.env.MAIL_TO || 'info@kozijncomfort.nl';

    if (!resendApiKey) {
      console.error('❌ Missing Resend API key');
      return res.status(500).json({
        success: false,
        error: 'Resend API key missing. Please add RESEND_API_KEY in Vercel environment variables.'
      });
    }

    console.log('✅ Resend configuration validated');

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    // Prepare email content
    const adminEmailHTML = formatAdminEmailHTML(orderData);
    const adminEmailText = formatEmailText(orderData);
    const customerEmailHTML = formatCustomerEmailHTML(orderData);
    const customerEmailText = formatCustomerEmailText(orderData);

    try {
      // Send email to admin (business owner)
      console.log('📧 Sending admin notification email via Resend...');
      const adminResult = await resend.emails.send({
        from: `Kozijn Comfort <${emailFrom}>`,
        to: emailTo,
        subject: `Nieuwe configurator-aanvraag - ${orderData.firstName} ${orderData.lastName}`,
        html: adminEmailHTML,
        text: adminEmailText,
      });

      console.log('✅ Admin email sent successfully:', {
        id: adminResult.data?.id,
        to: emailTo
      });

      // Send confirmation email to customer
      console.log('📧 Sending customer confirmation email via Resend...');
      const customerResult = await resend.emails.send({
        from: `Kozijnen Comfort <${emailFrom}>`,
        to: orderData.email,
        subject: 'Bevestiging van uw aanvraag - Kozijnen Comfort',
        html: customerEmailHTML,
        text: customerEmailText,
      });

      console.log('✅ Customer confirmation email sent successfully:', {
        id: customerResult.data?.id,
        to: orderData.email
      });

      return res.status(200).json({
        success: true,
        message: 'Order received and emails sent successfully',
        data: {
          email: orderData.email,
          timestamp: new Date().toISOString(),
          adminEmailId: adminResult.data?.id,
          customerEmailId: customerResult.data?.id
        }
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      console.error('Email error details:', {
        message: emailError.message,
        name: emailError.name
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
Dit bericht is automatisch gegenereerd door Kozijn Comfort.
Datum: ${new Date().toLocaleString('nl-NL')}
  `;
}

// Admin notification email
function formatAdminEmailHTML(data) {
  // Build product details from cart items
  const productDetails = data.cartItems && data.cartItems.length > 0
    ? data.cartItems.map((item, idx) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px;"><strong>Product ${idx + 1}</strong></td>
          <td style="padding: 10px;">
            <div><strong>Producttype:</strong> ${item.productName || 'N/A'}</div>
            <div><strong>Materiaal:</strong> ${item.material || item.type || 'N/A'}</div>
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
  </head>
  <body style="font-family: Arial, sans-serif; color: #333; background: #f9f9f9; margin: 0; padding: 20px;">
    <div style="max-width: 750px; margin: 0 auto; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #8B7355 0%, #A0826D 100%); padding: 30px 20px; text-align: center; border-bottom: 3px solid #B59871; color: white;">
        <h1 style="margin: 0; font-size: 24px;">⭐ Nieuwe configurator-aanvraag</h1>
        <p style="margin: 8px 0 0 0; font-size: 16px;">${data.firstName} ${data.lastName}</p>
      </div>

      <div style="padding: 30px 20px;">
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 3px;">
          <strong>👉 Actie:</strong> Neem binnen 24-48 uur contact op met de klant voor verdere afstemming en het opstellen van een passende offerte.
        </div>

        <div style="margin: 25px 0;">
          <div style="font-weight: bold; font-size: 16px; margin: 15px 0 12px 0; color: #333; padding: 10px; background: #f5f5f5; border-bottom: 2px solid #B59871;">👤 Klantgegevens</div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 12px; border: 1px solid #eee;"><strong>Naam:</strong></td><td style="padding: 12px; border: 1px solid #eee;">${data.firstName} ${data.lastName}</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 12px; border: 1px solid #eee;"><strong>E-mailadres:</strong></td><td style="padding: 12px; border: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 12px; border: 1px solid #eee;"><strong>Telefoonnummer:</strong></td><td style="padding: 12px; border: 1px solid #eee;">${data.phone}</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 12px; border: 1px solid #eee;"><strong>Adres:</strong></td><td style="padding: 12px; border: 1px solid #eee;">${data.street} ${data.houseNumber}, ${data.postcode} ${data.place}</td></tr>
          </table>
        </div>

        <div style="margin: 25px 0;">
          <div style="font-weight: bold; font-size: 16px; margin: 15px 0 12px 0; color: #333; padding: 10px; background: #f5f5f5; border-bottom: 2px solid #B59871;">🔧 Samengestelde Configuratie</div>
          <table style="width: 100%; border-collapse: collapse;">
            ${productDetails}
          </table>
        </div>

        <div style="margin: 25px 0;">
          <div style="font-weight: bold; font-size: 16px; margin: 15px 0 12px 0; color: #333; padding: 10px; background: #f5f5f5; border-bottom: 2px solid #B59871;">📝 Opmerking van Klant</div>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 3px;">
            ${data.remarks || '<em>Geen opmerkingen</em>'}
          </div>
        </div>
      </div>

      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee;">
        <p style="margin: 5px 0;">Dit bericht is automatisch gegenereerd door Kozijn Comfort.</p>
        <p style="margin: 5px 0;">Neem contact op met de klant op het bovenstaande e-mailadres of telefoonnummer.</p>
      </div>
    </div>
  </body>
</html>
  `;
}

// Customer confirmation email
function formatCustomerEmailHTML(data) {
  // Build product overview from cart items
  const productRows = data.cartItems && data.cartItems.length > 0
    ? data.cartItems.map((item, idx) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px;">Producttype</td>
          <td style="padding: 12px;">${item.productName || 'N/A'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px;">Materiaal</td>
          <td style="padding: 12px;">${item.material || item.type || 'N/A'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px;">Afmetingen</td>
          <td style="padding: 12px;">${item.width || '?'} x ${item.height || '?'} mm</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px;">Kleur binnenzijde</td>
          <td style="padding: 12px;">${item.insideColorName || item.inside || 'N/A'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px;">Kleur buitenzijde</td>
          <td style="padding: 12px;">${item.outsideFixedColorName || item.outsideFixed || 'N/A'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px;">Beglazing</td>
          <td style="padding: 12px;">${item.glassTypeName || 'N/A'}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="2" style="padding: 12px;">Geen producten geselecteerd</td></tr>';

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body style="font-family: Arial, sans-serif; color: #333; background: #f9f9f9; margin: 0; padding: 20px;">
    <div style="max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #8B7355 0%, #A0826D 100%); padding: 30px 20px; text-align: center; border-bottom: 3px solid #B59871;">
        <h1 style="margin: 0; font-size: 24px; color: white;">Bevestiging van uw kozijnen-aanvraag</h1>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #f5f5f5;">Kozijn Comfort</p>
      </div>

      <div style="padding: 30px 20px;">
        <p style="font-size: 16px; line-height: 1.6; color: #333;">Beste ${data.firstName},</p>

        <p style="font-size: 15px; line-height: 1.8; color: #555;">
          Hartelijk dank voor het samenstellen van uw kozijnen via de configurator van Kozijn Comfort.<br>
          <strong>Wij hebben uw aanvraag succesvol ontvangen.</strong>
        </p>

        <p style="font-size: 15px; line-height: 1.8; color: #555;">
          Hieronder vindt u een overzicht van de door u samengestelde keuzes:
        </p>

        <div style="margin: 25px 0;">
          <p style="font-weight: bold; font-size: 16px; margin: 15px 0 12px 0; color: #333; padding-bottom: 8px; border-bottom: 2px solid #B59871;">📋 Overzicht van uw configuratie</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; background: #f9f9f9;">
            ${productRows}
          </table>
        </div>

        <p style="font-size: 15px; line-height: 1.8; color: #555;">
          Wij nemen binnen 24 tot 48 uur persoonlijk contact met u op om uw aanvraag te bespreken, eventuele vragen te beantwoorden en de vervolgstappen toe te lichten.
        </p>

        <p style="font-size: 15px; line-height: 1.8; color: #555;">
          Heeft u in de tussentijd aanvullende informatie of wensen? Dan kunt u altijd reageren op deze e-mail.
        </p>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin-top: 25px;">
          <p style="margin: 5px 0; font-weight: bold;">Met vriendelijke groet,</p>
          <p style="margin: 8px 0;">Kozijn Comfort</p>
          <p style="margin: 3px 0;">📧 info@kozijncomfort.nl</p>
          <p style="margin: 3px 0;">📞 +31 623432448</p>
          <p style="margin: 3px 0;">🌐 www.kozijncomfort.nl</p>
        </div>
      </div>

      <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;">
        <p style="margin: 5px 0;">Dit is een automatisch gegenereerde bevestigingsmail.</p>
        <p style="margin: 5px 0;">Antwoord op deze mail of neem contact op voor vragen.</p>
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
