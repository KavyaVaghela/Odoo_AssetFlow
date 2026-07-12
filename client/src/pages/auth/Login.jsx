import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, BarChart3, Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

// Inline mock for toast to ensure robustness
const Toast = ({ title, description, variant = "default", onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-lg border w-80 ${variant === 'destructive' ? 'bg-red-500 border-red-600 text-white' : 'bg-white dark:bg-[#0F172A] border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100'}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {variant === 'destructive' ? <AlertCircle className="w-5 h-5 text-white" /> : <CheckCircle2 className="w-5 h-5 text-green-500" />}
        <div className="flex-1">
          <h4 className="text-sm font-semibold">{title}</h4>
          {description && <p className={`text-sm mt-1 ${variant === 'destructive' ? 'text-red-100' : 'text-gray-500 dark:text-gray-400'}`}>{description}</p>}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          ×
        </button>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass p-4 rounded-xl flex items-start gap-4 mb-4"
  >
    <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
      <Icon className="w-6 h-6 text-blue-500" />
    </div>
    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
  </motion.div>
);

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 3000);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await api.post('/api/admin/auth/login', {
        email: data.email,
        password: data.password
      });

      setIsLoading(false);

      if (res.data.success) {
        const { accessToken, refreshToken, user } = res.data.data;
        
        // Save tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('token', accessToken); // keep legacy reference if needed by Zustand
        localStorage.setItem('user', JSON.stringify(user));

        showToast({
          title: "Authentication Successful",
          description: `Logged in as ${user.first_name}. Redirecting...`,
        });

        // Perform automatic redirection based on role
        setTimeout(() => {
          if (typeof navigate === 'function') {
            const userRoles = user.roles || [];
            if (userRoles.includes('Admin') || user.role === 'Admin') {
              navigate('/admin/dashboard');
            } else if (userRoles.includes('Department Head') || user.role === 'Department Head') {
              navigate('/department/dashboard');
            } else {
              navigate('/dashboard');
            }
          }
        }, 1000);
      }
    } catch (err) {
      setIsLoading(false);
      // Detailed validation or login errors
      const status = err.response?.status;
      if (status !== 403) {
        showToast({
          variant: "destructive",
          title: "Authentication Failed",
          description: err.response?.data?.message || "Invalid email or password. Please try again.",
        });
      }
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    showToast({
      title: "Authentication Successful",
      description: `Logged in with ${provider}. Redirecting to Dashboard...`,
    });
    setTimeout(() => {
      if (typeof navigate === 'function') {
        navigate('/dashboard');
      }
    }, 1000);
  };
  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-gray-100">
      {/* Left Panel: Branding */}
      <div className="hidden lg:flex w-[45%] bg-[#0F172A] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[100px]" />

        <div className="relative z-10 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-16"
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">AssetFlow</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Manage Every Asset.<br />Anytime. Anywhere.
            </h1>
            <p className="text-lg text-slate-400 max-w-md">
              The enterprise standard for tracking, allocating, and maintaining organizational resources globally.
            </p>
          </motion.div>

          <div className="relative z-10 w-full max-w-md">
            <FeatureCard 
              icon={AlertCircle} 
              title="Asset Tracking" 
              description="Real-time visibility into all organizational assets globally." 
              delay={0.2} 
            />
            <FeatureCard 
              icon={CheckCircle2} 
              title="Smart Allocation" 
              description="Automated assignment based on department needs." 
              delay={0.3} 
            />
            <FeatureCard 
              icon={Settings} 
              title="Maintenance Workflow" 
              description="Proactive scheduling and lifecycle management." 
              delay={0.4} 
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Analytics & Reports" 
              description="Deep insights into utilization and cost efficiency." 
              delay={0.5} 
            />
          </div>
        </div>
      </div>

      {/* Right Panel: Authentication */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-6 lg:p-12 bg-white dark:bg-background relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10 justify-center">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="text-2xl font-bold tracking-tight">AssetFlow</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Sign in to manage your enterprise assets.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email address</label>
                <input
                  type="email"
                  placeholder="name@assetflow.com"
                  className={`w-full px-4 py-3 rounded-[20px] border bg-transparent outline-none transition-all ${
                    errors.email 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : 'border-gray-200 dark:border-gray-700 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                  }`}
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email format"
                    }
                  })}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1" role="alert">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 rounded-[20px] border bg-transparent outline-none transition-all ${
                      errors.password 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : 'border-gray-200 dark:border-gray-700 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                    }`}
                    {...register("password", { required: "Password is required" })}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] rounded-full p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1" role="alert">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer" 
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-[#2563EB] hover:text-blue-700 transition-colors focus:outline-none focus:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-3 rounded-[20px] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-500/30"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account? <Link to="/signup" className="font-medium text-[#2563EB] hover:text-blue-700 focus:outline-none focus:underline">Create Account</Link>
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 w-full px-6 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="space-x-4">
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors focus:outline-none focus:underline">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors focus:outline-none focus:underline">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors focus:outline-none focus:underline">Contact Support</a>
          </div>
          <div className="flex gap-4">
            <span>v1.0.0</span>
            <span>© 2026 AssetFlow</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
