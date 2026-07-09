export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ message: 'Mobile number and OTP are required.' });
  }

  // MOCK IMPLEMENTATION:
  // Here you would verify the OTP via your chosen provider.
  // For the mock, we accept '1234' as the valid OTP.
  if (otp === '1234') {
    return res.status(200).json({ 
      success: true, 
      message: 'OTP verified successfully.' 
    });
  } else {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid OTP. Please try again. (Hint: Use 1234 for testing)' 
    });
  }
}
