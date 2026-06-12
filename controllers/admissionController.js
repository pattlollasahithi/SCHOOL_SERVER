import { sendEmail } from '../utils/emailService.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Submit admission inquiry and send email
// @route   POST /api/admissions/submit
// @access  Public
export const submitAdmission = asyncHandler(async (req, res) => {
  const { studentName, parentName, email, phone, address, gender, grade, message } = req.body;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #333; line-height: 1.6;">
      <p>Dear Admissions Team,</p>
      <p>A new admission inquiry has been submitted through the SHRRADHA HIGH SCHOOL website.</p>
      
      <hr style="border: 0; border-top: 1px dashed #ccc; margin: 20px 0;">

      <h2 style="font-size: 16px; color: #444; margin-bottom: 15px; letter-spacing: 1px;">STUDENT INFORMATION</h2>
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px;">
        <tr>
          <td style="width: 140px; padding: 4px 0;">Name</td>
          <td style="width: 20px; padding: 4px 0;">:</td>
          <td style="padding: 4px 0; font-weight: bold;">${studentName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Parent Name</td>
          <td style="padding: 4px 0;">:</td>
          <td style="padding: 4px 0; font-weight: bold;">${parentName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Gender</td>
          <td style="padding: 4px 0;">:</td>
          <td style="padding: 4px 0; font-weight: bold; text-transform: capitalize;">${gender}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Grade Applied</td>
          <td style="padding: 4px 0;">:</td>
          <td style="padding: 4px 0; font-weight: bold; text-transform: capitalize;">${grade}</td>
        </tr>
      </table>

      <hr style="border: 0; border-top: 1px dashed #ccc; margin: 20px 0;">

      <h2 style="font-size: 16px; color: #444; margin-bottom: 15px; letter-spacing: 1px;">CONTACT DETAILS</h2>
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px;">
        <tr>
          <td style="width: 140px; padding: 4px 0;">Email</td>
          <td style="width: 20px; padding: 4px 0;">:</td>
          <td style="padding: 4px 0; font-weight: bold;">
            ${email ? `<a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>` : '<span style="color: #888;">Not provided</span>'}
          </td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">Phone</td>
          <td style="padding: 4px 0;">:</td>
          <td style="padding: 4px 0; font-weight: bold;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; vertical-align: top;">Address</td>
          <td style="padding: 4px 0; vertical-align: top;">:</td>
          <td style="padding: 4px 0; font-weight: bold; white-space: pre-wrap;">${address}</td>
        </tr>
      </table>

      <hr style="border: 0; border-top: 1px dashed #ccc; margin: 20px 0;">

      <h2 style="font-size: 16px; color: #444; margin-bottom: 15px; letter-spacing: 1px;">MESSAGE</h2>
      <p style="margin: 0 0 20px 0; white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold;">${message || 'No additional message provided.'}</p>

      <hr style="border: 0; border-top: 1px dashed #ccc; margin: 20px 0;">

      <p style="margin-top: 25px;">Kindly follow up with the applicant at the earliest.</p>
      
      <div style="margin-top: 25px;">
        <p style="margin: 0;">Regards,</p>
        <p style="margin: 0; font-weight: bold;">SHRRADHA HIGH SCHOOL System</p>
      </div>
    </div>
  `;

  await sendEmail({
    subject: `New Admission Inquiry: ${studentName}`,
    html: emailHtml
  });

  res.status(200).json({ message: "Admission inquiry sent successfully!" });
});
