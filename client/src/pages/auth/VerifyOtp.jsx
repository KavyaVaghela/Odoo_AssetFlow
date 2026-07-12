import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Session context lost. Try again.');
      return;
    }
    if (!otp.trim()) {
      setError('Please input the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/admin/auth/verify-otp', { email, otp });
      if (res.data.success) {
        navigate('/reset-password', { state: { email, otp } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 relative font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md px-6 z-10"
      >
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
          
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight">Verify Security Code</h1>
            <p className="text-slate-400 text-xs">
              We sent a 6-digit numeric OTP verification code to <span className="text-blue-400 font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Verification Code (OTP)
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-center tracking-[0.5rem] font-bold text-xl placeholder:text-slate-800 placeholder:tracking-normal focus:outline-none transition-all duration-200"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Verify Code
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <button 
              onClick={() => navigate('/login')}
              className="text-slate-400 hover:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Back to Login
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
