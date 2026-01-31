const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const config = require('./config');

const app = express();
const port = config.port || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://aurelixnutralab.com'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required (name, email, subject, message).' });
    }

    try {
        // Create transporter
        const transporter = nodemailer.createTransport(config.smtp);

        // Setup email data
        const mailOptions = {
            from: `"${name}" <${email}>`, // This shows in your inbox
            replyTo: email,               // The user's email for replies
            to: config.toEmail,            // list of receivers
            subject: `Contact Inquiry: ${subject}`, // Subject line
            // The envelope is used for the actual SMTP delivery
            envelope: {
                from: config.smtp.auth.user,
                to: config.toEmail
            },
            text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`, // plain text fallback
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    /* Reset & Base Styles */
                    body { margin: 0; padding: 0; background-color: #f7f9f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
                    table { border-spacing: 0; width: 100%; }
                    td { padding: 0; }
                    img { border: 0; }

                    /* Container */
                    .wrapper { width: 100%; table-layout: fixed; background-color: #f7f9f7; padding-bottom: 60px; }
                    .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #333333; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(29, 58, 36, 0.05); }

                    /* Header Area */
                    .header { background: linear-gradient(135deg, #1d3a24 0%, #2e5a39 100%); padding: 45px 30px; text-align: center; }
                    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; }
                    .header p { color: #d1ddd4; margin: 10px 0 0; font-size: 13px; letter-spacing: 1px; }

                    /* Content Area */
                    .content { padding: 40px 50px; }
                    .content h2 { color: #1d3a24; font-size: 22px; font-weight: 600; margin-top: 0; margin-bottom: 25px; text-align: center; }
                    
                    /* Data Table */
                    .data-section { background-color: #fcfdfc; border-radius: 8px; padding: 25px; margin-bottom: 30px; border: 1px solid #edf2ee; }
                    .data-row { margin-bottom: 15px; border-bottom: 1px solid #f0f4f1; padding-bottom: 10px; }
                    .data-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
                    .label { font-size: 11px; font-weight: 700; color: #889c8e; text-transform: uppercase; letter-spacing: 1.2px; display: block; margin-bottom: 4px; }
                    .value { font-size: 16px; color: #1d3a24; font-weight: 500; display: block; }

                    /* Message Box */
                    .message-title { font-size: 14px; font-weight: 600; color: #1d3a24; margin-bottom: 12px; display: block; }
                    .message-content { background-color: #f0f4f1; border-radius: 8px; padding: 25px; font-size: 15px; color: #444444; line-height: 1.8; border-left: 5px solid #2e5a39; }

                    /* Footer Area */
                    .footer { text-align: center; padding: 30px; font-size: 12px; color: #999999; line-height: 1.8; }
                    .footer a { color: #1d3a24; text-decoration: none; font-weight: 600; }
                    .divider { height: 1px; background-color: #e0e0e0; margin: 0 50px; }
                </style>
            </head>
            <body>
                <center class="wrapper">
                    <table class="main">
                        <tr>
                            <td class="header">
                                <h1>AURELIX</h1>
                                <p>NUTRA LAB · QUALITY & WELLNESS</p>
                            </td>
                        </tr>
                        <tr>
                            <td class="content">
                                <h2>Inquiry Details</h2>
                                
                                <div class="data-section">
                                    <div class="data-row">
                                        <span class="label">From Full Name</span>
                                        <span class="value">${name}</span>
                                    </div>
                                    <div class="data-row">
                                        <span class="label">Email Address</span>
                                        <span class="value">${email}</span>
                                    </div>
                                    <div class="data-row">
                                        <span class="label">Inquiry Subject</span>
                                        <span class="value">${subject}</span>
                                    </div>
                                </div>

                                <span class="message-title">Correspondence Content</span>
                                <div class="message-content">
                                    ${message.replace(/\n/g, '<br>')}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="divider"></div>
                            </td>
                        </tr>
                        <tr>
                            <td class="footer">
                                <p>
                                    This is an automated notification from your website's contact system.<br>
                                    Aurelix Nutra Lab | Ahmedabad, Gujarat, India<br>
                                    <a href="https://aurelixnutralab.com">aurelixnutralab.com</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </center>
            </body>
            </html>
            ` // html body
        };

        // Send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);

        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ success: 'Email sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email. Check SMTP configuration.' });
    }
});

app.get('/health', (req, res) => {
    res.status(200).send('Service is up and running');
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
