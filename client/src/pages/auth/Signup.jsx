import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, BarChart3, Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

// Inline mock for toast to reduce dependencies and ensure robustness
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

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch("password");

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 3000);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password: data.password
        })
      });

      const result = await response.json();
      setIsLoading(false);

      if (result.success) {
        // Persist token and user profile
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));

        showToast({
          title: "Account Created",
          description: "Welcome to AssetFlow! Redirecting to Dashboard...",
        });

        // Redirect to Dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        showToast({
          variant: "destructive",
          title: "Signup Failed",
          description: result.message || "Failed to create an account. Please try again.",
        });
      }
    } catch (err) {
      setIsLoading(false);
      showToast({
        variant: "destructive",
        title: "Connection Error",
        description: "Cannot connect to the authentication server. Verify that the backend is running.",
      });
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
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-gray-100">
      {/* Left Panel: Branding (Hidden on mobile/tablet) */}
      <div className="hidden lg:flex w-[45%] bg-[#0F172A] relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Decorative Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[100px]" />

        <div className="relative z-10 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-16"
          >
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">AssetFlow</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Join the future of<br />Asset Management.
            </h1>
            <p className="text-lg text-slate-400 max-w-md">
              Start tracking, allocating, and maintaining organizational resources globally.
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
            <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Sign up to get started with your enterprise assets.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">First name</label>
                  <input
                    type="text"
                    placeholder="Jane"
                    className={`w-full px-4 py-3 rounded-[20px] border bg-transparent outline-none transition-all ${
                      errors.firstName ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                    }`}
                    {...register("firstName", { required: "Required" })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Last name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className={`w-full px-4 py-3 rounded-[20px] border bg-transparent outline-none transition-all ${
                      errors.lastName ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                    }`}
                    {...register("lastName", { required: "Required" })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Email address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full px-4 py-3 rounded-[20px] border bg-transparent outline-none transition-all ${
                    errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                  }`}
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email format"
                    }
                  })}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className={`w-full px-4 py-3 rounded-[20px] border bg-transparent outline-none transition-all ${
                      errors.password ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                    }`}
                    {...register("password", { 
                      required: "Password is required",
                      minLength: { value: 8, message: "Must be at least 8 characters" }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-3 rounded-[20px] transition-all flex items-center justify-center disabled:opacity-70 mt-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
              <span className="text-xs text-gray-400 font-medium tracking-wider">OR CONTINUE WITH</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-800 rounded-[20px] hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors text-sm font-medium">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button 
                onClick={() => handleSocialLogin('Microsoft')}
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-800 rounded-[20px] hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors text-sm font-medium">
                <svg className="w-5 h-5" viewBox="0 0 21 21">
                  <path fill="#f25022" d="M1 1h9v9H1z"/>
                  <path fill="#7fba00" d="M11 1h9v9h-9z"/>
                  <path fill="#00a4ef" d="M1 11h9v9H1z"/>
                  <path fill="#ffb900" d="M11 11h9v9h-9z"/>
                </svg>
                Microsoft
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account? <Link to="/login" className="font-medium text-[#2563EB] hover:text-blue-700">Sign In</Link>
            </p>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
