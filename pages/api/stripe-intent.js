

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req,res) {
    
  if (req.method === 'POST') {
    try {
      const params = {
        payment_method_types: ['card'],
        currency: 'usd',
      };
      const payment_intent = await stripe.paymentIntents.create(
        params
      );

      res.status(200).json(payment_intent);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

