
const nodemailer = require('nodemailer');

const sendOTP = {
  email: async (email, otp) => {
    try {
      console.log(`Sending OTP ${otp} to email: ${email}`);

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'YouTube Clone - OTP Verification',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ff0000;">YouTube Clone - OTP Verification</h2>
              <p>Your OTP verification code is:</p>
              <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #ff0000;">
                ${otp}
              </div>
              <p>This code will expire in 10 minutes.</p>
            </div>
          `
        });
      }

      return true;
    } catch (error) {
      console.error('Email OTP send error:', error);
      return true;
    }
  },

  sms: async (phone, otp) => {
    try {
      console.log(`Sending OTP ${otp} to phone: ${phone}`);

      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        const twilio = require('twilio');
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        await client.messages.create({
          body: `Your YouTube Clone verification code is: ${otp}. This code will expire in 10 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone
        });
      }

      return true;
    } catch (error) {
      console.error('SMS OTP send error:', error);
      return true;
    }
  }
};

module.exports = { sendOTP };
