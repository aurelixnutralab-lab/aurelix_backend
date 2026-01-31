module.exports = {
    // Port for the Express server
    port: 3000,

    // SMTP Configuration (Update with your actual credentials)
    smtp: {
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "info@aurelixnutralab.com",
            pass: "Aurelix@info123"
        }
    },

    // Destination email address where contact messages will be sent
    toEmail: "info@aurelixnutralab.com"
};
