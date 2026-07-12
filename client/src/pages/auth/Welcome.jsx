import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, LogIn, UserPlus, KeyRound } from 'lucide-react';

export default function Welcome() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 overflow-hidden relative font-sans">
      {/* Decorative background grid and glowing orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md px-6 z-10"
      >
        <div className="text-center space-y-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
          
          {/* Logo */}
          <div className="flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-extrabold text-2xl shadow-lg shadow-blue-500/20"
            >
              AF
            </motion.div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              AssetFlow
            </h1>
            <p className="text-slate-400 text-sm">
              Enterprise Asset & Resource Management System
            </p>
          </div>

          <div className="h-px bg-slate-800 w-full my-6" />

          {/* Buttons Stack */}
          <div className="space-y-4">
            <Link to="/login" className="block w-full">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </motion.button>
            </Link>

            <Link to="/signup" className="block w-full">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 font-semibold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
              >
                <UserPlus className="w-5 h-5" />
                Create Account
              </motion.button>
            </Link>

            <Link to="/forgot-password" className="block w-full">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-4 rounded-2xl bg-transparent hover:bg-slate-900/40 border border-dashed border-slate-800 hover:border-slate-700 font-semibold text-slate-400 hover:text-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
              >
                <KeyRound className="w-5 h-5" />
                Forgot Password
              </motion.button>
            </Link>
          </div>

          {/* Footer Security Seal */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mt-6">
            <ShieldCheck className="w-4 h-4 text-blue-500/80" />
            <span>Secure 256-bit SSL Session</span>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
