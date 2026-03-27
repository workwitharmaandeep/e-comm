// app/login/page.js
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  if (session) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-md text-center border border-gray-100">
        <img 
          src={session.user.image} 
          alt="Profile" 
          className="w-20 h-20 rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome, {session.user.name}</h2>
        <p className="text-gray-600 mb-6">Signed in as {session.user.email}</p>
        
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-md text-center border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Login to Your Account</h2>
      <p className="text-gray-500 mb-8">Sign in to manage your cart and orders.</p>
      
      {/* Explicitly call 'google' provider and redirect to home after login */}
      <button 
        onClick={() => signIn('google', { callbackUrl: '/' })}
        className="w-full bg-gray-900 text-white font-bold py-3 px-4 rounded hover:bg-gray-800 transition flex items-center justify-center gap-2"
      >
        Sign in with Google
      </button>
    </div>
  );
}