const { Event, EventRegistration, User, sequelize, Op } = require('../models');
const QRCodeService = require('../utils/qrCode');
const WalletService = require('./walletService');

class EventService {
    static async registerForEvent({ userId, eventId, customFields = {} }) {
        const t = await sequelize.transaction();

        try {
            const event = await Event.findByPk(eventId, { transaction: t });
            if (!event) throw new Error('Etkinlik bulunamadý');

            if (event.status && event.status !== 'published') throw new Error('Bu etkinlik kayda açýk deðil');

            if (event.registration_deadline && new Date() > new Date(event.registration_deadline)) {
                throw new Error('Kayýt süresi doldu');
            }

            // Çakýþan kayýt kontrolü
            const existing = await EventRegistration.findOne({
                where: { event_id: eventId, user_id: userId, status: 'registered' },
                transaction: t
            });

            if (existing) throw new Error('Bu etkinliðe zaten kayýtlýsýnýz');

            // Kapasite kontrolü
            if (event.registered_count >= event.capacity) {
                throw new Error('Etkinlik kapasitesi doldu');
            }

            if (event.is_paid && parseFloat(event.price) > 0) {
                await WalletService.deductFunds(
                    userId,
                    event.price,
                    'event_registration',
                    eventId,
                    `Etkinlik kaydý - ${event.title}`
                );
            }

            const qrCode = await QRCodeService.generateQRCode(eventId + userId);

            const registration = await EventRegistration.create({
                event_id: eventId,
                user_id: userId,
                qr_code: qrCode,
                custom_fields: customFields,
                status: 'registered'
            }, { transaction: t });

            // Atomic artýþ
            event.registered_count += 1;
            await event.save({ transaction: t });

            await t.commit();
            return { registration, qrCode };

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async cancelRegistration(registrationId, userId) {
        const t = await sequelize.transaction();

        try {
            const registration = await EventRegistration.findOne({
                where: { id: registrationId, user_id: userId },
                include: [Event],
                transaction: t
            });

            if (!registration) throw new Error('Kayýt bulunamadý');
            if (registration.status !== 'registered') {
                throw new Error('Bu kayýt iptal edilemez');
            }

            const event = registration.Event;
            // Ýptal süresi kontrolü (Etkinliðe 24 saat kala iptal edilemez)
            const eventDateTime = new Date(`${event.date}T${event.start_time || '00:00:00'}`);
            const oneDayBefore = new Date(eventDateTime.getTime() - 24 * 60 * 60 * 1000);

            if (new Date() > oneDayBefore) {
                throw new Error('Ýptal süresi doldu (Son 24 saatte iptal yapýlamaz)');
            }

            registration.status = 'cancelled';
            await registration.save({ transaction: t });

            event.registered_count -= 1;
            await event.save({ transaction: t });

            if (event.is_paid && parseFloat(event.price) > 0) {
                await WalletService.topUp(userId, event.price); // Geri ödeme
            }

            await t.commit();
            return registration;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async checkIn(qrCode) {
        const t = await sequelize.transaction();

        try {
            const registration = await EventRegistration.findOne({
                where: { qr_code: qrCode },
                include: [
                    { model: User, as: 'user', attributes: ['id', 'full_name', 'email'] },
                    { model: Event, as: 'event' }
                ],
                transaction: t
            });

            if (!registration) throw new Error('Kayýt bulunamadý');
            if (registration.checked_in) throw new Error('Bu katýlýmcý zaten giriþ yaptý');

            registration.checked_in = true;
            registration.checked_in_at = new Date();
            registration.status = 'attended';
            await registration.save({ transaction: t });

            await t.commit();
            return registration;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

module.exports = EventService;