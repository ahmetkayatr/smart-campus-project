const { User, Student, Faculty, Department } = require('../models');
const tokenService = require('./tokenService');
const emailService = require('./emailService');

class AuthService {
  async register(userData) {
    const { email, password, full_name, role, student_number, employee_number, department_id } = userData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Bu email adresi zaten kayýtlý');
    }

    const verification_token = tokenService.generateVerificationToken();
    const verification_token_expires = tokenService.generateTokenExpiry(24);

    const user = await User.create({
      email,
      password_hash: password,
      full_name,
      role,
      verification_token,
      verification_token_expires,
      is_active: false,
      is_verified: false
    });

    if (role === 'student' && student_number && department_id) {
      await Student.create({
        user_id: user.id,
        student_number,
        department_id,
        admission_year: new Date().getFullYear()
      });
    } else if (role === 'faculty' && employee_number && department_id) {
      await Faculty.create({
        user_id: user.id,
        employee_number,
        department_id,
        title: 'Öðretim Görevlisi'
      });
    }

    await emailService.sendVerificationEmail(email, verification_token, full_name);

    return {
      message: 'Kayýt baþarýlý! Email adresinize doðrulama linki gönderildi.',
      user: user.toJSON()
    };
  }

  async verifyEmail(token) {
    const user = await User.findOne({ where: { verification_token: token } });

    if (!user) {
      throw new Error('Geçersiz doðrulama linki');
    }

    if (user.verification_token_expires < new Date()) {
      throw new Error('Doðrulama linki süresi dolmuþ');
    }

    user.is_verified = true;
    user.is_active = true;
    user.verification_token = null;
    user.verification_token_expires = null;
    await user.save();

    await emailService.sendWelcomeEmail(user.email, user.full_name);

    return { message: 'Email adresiniz baþarýyla doðrulandý!' };
  }

  async login(email, password) {
    const user = await User.findOne({
      where: { email },
      include: [
        { model: Student, as: 'student', include: [{ model: Department, as: 'department' }] },
        { model: Faculty, as: 'faculty', include: [{ model: Department, as: 'department' }] }
      ]
    });

    if (!user) {
      throw new Error('Email veya þifre hatalý');
    }

    if (!user.is_verified) {
      throw new Error('Email adresiniz henüz doðrulanmamýþ');
    }

    if (!user.is_active) {
      throw new Error('Hesabýnýz aktif deðil');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error('Email veya þifre hatalý');
    }

    user.last_login = new Date();
    await user.save();

    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);

    return {
      message: 'Giriþ baþarýlý',
      user: user.toJSON(),
      tokens: { accessToken, refreshToken }
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = tokenService.verifyRefreshToken(refreshToken);
      const user = await User.findByPk(decoded.id);
      
      if (!user || !user.is_active) {
        throw new Error('Kullanýcý bulunamadý');
      }

      const newAccessToken = tokenService.generateAccessToken(user);
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('Geçersiz refresh token');
    }
  }

  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return { message: 'Eðer bu email kayýtlýysa, þifre sýfýrlama linki gönderildi.' };
    }

    const reset_token = tokenService.generateResetToken();
    const reset_expires = tokenService.generateTokenExpiry(24);

    user.reset_password_token = reset_token;
    user.reset_password_expires = reset_expires;
    await user.save();

    await emailService.sendPasswordResetEmail(email, reset_token, user.full_name);

    return { message: 'Eðer bu email kayýtlýysa, þifre sýfýrlama linki gönderildi.' };
  }

  async resetPassword(token, newPassword) {
    const user = await User.findOne({ where: { reset_password_token: token } });

    if (!user) {
      throw new Error('Geçersiz veya süresi dolmuþ link');
    }

    if (user.reset_password_expires < new Date()) {
      throw new Error('Link süresi dolmuþ');
    }

    user.password_hash = newPassword;
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    return { message: 'Þifreniz baþarýyla güncellendi' };
  }
}

module.exports = new AuthService();