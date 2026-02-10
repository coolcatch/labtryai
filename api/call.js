const twilio = require('twilio');

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber } = req.body;

  // Validate phone number
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Basic phone number sanitization — allow digits, +, -, (, ), spaces
  const sanitized = phoneNumber.replace(/[^\d+\-() ]/g, '');
  if (sanitized.length < 10) {
    return res.status(400).json({ error: 'Please enter a valid phone number' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
  const voiceflowWebhook = process.env.VOICEFLOW_TWILIO_WEBHOOK;

  if (!accountSid || !authToken || !twilioNumber || !voiceflowWebhook) {
    console.error('Missing environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const client = twilio(accountSid, authToken);

    const call = await client.calls.create({
      to: sanitized,
      from: twilioNumber,
      url: voiceflowWebhook,
      method: 'POST',
    });

    return res.status(200).json({
      success: true,
      message: 'Call initiated! You will receive a call shortly.',
      callSid: call.sid,
    });
  } catch (error) {
    console.error('Twilio error:', error.message);

    if (error.code === 21211) {
      return res.status(400).json({ error: 'Invalid phone number format. Please include country code (e.g., +1).' });
    }
    if (error.code === 21214) {
      return res.status(400).json({ error: 'This phone number is not reachable.' });
    }

    return res.status(500).json({ error: 'Failed to initiate call. Please try again.' });
  }
};
