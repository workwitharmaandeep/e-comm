// app/shared/Sessionwrap.js
"use client";
import React from 'react';
import { SessionProvider } from 'next-auth/react';

export default function Sessionwrap({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}