import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();

  const handleReturn = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
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
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative text-center space-y-6">
          
          {/* Unauthorized Alert */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 shadow-md">
              <ShieldAlert className="w-8 h-8" />
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-red-400">
              403 Access Denied
            </h1>
            <p className="text-slate-400 text-xs px-2 leading-relaxed">
              You do not have the security clearance or privileges required to access this resource path.
            </p>
          </div>

          <div className="h-px bg-slate-800 w-full" />

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleReturn}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
            >
              <Home className="w-5 h-5" />
              Return Home
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 font-semibold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
