const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticate } = require('../middleware/auth');

router.get('/balance', authenticate, walletController.getBalance);
router.post('/topup', authenticate, walletController.createTopUpSession);
router.get('/transactions', authenticate, walletController.getTransactions);

// Mock payment confirmation
router.post('/mock-confirm', authenticate, walletController.confirmMockPayment);

// Webhook (no auth)
router.post('/webhook', express.raw({ type: 'application/json' }), walletController.handleWebhook);

module.exports = router;