
import { Stripe, loadStripe } from '@stripe/stripe-js';


const getStripe = () => {
  if (!stripePromise) {
   const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export default getStripe;