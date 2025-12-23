const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  // Ödeme oturumu oluþtur
  static async createPaymentSession({ userId, amount, description, metadata }) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'try',
            product_data: {
              name: 'Cüzdan Yükleme',
              description: description
            },
            unit_amount: Math.round(amount * 100) // Stripe kuruþ cinsinden
          },
          quantity: 1
        }],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/wallet/topup/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/wallet/topup/cancel`,
        metadata: {
          userId,
          ...metadata
        }
      });

      return {
        sessionId: session.id,
        url: session.url
      };
    } catch (error) {
      throw new Error('Ödeme oturumu oluþturulamadý: ' + error.message);
    }
  }

  // Webhook imza doðrulama
  static verifyWebhookSignature(payload, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      return event;
    } catch (error) {
      throw new Error('Webhook imzasý doðrulanamadý: ' + error.message);
    }
  }

  // Ödeme durumu sorgula
  static async getPaymentSession(sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      throw new Error('Ödeme bilgisi alýnamadý: ' + error.message);
    }
  }
}

module.exports = PaymentService;