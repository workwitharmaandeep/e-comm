"use client";
import React, { createContext, useContext, useState } from 'react';

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [checkoutData, setCheckoutData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    deliveryAddress: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    orderNotes: '',
  });

  const updateCheckoutData = (section, data) => {
    setCheckoutData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  const resetCheckoutData = () => {
    setCheckoutData({
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      },
      deliveryAddress: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      orderNotes: '',
    });
  };

  return (
    <CheckoutContext.Provider value={{ checkoutData, updateCheckoutData, resetCheckoutData }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  return useContext(CheckoutContext);
}
