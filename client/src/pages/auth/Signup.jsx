import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, User, Phone, Image, Building, ShieldCheck, Settings, BarChart3 } from 'lucide-react';
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

const departments = [
  { id: 1, name: 'Computer Engineering' },
  { id: 2, name: 'Human Resources' },
  { id: 3, name: 'Information Technology' },
  { id: 4, name: 'Finance' }
];

const designationsByDept = {
  1: [
    { id: 1, name: 'Lab Assistant' },
    { id: 2, name: 'Assistant Professor' },
    { id: 5, name: 'Department Head' }
  ],
  2: [
    { id: 7, name: 'HR Specialist' }
  ],
  3: [
    { id: 3, name: 'IT Specialist' },
    { id: 4, name: 'System Administrator' }
  ],
  4: [
    { id: 6, name: 'Accountant' }
  ]
};

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      department_id: '',
      designation_id: ''
    }
  });

  const selectedDeptId = watch("department_id");
  const password = watch("password");

  const [availableDesignations, setAvailableDesignations] = useState([]);

  useEffect(() => {
    if (selectedDeptId) {
      const list = designationsByDept[selectedDeptId] || [];
      setAvailableDesignations(list);
      setValue("designation_id", ""); // reset designation when dept changes
    } else {
      setAvailableDesignations([]);
    }
  }, [selectedDeptId, setValue]);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 4000);
  };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      showToast({
        variant: "destructive",
        title: "Validation Error",
        description: "Passwords do not match.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/api/admin/auth/register', {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        department_id: data.department_id ? parseInt(data.department_id) : null,
        designation_id: data.designation_id ? parseInt(data.designation_id) : null,
        profile_image: data.profileImage || null
      });

      setIsLoading(false);

      if (res.data.success) {
        showToast({
          title: "Registration Request Sent",
          description: "Your account request has been sent to the admin.",
        });

        // Simulate admin approval delay
        setTimeout(async () => {
          showToast({
            title: "Request Approved!",
            description: "Admin has approved your request. Logging you in...",
            variant: "default"
          });

          // Auto-login to get token and redirect
          try {
            const loginRes = await api.post('/api/admin/auth/login', {
              email: data.email,
              password: data.password
            });
            
            if (loginRes.data.success) {
              const { accessToken, refreshToken, user } = loginRes.data.data;
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('refreshToken', refreshToken);
              localStorage.setItem('token', accessToken);
              localStorage.setItem('user', JSON.stringify(user));
              
              setTimeout(() => {
                navigate('/employee/dashboard');
              }, 1000);
            }
          } catch (loginErr) {
             navigate('/login');
          }
        }, 2000);
      }
    } catch (err) {
      setIsLoading(false);
      showToast({
        variant: "destructive",
        title: "Registration Failed",
        description: err.response?.data?.message || "Failed to create registration request. Please try again.",
      });
    }
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
              Join the future of<br />Asset Management.
            </h1>
            <p className="text-lg text-slate-400 max-w-md">
              Start tracking, allocating, and maintaining organizational resources globally.
            </p>
          </motion.div>

          <div className="relative z-10 w-full max-w-md">
            <FeatureCard 
              icon={Building} 
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

      {/* Right Panel: Authentication Form */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-6 lg:p-12 bg-white dark:bg-background relative overflow-y-auto">
        <div className="w-full max-w-md my-8">
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
                  <label className="text-xs font-medium">First name</label>
                  <input
                    type="text"
                    placeholder="Jane"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-transparent outline-none text-xs transition-all ${
                      errors.firstName ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                    }`}
                    {...register("firstName", { required: "Required" })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Last name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-transparent outline-none text-xs transition-all ${
                      errors.lastName ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                    }`}
                    {...register("lastName", { required: "Required" })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Profile Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/avatar.jpg"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-transparent outline-none text-xs border-gray-200 dark:border-gray-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20`}
                  {...register("profileImage")}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Email address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-transparent outline-none text-xs transition-all ${
                    errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                  }`}
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email format"
                    }
                  })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 019-922"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-transparent outline-none text-xs border-gray-200 dark:border-gray-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20`}
                  {...register("phone")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Department</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border bg-transparent dark:bg-slate-900 outline-none text-xs border-gray-200 dark:border-gray-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    {...register("department_id", { required: "Required" })}
                  >
                    <option value="">Select Dept</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Designation</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border bg-transparent dark:bg-slate-900 outline-none text-xs border-gray-200 dark:border-gray-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    {...register("designation_id", { required: "Required" })}
                    disabled={!selectedDeptId}
                  >
                    <option value="">Select Designation</option>
                    {availableDesignations.map((ds) => (
                      <option key={ds.id} value={ds.id}>{ds.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-transparent outline-none text-xs transition-all ${
                      errors.password ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                    }`}
                    {...register("password", { 
                      required: "Required",
                      minLength: { value: 8, message: "Min 8 chars" }
                    })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-transparent outline-none text-xs border-gray-200 dark:border-gray-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20`}
                    {...register("confirmPassword", { required: "Required" })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center disabled:opacity-70 mt-4 text-xs cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Request'}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
              Already have an account? <Link to="/login" className="font-medium text-[#2563EB] hover:text-blue-700 focus:outline-none">Sign In</Link>
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
