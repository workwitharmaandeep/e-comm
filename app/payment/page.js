'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/shared/CartContext';
import { useCheckout } from '@/app/shared/CheckoutContext';
import Link from 'next/link';

export default function PaymentPage() {
  const router = useRouter();
  const { cart } = useCart();
  const { checkoutData } = useCheckout();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Card details state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  // Calculate total
const totalPrice = cart.reduce((sum, item) => sum + (Number(item.base_price) || 0), 0);  useEffect(() => {
    // Redirect to checkout if no checkout data
    if (!checkoutData.personalInfo.email) {
      router.push('/checkout');
    }
  }, [checkoutData, router]);

  const validateCardDetails = () => {
    if (paymentMethod !== 'card') return true;

    if (!cardDetails.cardNumber.replace(/\s/g, '')) {
      setError('Card number is required');
      return false;
    }
    if (!cardDetails.cardHolder.trim()) {
      setError('Card holder name is required');
      return false;
    }
    if (!cardDetails.expiryMonth || !cardDetails.expiryYear) {
      setError('Card expiry is required');
      return false;
    }
    if (!cardDetails.cvv) {
      setError('CVV is required');
      return false;
    }

    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateCardDetails()) {
      return;
    }

    setLoading(true);

    try {
      // Create order in database
      const orderData = {
        personalInfo: checkoutData.personalInfo,
        deliveryAddress: checkoutData.deliveryAddress,
        orderNotes: checkoutData.orderNotes,
        cartItems: cart,
        totalAmount: totalPrice,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'pending',
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      setOrderPlaced(true);

      // Redirect to order confirmation after 3 seconds
      setTimeout(() => {
        router.push(`/order-confirmation/${data.orderId}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-lg mb-4">Redirecting to order confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Payment</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePayment} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <p className="font-semibold">
                  {checkoutData.personalInfo.firstName}{' '}
                  {checkoutData.personalInfo.lastName}
                </p>
                <p className="text-gray-600">
                  {checkoutData.deliveryAddress.address}
                </p>
                <p className="text-gray-600">
                  {checkoutData.deliveryAddress.city},{' '}
                  {checkoutData.deliveryAddress.state}{' '}
                  {checkoutData.deliveryAddress.zipCode}
                </p>
                <p className="text-gray-600">
                  {checkoutData.deliveryAddress.country}
                </p>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer" style={{borderColor: paymentMethod === 'card' ? '#3b82f6' : '#d1d5db'}}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="font-semibold">Credit/Debit Card</span>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer" style={{borderColor: paymentMethod === 'upi' ? '#3b82f6' : '#d1d5db'}}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="font-semibold">UPI</span>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer" style={{borderColor: paymentMethod === 'netbanking' ? '#3b82f6' : '#d1d5db'}}>
                  <input
                    type="radio"
                    name="payment"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="font-semibold">Net Banking</span>
                </label>
              </div>
            </div>

            {/* Card Details (Only show if card selected) */}
            {paymentMethod === 'card' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-6">Card Details</h2>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '');
                      if (/^\d*$/.test(value) && value.length <= 16) {
                        const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                        setCardDetails({
                          ...cardDetails,
                          cardNumber: formatted,
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Card Holder Name *
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardDetails.cardHolder}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        cardHolder: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Expiry Month *
                    </label>
                    <select
                      value={cardDetails.expiryMonth}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          expiryMonth: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select Month</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                        <option key={m} value={m}>
                          {String(m).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Expiry Year *
                    </label>
                    <select
                      value={cardDetails.expiryYear}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          expiryYear: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select Year</option>
                      {[2026, 2027, 2028, 2029, 2030].map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    CVV *
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) && value.length <= 3) {
                        setCardDetails({
                          ...cardDetails,
                          cvv: value,
                        });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                    maxLength="3"
                  />
                </div>
              </div>
            )}

            {/* UPI Payment */}
            {paymentMethod === 'upi' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-6">UPI Payment</h2>
                <p className="text-gray-600 mb-4">
                  Enter your UPI ID to proceed with payment
                </p>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Link
                href="/checkout"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50"
              >
                Back
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-lg"
              >
                {loading ? 'Processing Payment...' : 'Complete Payment'}
              </button>
            </div>
          </form>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-8">
            <h3 className="text-2xl font-bold mb-6">Payment Summary</h3>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between pb-4 border-b">
                  <div>
                    <p className="font-semibold text-sm">{item.Name}</p>
                    <p className="text-xs text-gray-600">Qty: 1</p>
                  </div>
<p className="font-bold">₹{(Number(item.base_price) || 0).toFixed(2)}</p>              </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2 text-sm">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b text-sm">
                <span>Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-blue-600">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
