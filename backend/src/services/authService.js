const { User, Student, Faculty, Department, sequelize } = require('../models');
const tokenService = require('./tokenService');
const emailService = require('./emailService');

class AuthService {
    async register(userData) {
        const { email, password, full_name, role, student_number, employee_number, department_id } = userData;

        // Transaction başlat (tüm işlemler başarılı olmalı)
        const transaction = await sequelize.transaction();

        try {
            // Email kontrolü
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('Bu email adresi zaten kayıtlı');
            }

            // Verification token oluştur
            const verification_token = tokenService.generateVerificationToken();
            const verification_token_expires = tokenService.generateTokenExpiry(24);

            // User oluştur
            const user = await User.create({
                email,
                password_hash: password,
                full_name,
                role,
                verification_token,
                verification_token_expires,
                is_active: false,
                is_verified: false
            }, { transaction });

            console.log('✅ User created:', user.id, user.email, user.role);

            // Role'e göre Student veya Faculty kaydı oluştur
            if (role === 'student') {
                if (!student_number) {
                    throw new Error('Öğrenci numarası zorunludur');
                }
                if (!department_id) {
                    throw new Error('Bölüm seçimi zorunludur');
                }

                const student = await Student.create({
                    user_id: user.id,
                    student_number,
                    department_id,
                    admission_year: new Date().getFullYear()
                }, { transaction });

                console.log('✅ Student created:', student.id, student.student_number);
            } else if (role === 'faculty') {
                if (!employee_number) {
                    throw new Error('Personel numarası zorunludur');
                }
                if (!department_id) {
                    throw new Error('Bölüm seçimi zorunludur');
                }

                const faculty = await Faculty.create({
                    user_id: user.id,
                    employee_number,
                    department_id,
                    title: 'Öğretim Görevlisi'
                }, { transaction });

                console.log('✅ Faculty created:', faculty.id, faculty.employee_number);
            }

            // Transaction'ı onayla
            await transaction.commit();
            console.log('✅ Transaction committed successfully');

            // Email gönder (transaction dışında)
            await emailService.sendVerificationEmail(email, verification_token, full_name);

            return {
                message: 'Kayıt başarılı! Email adresinize doğrulama linki gönderildi.',
                user: user.toJSON()
            };
        } catch (error) {
            // Hata olursa tüm işlemleri geri al
            await transaction.rollback();
            console.error('❌ Registration error:', error.message);
            throw error;
        }
    }

    async verifyEmail(token) {
        const user = await User.findOne({ where: { verification_token: token } });

        if (!user) {
            throw new Error('Geçersiz doğrulama linki');
        }

        if (user.verification_token_expires < new Date()) {
            throw new Error('Doğrulama linki süresi dolmuş');
        }

        user.is_verified = true;
        user.is_active = true;
        user.verification_token = null;
        user.verification_token_expires = null;
        await user.save();

        await emailService.sendWelcomeEmail(user.email, user.full_name);

        return { message: 'Email adresiniz başarıyla doğrulandı!' };
    }

    async login(email, password) {
        // Kullanıcıyı ve ilişkili tabloları çek
        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: Student,
                    as: 'student',
                    required: false,
                    include: [{ model: Department, as: 'department' }]
                },
                {
                    model: Faculty,
                    as: 'faculty',
                    required: false,
                    include: [{ model: Department, as: 'department' }]
                }
            ]
        });

        // Debug log
        console.log('='.repeat(50));
        console.log(`🔐 LOGIN ATTEMPT: ${email}`);

        if (!user) {
            console.log('❌ User not found');
            console.log('='.repeat(50));
            throw new Error('Email veya şifre hatalı');
        }

        console.log('✅ User found:', user.id);
        console.log('📌 Role:', user.role);
        console.log('✅ Is Active:', user.is_active);
        console.log('✅ Is Verified:', user.is_verified);

        // Role kontrolü
        if (user.role === 'student') {
            if (!user.student) {
                console.log('❌ CRITICAL: Student record NOT FOUND!');
                console.log('🔧 Solution: Run SQL to create student record');
                console.log('='.repeat(50));
                throw new Error('Student is not associated to User!');
            }
            console.log('✅ Student record found:', user.student.student_number);
            console.log('✅ Department:', user.student.department?.name || 'N/A');
        } else if (user.role === 'faculty') {
            if (!user.faculty) {
                console.log('❌ CRITICAL: Faculty record NOT FOUND!');
                console.log('='.repeat(50));
                throw new Error('Faculty is not associated to User!');
            }
            console.log('✅ Faculty record found:', user.faculty.employee_number);
        }

        console.log('='.repeat(50));

        // Email doğrulama kontrolü
        if (!user.is_verified) {
            throw new Error('Email adresiniz henüz doğrulanmamış');
        }

        // Aktiflik kontrolü
        if (!user.is_active) {
            throw new Error('Hesabınız aktif değil');
        }

        // Şifre kontrolü
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error('Email veya şifre hatalı');
        }

        // Son giriş zamanını güncelle
        user.last_login = new Date();
        await user.save();

        // Token'ları oluştur
        const accessToken = tokenService.generateAccessToken(user);
        const refreshToken = tokenService.generateRefreshToken(user);

        return {
            message: 'Giriş başarılı',
            user: user.toJSON(),
            tokens: { accessToken, refreshToken }
        };
    }

    async refreshToken(refreshToken) {
        try {
            const decoded = tokenService.verifyRefreshToken(refreshToken);
            const user = await User.findByPk(decoded.id);

            if (!user || !user.is_active) {
                throw new Error('Kullanıcı bulunamadı');
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
            return { message: 'Eğer bu email kayıtlıysa, şifre sıfırlama linki gönderildi.' };
        }

        const reset_token = tokenService.generateResetToken();
        const reset_expires = tokenService.generateTokenExpiry(24);

        user.reset_password_token = reset_token;
        user.reset_password_expires = reset_expires;
        await user.save();

        await emailService.sendPasswordResetEmail(email, reset_token, user.full_name);

        return { message: 'Eğer bu email kayıtlıysa, şifre sıfırlama linki gönderildi.' };
    }

    async resetPassword(token, newPassword) {
        const user = await User.findOne({ where: { reset_password_token: token } });

        if (!user) {
            throw new Error('Geçersiz veya süresi dolmuş link');
        }

        if (user.reset_password_expires < new Date()) {
            throw new Error('Link süresi dolmuş');
        }

        user.password_hash = newPassword;
        user.reset_password_token = null;
        user.reset_password_expires = null;
        await user.save();

        return { message: 'Şifreniz başarıyla güncellendi' };
    }
}

module.exports = new AuthService();