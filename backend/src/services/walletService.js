const { Wallet, Transaction, sequelize } = require('../models');


const deductBalance = async (userId, amount, t) => {
    const wallet = await Wallet.findOne({ where: { userId }, transaction: t });
    if (!wallet) throw new Error('Cüzdan bulunamadý');

    if (wallet.isScholarship) {
        // Burslu ise para düþme, sadece günlük kota kontrolü baþka serviste yapýlacak
        return wallet;
    }

    const currentBalance = parseFloat(wallet.balance);
    if (currentBalance < amount) throw new Error('Yetersiz bakiye');

    wallet.balance = currentBalance - parseFloat(amount);
    return await wallet.save({ transaction: t });
};

module.exports = { deductBalance };