export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, mobile } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ message: 'Name and mobile number are required.' });
  }

  // MOCK IMPLEMENTATION:
  // In a real scenario, you would integrate with Twilio or Meta WhatsApp API here.
  // Example: 
  // await twilioClient.messages.create({
  //   body: `Your OTP for download is 1234`,
  //   from: 'whatsapp:+14155238886',
  //   to: `whatsapp:${mobile}`
  // });

  console.log(`[MOCK] Sending WhatsApp OTP to ${mobile} for user ${name}`);
  
  // For demo purposes, we'll pretend the OTP is always sent successfully 
  // and the expected OTP is '1234'.
  
  return res.status(200).json({ 
    success: true, 
    message: 'OTP sent successfully to WhatsApp. (Mock: Use 1234)' 
  });
}
