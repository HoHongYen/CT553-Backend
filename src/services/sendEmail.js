// Khởi tạo OAuth2Client với Client ID và Client Secret 
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const myOAuth2Client = new OAuth2Client(
    process.env.GOOGLE_MAILER_CLIENT_ID,
    process.env.GOOGLE_MAILER_CLIENT_SECRET
)
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN
})

class SendEmailService {
    static async sendEmail(email, subject, content) {
        if (!email || !subject || !content) throw new Error('Please provide email, subject and content!');

        const myAccessTokenObject = await myOAuth2Client.getAccessToken();
        const myAccessToken = myAccessTokenObject?.token;
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.ADMIN_EMAIL_ADDRESS,
                clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
                clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
                refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
                accessToken: myAccessToken
            }
        })

        const mailOptions = {
            to: email, // Gửi đến ai?
            subject: subject, // Tiêu đề email
            html: content // Nội dung email
        }

        await transport.sendMail(mailOptions)

        return { message: 'Email sent successfully' }
    } catch(error) {
        return { message: error.message }
    }
}

module.exports = SendEmailService;