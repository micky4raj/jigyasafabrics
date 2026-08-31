'use client';
import { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean; onClose: () => void; onLoginSuccess: (user: any) => void }) {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length === 10) setStep('OTP');
    else alert('कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234') {
      const userData = { phone: mobile, name: `User_${mobile.slice(-4)}` };
      localStorage.setItem('user', JSON.stringify(userData));
      onLoginSuccess(userData);
      onClose();
    } else {
      alert('गलत OTP! (टेस्ट मोड के लिए "1234" का उपयोग करें)');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-sm shadow-2xl max-w-md w-full overflow-hidden flex flex-col md:flex-row">
        <div className="bg-[#2874f0] text-white p-6 md:w-2/5 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold">Login</h2>
            <p className="text-xs text-gray-200 mt-2">Get access to your Orders, Wishlist and Recommendations</p>
          </div>
          <span className="text-4xl">🛍️</span>
        </div>

        <div className="p-6 md:w-3/5 bg-white">
          {step === 'PHONE' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <input
                type="text"
                maxLength={10}
                placeholder="Enter Mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full border-b border-gray-300 py-1 text-sm focus:border-[#2874f0] focus:outline-none"
                required
              />
              <p className="text-[10px] text-gray-500">By continuing, you agree to Flipkart's Terms of Use.</p>
              <button type="submit" className="w-full bg-[#fb641b] text-white py-2.5 rounded-sm font-bold text-xs shadow">
                CONTINUE
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-xs text-gray-600">Enter OTP sent to +91 {mobile}</p>
              <input
                type="text"
                maxLength={4}
                placeholder="Enter 4-digit OTP (Use 1234)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border-b border-gray-300 py-1 text-sm focus:border-[#2874f0] focus:outline-none text-center font-bold"
                required
              />
              <button type="submit" className="w-full bg-[#fb641b] text-white py-2.5 rounded-sm font-bold text-xs shadow">
                VERIFY OTP
              </button>
            </form>
          )}
          <button onClick={onClose} className="w-full mt-3 text-xs text-gray-500 font-bold hover:underline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}