const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Email gönderimi şimdilik console'a log olarak yazılacak
        // Gerçek email göndermek için Gmail App Password gerekli
        this.transporter = null;

        try {
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: process.env.EMAIL_PORT || 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
        } catch (error) {
            console.log('⚠️  Email service not configured. Emails will be logged to console.');
        }
    }

    async sendVerificationEmail(email, token, userName) {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

        // Eğer transporter yoksa, sadece console'a yaz
        if (!this.transporter || !process.env.EMAIL_USER) {
            console.log('📧 [EMAIL SIMULATION] Verification Email');
            console.log(`   To: ${email}`);
            console.log(`   Subject: Email Doğrulama - Smart Campus`);
            console.log(`   Verification URL: ${verificationUrl}`);
            console.log(`   User: ${userName}`);
            return true;
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'Smart Campus <noreply@smartcampus.edu>',
            to: email,
            subject: 'Email Doğrulama - Smart Campus',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Hoş Geldiniz, ${userName}!</h2>
          <p>Smart Campus hesabınızı oluşturduğunuz için teşekkür ederiz.</p>
          <p>Email adresinizi doğrulamak için aşağıdaki butona tıklayın:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #2563eb; 
                    color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Email Adresini Doğrula
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Bu link 24 saat geçerlidir.
          </p>
        </div>
      `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Verification email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Email sending error:', error.message);
            console.log(`📧 Verification URL: ${verificationUrl}`);
            return false;
        }
    }

    async sendPasswordResetEmail(email, token, userName) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        if (!this.transporter || !process.env.EMAIL_USER) {
            console.log('📧 [EMAIL SIMULATION] Password Reset Email');
            console.log(`   To: ${email}`);
            console.log(`   Reset URL: ${resetUrl}`);
            return true;
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'Smart Campus <noreply@smartcampus.edu>',
            to: email,
            subject: 'Şifre Sıfırlama - Smart Campus',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Şifre Sıfırlama Talebi</h2>
          <p>Merhaba ${userName},</p>
          <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #dc2626; 
                    color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Şifremi Sıfırla
          </a>
        </div>
      `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Password reset email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Email sending error:', error.message);
            console.log(`📧 Reset URL: ${resetUrl}`);
            return false;
        }
    }

    async sendWelcomeEmail(email, userName) {
        if (!this.transporter || !process.env.EMAIL_USER) {
            console.log('📧 [EMAIL SIMULATION] Welcome Email');
            console.log(`   To: ${email}`);
            console.log(`   User: ${userName}`);
            return true;
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'Smart Campus <noreply@smartcampus.edu>',
            to: email,
            subject: 'Hesabınız Aktifleştirildi - Smart Campus',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Hesabınız Başarıyla Aktifleştirildi! 🎉</h2>
          <p>Merhaba ${userName},</p>
          <p>Email adresiniz doğrulandı ve hesabınız aktif hale getirildi.</p>
        </div>
      `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Welcome email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Email sending error:', error.message);
            return false;
        }
    }
}

module.exports = new EmailService();