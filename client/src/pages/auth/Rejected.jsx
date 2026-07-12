import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XOctagon, LogOut, Mail } from 'lucide-react';

export default function Rejected() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
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
          
          {/* Rejection indicator */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 shadow-md">
              <XOctagon className="w-8 h-8" />
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-red-500">
              Registration Rejected
            </h1>
            <p className="text-slate-400 text-xs px-2 leading-relaxed">
              We regret to inform you that your application request has been declined by an administrator as it does not meet our verification criteria.
            </p>
          </div>

          <div className="h-px bg-slate-800 w-full" />

          {/* Info Card */}
          <div className="text-left bg-slate-950/50 rounded-2xl p-4 border border-slate-800 space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Verification Feedbacks</h4>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "Invalid department allocation or incorrect employee identification number. Please clarify details with IT/HR departments."
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <a 
              href="mailto:support@assetflow.com?subject=AssetFlow%20Registration%20Rejection%20Clarification"
              className="block w-full"
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
                Contact Administrator
              </motion.button>
            </a>

            <button
              onClick={handleLogout}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 font-semibold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
