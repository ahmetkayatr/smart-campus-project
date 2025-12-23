const { Wallet, Transaction } = require('../models');
const WalletService = require('../services/walletService'); // ✅ FIX: Direct import

// Check if using real Stripe or mock
const USE_REAL_STRIPE = process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_SECRET_KEY.startsWith('sk_');

let stripe;
if (USE_REAL_STRIPE) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

const getBalance = async (req, res) => {
    try {
        const userId = req.user.id;
        const balance = await WalletService.getBalance(userId);
        res.json({ success: true, data: balance });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const createTopUpSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount } = req.body;

        if (!amount || amount < 10) {
            return res.status(400).json({
                success: false,
                error: 'Minimum yükleme tutarı 10 TRY'
            });
        }

        if (USE_REAL_STRIPE) {
            // Real Stripe
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'try',
                        product_data: {
                            name: 'Cüzdan Yükleme',
                            description: `${amount} TRY yükleme`
                        },
                        unit_amount: Math.round(amount * 100)
                    },
                    quantity: 1
                }],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/wallet/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/wallet/cancel`,
                metadata: {
                    userId,
                    amount: amount.toString()
                }
            });

            res.json({
                success: true,
                data: {
                    url: session.url,
                    sessionId: session.id
                }
            });
        } else {
            // Mock Payment (Test Mode)
            const mockSessionId = `mock_${Date.now()}_${userId}`;
            const mockUrl = `${process.env.FRONTEND_URL}/wallet/mock-payment?session_id=${mockSessionId}&amount=${amount}&user_id=${userId}`;

            res.json({
                success: true,
                data: {
                    url: mockUrl,
                    sessionId: mockSessionId,
                    mock: true
                }
            });
        }
    } catch (error) {
        console.error('Top-up error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const handleWebhook = async (req, res) => {
    try {
        if (USE_REAL_STRIPE) {
            const sig = req.headers['stripe-signature'];

            let event;
            try {
                event = stripe.webhooks.constructEvent(
                    req.body,
                    sig,
                    process.env.STRIPE_WEBHOOK_SECRET
                );
            } catch (err) {
                console.error('Webhook signature verification failed:', err.message);
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                const { userId, amount } = session.metadata;

                await WalletService.addFunds(userId, parseFloat(amount), {
                    stripeSessionId: session.id,
                    paymentIntentId: session.payment_intent
                });
            }
        } else {
            // Mock webhook - for testing
            const { userId, amount } = req.body;

            if (userId && amount) {
                await WalletService.addFunds(userId, parseFloat(amount), {
                    mockPayment: true,
                    timestamp: new Date().toISOString()
                });
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

const getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;

        const result = await WalletService.getTransactions(userId, {
            page: parseInt(page),
            limit: parseInt(limit)
        });

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Mock payment confirmation (for testing without Stripe)
const confirmMockPayment = async (req, res) => {
    try {
        const { sessionId, userId, amount } = req.body;

        if (!USE_REAL_STRIPE) {
            await WalletService.addFunds(userId, parseFloat(amount), {
                mockSessionId: sessionId,
                mockPayment: true,
                timestamp: new Date().toISOString()
            });

            res.json({
                success: true,
                message: 'Mock ödeme başarılı (Test mode)'
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Bu endpoint sadece test modunda kullanılabilir'
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getBalance,
    createTopUpSession,
    handleWebhook,
    getTransactions,
    confirmMockPayment
};