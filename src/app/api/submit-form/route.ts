import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent } from '@/lib/firebaseService';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'vcs-amersham';
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCd6EskMn3ED4SJ2FeeiWwOtYP1nXaKxeU';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const siteContent = await getSiteContent();

    const recipientEmail = siteContent?.web3forms?.email || 'digitalbotsolutions@gmail.com';
    const web3formsKey = siteContent?.web3forms?.accessKey || process.env.WEB3FORMS_ACCESS_KEY || '';

    const {
      name,
      email,
      phone,
      eventType,
      eventLocation,
      dateOfEvent,
      noOfPax,
      message,
      packageSelected,
      serviceType = 'Catering / Contact Inquiry',
      ...customFields
    } = data;

    // 1. Send to Web3Forms API if access key exists or via direct Web3Forms payload
    let web3formsSuccess = false;
    if (web3formsKey) {
      try {
        const payload: Record<string, any> = {
          access_key: web3formsKey,
          subject: `New Booking Request: ${serviceType} from ${name}${eventType ? ` (${eventType})` : ''}`,
          from_name: 'Veg Chennai SriLalitha Amersham',
          to: recipientEmail,
          "Name": name || 'Not specified',
          "Email": email || 'Not specified',
          "Phone": phone || 'Not specified',
          "Event Type": eventType || 'Not specified',
          "Event Location": eventLocation || customFields?.eventLocation || 'Not specified',
          "Date Of Event": dateOfEvent || 'Not specified',
          "No Of Guests (Pax)": noOfPax ? `${noOfPax}` : 'Not specified',
          "Service Type": serviceType || 'Not specified',
        };

        if (packageSelected) {
          payload["Package"] = packageSelected;
        }

        // Include any additional custom fields except excluded ones
        for (const [k, v] of Object.entries(customFields)) {
          if (k !== 'eventLocation' && k !== 'dietaryRequirements' && k !== 'DietaryRequirements' && k !== 'recipientEmail' && v) {
            payload[k] = v;
          }
        }

        if (message) {
          payload["Message"] = message;
        }

        const web3Response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          },
          body: JSON.stringify(payload),
        });

        const web3Json = await web3Response.json();
        if (web3Json.success) {
          web3formsSuccess = true;
        }
      } catch (web3Err) {
        console.warn('Web3Forms dispatch warning:', web3Err);
      }
    }

    // 2. Safely save enquiry into Firebase Cloud Firestore database archive
    try {
      if (API_KEY && PROJECT_ID) {
        const enquiryId = `enquiry_${Date.now()}`;
        const firestoreUrl = `${FIRESTORE_BASE}/enquiries/${enquiryId}?key=${API_KEY}`;
        
        await fetch(firestoreUrl, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: {
              name: { stringValue: name || '' },
              email: { stringValue: email || '' },
              phone: { stringValue: phone || '' },
              eventType: { stringValue: eventType || '' },
              eventLocation: { stringValue: eventLocation || customFields?.eventLocation || '' },
              packageSelected: { stringValue: packageSelected || '' },
              dateOfEvent: { stringValue: dateOfEvent || '' },
              noOfPax: { stringValue: String(noOfPax || '') },
              message: { stringValue: message || '' },
              serviceType: { stringValue: serviceType || '' },
              customFields: { stringValue: JSON.stringify(customFields) },
              recipientEmail: { stringValue: recipientEmail },
              createdAt: { stringValue: new Date().toISOString() },
            },
          }),
        });
      }
    } catch (dbErr) {
      console.warn('Firestore enquiry archive warning:', dbErr);
    }

    return NextResponse.json({
      success: true,
      web3forms: web3formsSuccess,
      recipient: recipientEmail,
      message: `Enquiry received! Notification routed to ${recipientEmail}`,
    });
  } catch (error: any) {
    console.error('Submit form error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
