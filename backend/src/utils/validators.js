const { body } = require('express-validator');

const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Geçerli bir email adresi girin')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Þifre en az 8 karakter olmalýdýr')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Þifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'),

    body('full_name')
        .notEmpty()
        .withMessage('Ad soyad zorunludur')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Ad soyad en az 2 karakter olmalýdýr'),

    body('role')
        .isIn(['student', 'faculty', 'admin', 'staff'])
        .withMessage('Geçersiz rol'),

    body('student_number')
        .if(body('role').equals('student'))
        .notEmpty()
        .withMessage('Öðrenci numarasý zorunludur'),

    body('employee_number')
        .if(body('role').equals('faculty'))
        .notEmpty()
        .withMessage('Personel numarasý zorunludur'),

    body('department_id')
        .if(body('role').isIn(['student', 'faculty']))
        .notEmpty()
        .withMessage('Bölüm seçimi zorunludur')
        .isUUID()
        .withMessage('Geçerli bir bölüm ID\'si girin')
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Geçerli bir email adresi girin')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Þifre zorunludur')
];

const forgotPasswordValidation = [
    body('email')
        .isEmail()
        .withMessage('Geçerli bir email adresi girin')
        .normalizeEmail()
];

const resetPasswordValidation = [
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('Yeni þifre en az 8 karakter olmalýdýr')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Þifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir')
];

const updateProfileValidation = [
    body('full_name')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Ad soyad en az 2 karakter olmalýdýr'),

    body('phone')
        .optional()
        .matches(/^[0-9]{10}$/)
        .withMessage('Geçerli bir telefon numarasý girin (10 haneli)')
];

module.exports = {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    updateProfileValidation
};