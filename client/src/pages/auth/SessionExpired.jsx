import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, LogIn } from 'lucide-react';

export default function SessionExpired() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 relative font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-6 z-10"
      >
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative text-center space-y-6">
          
          {/* Timeout visual */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-orange-500 shadow-md">
              <Clock className="w-8 h-8" />
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-orange-400">
              Session Expired
            </h1>
            <p className="text-slate-400 text-xs px-2 leading-relaxed">
              For security, your active authentication session has expired due to inactivity. Please sign in again to resume managing your assets and resources.
            </p>
          </div>

          <div className="h-px bg-slate-800 w-full" />

          {/* Button */}
          <div className="space-y-3">
            <button
              onClick={handleLoginRedirect}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
            >
              <LogIn className="w-5 h-5" />
              Login Again
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
