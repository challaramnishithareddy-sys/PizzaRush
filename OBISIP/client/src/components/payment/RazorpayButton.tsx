import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentApi } from '../../api/payment.api';
import { orderApi } from '../../api/order.api';
import { Button } from '../common/Button';
import { RAZORPAY_SCRIPT_URL } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayButtonProps {
  amount: number;
  orderId: string;
  onSuccess: (paymentId: string) => void;
  onFailure?: () => void;
  disabled?: boolean;
}

/** Loads the Razorpay checkout script dynamically */
const loadRazorpayScript = (): Promise<boolean> =>
  new Promise(resolve => {
    if (document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/**
 * Razorpay payment button.
 * Creates a Razorpay order, loads the checkout SDK, and handles the payment flow.
 */
export const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  amount,
  orderId,
  onSuccess,
  onFailure,
  disabled = false,
}) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      // Create Razorpay order on the backend
      const { data: res } = await paymentApi.createOrder(amount, 'INR', orderId);
      const rzpOrder = res.data!;

      // Demo mode — simulate payment without real Razorpay
      if (rzpOrder.isDemoMode) {
        toast('💡 Demo Mode: Payment simulated successfully', { icon: '🚀', className: 'custom-toast' });
        await orderApi.markPaid(orderId, `pay_demo_${Date.now()}`);
        onSuccess(`pay_demo_${Date.now()}`);
        setLoading(false);
        return;
      }

      // Open Razorpay checkout
      const razorpay = new window.Razorpay({
        key: rzpOrder.key,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'PizzaHub',
        description: 'Fresh Pizza Order',
        order_id: rzpOrder.id,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: '#e63946' },
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment signature
            await paymentApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            // Mark order as paid
            await orderApi.markPaid(orderId, response.razorpay_payment_id);
            toast.success('Payment successful! 🎉', { className: 'custom-toast' });
            onSuccess(response.razorpay_payment_id);
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled', { className: 'custom-toast' });
            onFailure?.();
            setLoading(false);
          },
        },
      });

      razorpay.open();
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment initiation failed. Please try again.');
      onFailure?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      size="lg"
      fullWidth
      loading={loading}
      disabled={disabled || loading}
      onClick={handlePay}
      leftIcon={<CreditCard size={20} />}
    >
      Pay Securely
    </Button>
  );
};
