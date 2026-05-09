'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/shared/CartContext';
import { useCheckout } from '@/app/shared/CheckoutContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart();
  const { checkoutData, updateCheckoutData } = useCheckout();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Calculate total price
const totalPrice = cart.reduce((sum, item) => sum + (Number(item.base_price) || 0), 0);  const validateForm = () => {
    const newErrors = {};

    if (!checkoutData.personalInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!checkoutData.personalInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!checkoutData.personalInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutData.personalInfo.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!checkoutData.personalInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!checkoutData.deliveryAddress.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!checkoutData.deliveryAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!checkoutData.deliveryAddress.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!checkoutData.deliveryAddress.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    }
    if (!checkoutData.deliveryAddress.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      setErrors({ cart: 'Your cart is empty' });
      return;
    }

    setLoading(true);

    try {
      // Proceed to payment page
      router.push('/payment');
    } catch (error) {
      setErrors({ submit: 'Error proceeding to payment' });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
          <p className="font-semibold">Your cart is empty</p>
          <Link href="/" className="text-yellow-900 hover:text-yellow-700 underline">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {errors.submit && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={checkoutData.personalInfo.firstName}
                    onChange={(e) =>
                      updateCheckoutData('personalInfo', {
                        firstName: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={checkoutData.personalInfo.lastName}
                    onChange={(e) =>
                      updateCheckoutData('personalInfo', {
                        lastName: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={checkoutData.personalInfo.email}
                    onChange={(e) =>
                      updateCheckoutData('personalInfo', {
                        email: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={checkoutData.personalInfo.phone}
                    onChange={(e) =>
                      updateCheckoutData('personalInfo', {
                        phone: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  value={checkoutData.deliveryAddress.address}
                  onChange={(e) =>
                    updateCheckoutData('deliveryAddress', {
                      address: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={checkoutData.deliveryAddress.city}
                    onChange={(e) =>
                      updateCheckoutData('deliveryAddress', {
                        city: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={checkoutData.deliveryAddress.state}
                    onChange={(e) =>
                      updateCheckoutData('deliveryAddress', {
                        state: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="NY"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    value={checkoutData.deliveryAddress.zipCode}
                    onChange={(e) =>
                      updateCheckoutData('deliveryAddress', {
                        zipCode: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      errors.zipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10001"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={checkoutData.deliveryAddress.country}
                    onChange={(e) =>
                      updateCheckoutData('deliveryAddress', {
                        country: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="United States"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Order Notes</h2>
              <textarea
                value={checkoutData.orderNotes}
                onChange={(e) =>
                  updateCheckoutData('', { orderNotes: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Add any special instructions for your order..."
                rows="4"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Link
                href="/cart"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50"
              >
                Back to Cart
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-8">
            <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-start pb-4 border-b">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: 1</p>
                  </div>
<p className="font-bold">₹{(Number(item.base_price) || 0).toFixed(2)}</p>         </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b">
                <span>Shipping</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
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
