// src/services/mealService.js
const { MealReservation, MealMenu, Wallet, User, Student } = require('../models');
const QRCodeService = require('../utils/qrCode');
const WalletService = require('./walletService');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

class MealService {
    static async createReservation({ userId, menuId, date, mealType }) {
        const t = await sequelize.transaction();

        try {
            const user = await User.findByPk(userId, {
                include: [{ model: Student }],
                transaction: t
            });

            if (!user) throw new Error('Kullanýcý bulunamadý');

            const menu = await MealMenu.findByPk(menuId, { transaction: t });
            if (!menu) throw new Error('Menü bulunamadý');

            const existing = await MealReservation.findOne({
                where: {
                    userId,
                    date,
                    mealType,
                    status: { [Op.in]: ['reserved', 'used'] }
                },
                transaction: t
            });

            if (existing) throw new Error('Bu öðün için zaten rezervasyonunuz var');

            if (user.Student?.scholarshipStatus === 'full') {
                const todayCount = await MealReservation.count({
                    where: {
                        userId,
                        date,
                        status: { [Op.in]: ['reserved', 'used'] }
                    },
                    transaction: t
                });

                if (todayCount >= 2) {
                    throw new Error('Günlük yemek kotanýz doldu (maksimum 2 öðün)');
                }
            }

            let amount = 0;
            if (!user.Student || user.Student.scholarshipStatus !== 'full') {
                amount = parseFloat(menu.price) || 25.00;

                const wallet = await Wallet.findOne({ where: { userId }, transaction: t });
                if (!wallet || parseFloat(wallet.balance) < amount) {
                    throw new Error('Yetersiz bakiye');
                }
            }

            const qrCode = QRCodeService.generateQRData();

            const reservation = await MealReservation.create({
                userId,
                menuId,
                cafeteriaId: menu.cafeteriaId,
                date,
                mealType,
                amount,
                qrCode,
                status: 'reserved'
            }, { transaction: t });

            await t.commit();

            const qrCodeImage = await QRCodeService.generateQRImage(qrCode);
            return { reservation, qrCodeImage };

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async cancelReservation(reservationId, userId) {
        const t = await sequelize.transaction();

        try {
            const reservation = await MealReservation.findOne({
                where: { id: reservationId, userId },
                transaction: t
            });

            if (!reservation) throw new Error('Rezervasyon bulunamadý');
            if (reservation.status !== 'reserved') throw new Error('Bu rezervasyon iptal edilemez');

            const mealHour = reservation.mealType === 'lunch' ? 12 : 18;
            const reservationDateTime = new Date(`${reservation.date}T${mealHour}:00:00`);
            const twoHoursBefore = new Date(reservationDateTime.getTime() - 2 * 60 * 60 * 1000);

            if (new Date() > twoHoursBefore) throw new Error('Ýptal süresi geçti');

            reservation.status = 'cancelled';
            await reservation.save({ transaction: t });

            if (parseFloat(reservation.amount) > 0) {
                await WalletService.refund(
                    userId,
                    reservation.amount,
                    'meal_reservation',
                    reservation.id,
                    'Rezervasyon iptali'
                );
            }

            await t.commit();
            return reservation;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async useMeal(qrCode) {
        const t = await sequelize.transaction();

        try {
            if (!QRCodeService.validateQRCode(qrCode)) throw new Error('Geçersiz QR kod');

            const reservation = await MealReservation.findOne({
                where: { qrCode },
                include: [
                    { model: User, attributes: ['id', 'fullName', 'email'] },
                    { model: MealMenu }
                ],
                transaction: t
            });

            if (!reservation) throw new Error('Rezervasyon bulunamadý');
            if (reservation.status === 'used') throw new Error('Zaten kullanýldý');
            if (reservation.status !== 'reserved') throw new Error('Kullanýlamaz');

            const today = new Date().toISOString().split('T')[0];
            if (reservation.date !== today) throw new Error('Bugün için deðil');

            reservation.status = 'used';
            reservation.usedAt = new Date();
            await reservation.save({ transaction: t });

            if (parseFloat(reservation.amount) > 0) {
                await WalletService.deductFunds(
                    reservation.userId,
                    reservation.amount,
                    'meal_reservation',
                    reservation.id,
                    'Yemek kullanýmý'
                );
            }

            await t.commit();
            return reservation;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

module.exports = MealService;