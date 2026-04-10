// app/login/page.js
"use client";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function LoginPage() {
  const { data: session, status } = useSession();
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("PHONE"); // "PHONE" | "OTP"   
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    // 1. Wait until NextAuth finishes loading and confirms the user is NOT logged in
    if (status !== "unauthenticated") return;

    // 2. Double-check the DOM element actually exists
    const container = document.getElementById("recaptcha-container");
    if (!container) return;

    // 3. Initialize Firebase safely
    if (typeof window !== "undefined" && auth && !window.recaptchaVerifier) {
      try {
        console.log("Initializing RecaptchaVerifier...");
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log("reCAPTCHA solved!");
          }
        });
      } catch (error) {
        console.error("Failed to initialize reCAPTCHA:", error);
      }
    }
  }, [status]); // <-- IMPORTANT: Add 'status' to the dependency array
  const requestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Ensure number has country code, e.g., +91 for India
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const appVerifier = window.recaptchaVerifier;
      
      const confirmation = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      setConfirmationResult(confirmation);
      setStep("OTP");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // 1. Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      
      // 2. Get the Firebase ID Token
      const idToken = await result.user.getIdToken();
      
      // 3. Pass token to NextAuth
      const signInResult = await signIn("credentials", {
        idToken,
        redirect: true,
        callbackUrl: '/cart'
      });

      if (signInResult?.error) {
        setError("Failed to link with NextAuth");
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
    setLoading(false);
  };

  if (status === "loading") {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  if (session) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-md text-center border border-gray-100">
        {session.user.image && (
          <img src={session.user.image} alt="Profile" className="w-20 h-20 rounded-full mx-auto mb-4" />
        )}
        <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome!</h2>
        <p className="text-gray-600 mb-6">
          Signed in as {session.user.email || session.user.phone}
        </p>
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
      
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      {step === "PHONE" ? (
        <form onSubmit={requestOTP} className="mb-6 space-y-4">
          <input
            type="tel"
            placeholder="Mobile Number (e.g., 9876543210)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#AAB8AB]"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#54677A] text-white font-bold py-3 px-4 rounded hover:bg-[#3f4d5b] transition"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOTP} className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#AAB8AB]"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded hover:bg-green-700 transition"
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </button>
        </form>
      )}

      {/* Hidden container required by Firebase for the invisible reCAPTCHA */}
      <div id="recaptcha-container"></div>

      <div className="relative flex py-5 items-center">
        <div className="grow border-t border-gray-300"></div>
        <span className="shrink-0 mx-4 text-gray-400">or</span>
        <div className="grow border-t border-gray-300"></div>
      </div>

      <button 
        onClick={() => signIn('google', { callbackUrl: '/cart' })}
        className="w-full bg-gray-900 text-white font-bold py-3 px-4 rounded hover:bg-gray-800 transition flex items-center justify-center gap-2"
      >
        Sign in with Google
      </button>
    </div>
  );
}