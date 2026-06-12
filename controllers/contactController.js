import nodemailer from 'nodemailer';

export const submitContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials not configured.");
      return res.status(200).json({ message: "Message received (Email Mocked)" });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Shrradha High School" <${process.env.EMAIL_USER}>`,
      to: 'pattlollasahithi@gmail.com',
      subject: `New Contact Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #333; line-height: 1.6;">
          <p>Dear Admin,</p>
          <p>A new message has been submitted through the SHRRADHA HIGH SCHOOL website contact form.</p>

          <hr style="border: 0; border-top: 1px dashed #ccc; margin: 20px 0;">

          <h2 style="font-size: 16px; color: #444; margin-bottom: 15px; letter-spacing: 1px;">SENDER DETAILS</h2>
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px;">
            <tr>
              <td style="width: 140px; padding: 4px 0;">Name</td>
              <td style="width: 20px; padding: 4px 0;">:</td>
              <td style="padding: 4px 0; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;">Email</td>
              <td style="padding: 4px 0;">:</td>
              <td style="padding: 4px 0; font-weight: bold;">
                <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 0;">Subject</td>
              <td style="padding: 4px 0;">:</td>
              <td style="padding: 4px 0; font-weight: bold;">${subject}</td>
            </tr>
          </table>

          <hr style="border: 0; border-top: 1px dashed #ccc; margin: 20px 0;">

          <h2 style="font-size: 16px; color: #444; margin-bottom: 15px; letter-spacing: 1px;">MESSAGE</h2>
          <p style="margin: 0 0 20px 0; white-space: pre-wrap; font-size: 14px; font-weight: bold;">${message}</p>

          <hr style="border: 0; border-top: 1px dashed #ccc; margin: 20px 0;">

          <p>Kindly reply to the sender at the earliest.</p>

          <div style="margin-top: 25px;">
            <p style="margin: 0;">Regards,</p>
            <p style="margin: 0; font-weight: bold;">SHRRADHA HIGH SCHOOL System</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully!" });

  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ message: "Failed to send message. Please try again later." });
  }
};
