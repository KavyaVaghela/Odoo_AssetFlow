import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CheckSquare, LogOut, ArrowRight, UserCheck } from 'lucide-react';

export default function PendingApproval() {
  const navigate = useNavigate();
  const registrationDate = localStorage.getItem('reg_date') 
    ? new Date(localStorage.getItem('reg_date')).toLocaleDateString()
    : new Date().toLocaleDateString();

  const handleLogout = () => {
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
          
          {/* Visual Indicator */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 shadow-md">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-amber-400">
              Waiting for Admin Approval
            </h1>
            <p className="text-slate-400 text-xs px-2 leading-relaxed">
              Your account has been successfully registered and is currently pending administrator activation. You will receive an email notification once your profile is verified.
            </p>
          </div>

          <div className="h-px bg-slate-800 w-full" />

          {/* Details */}
          <div className="text-left bg-slate-950/50 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Application Status</span>
              <span className="font-semibold text-amber-400 bg-amber-500/10 py-1 px-3 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Pending Review
              </span>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Registration Date</span>
              <span className="text-slate-300 font-medium">{registrationDate}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Est. Verification Time</span>
              <span className="text-slate-300 font-medium">Within 24-48 Hours</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 font-semibold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3.5 px-4 rounded-xl bg-transparent hover:bg-slate-900/40 border border-dashed border-slate-800 hover:border-slate-700 font-semibold text-slate-400 hover:text-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
            >
              <span>Refresh Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
