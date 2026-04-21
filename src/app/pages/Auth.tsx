import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBasket, Store, User, ArrowRight,
  MapPin, Shield, Zap, Crown, Phone, RotateCcw
} from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { loginAs } from '../../store/userSlice';

type AuthStep = 'phone' | 'otp';
type RoleType = 'Buyer' | 'Vendor';

export function Auth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Determine user type based on phone number (last digit)
  const getUserType = (phoneNumber: string): RoleType => {
    const lastDigit = parseInt(phoneNumber.slice(-1));
    return lastDigit >= 5 ? 'Vendor' : 'Buyer';
  };

  const validatePhone = (phoneNumber: string): boolean => {
    // Must be exactly 10 digits and start with 6-9
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit mobile number starting with 6-9');
      return;
    }

    setLoading(true);
    // Simulate OTP dispatch
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      // Focus first OTP input
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }, 2000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isLocked) return;
    
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      
      // Focus last filled input or submit if complete
      const lastIndex = Math.min(index + pastedOtp.length - 1, 5);
      if (lastIndex === 5 && newOtp.every(d => d !== '')) {
        handleOtpSubmit(newOtp);
      } else {
        otpRefs.current[lastIndex]?.focus();
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '')) {
      handleOtpSubmit(newOtp);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (otpArray: string[] = otp) => {
    if (isLocked) return;
    
    const otpString = otpArray.join('');
    if (otpString.length !== 6) return;

    setLoading(true);
    
    // Simulate OTP verification (accept any 6-digit OTP)
    setTimeout(() => {
      setLoading(false);
      
      // For demo, any 6-digit OTP is valid
      if (otpString.length === 6) {
        const userType = getUserType(phone);
        dispatch(loginAs({
          role: userType,
          name: userType === 'Vendor' ? 'Ramesh Kumar' : 'Priya S.',
          email: `${phone}@example.com`,
          isGoldMember: false,
          shopId: userType === 'Vendor' ? 'shop1' : undefined,
        }));
        
        navigate(userType === 'Vendor' ? '/vendor/dashboard' : '/buyer/home');
      } else {
        setError('Invalid OTP. Please try again.');
        setOtpAttempts(prev => prev + 1);
        
        if (otpAttempts >= 2) {
          setIsLocked(true);
          setError('Too many incorrect attempts. Please restart the login flow.');
        }
        
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    }, 1000);
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    
    setCountdown(60);
    setOtpAttempts(0);
    setIsLocked(false);
    setError('');
    setOtp(['', '', '', '', '', '']);
    otpRefs.current[0]?.focus();
  };

  const restartFlow = () => {
    setStep('phone');
    setPhone('');
    setOtp(['', '', '', '', '', '']);
    setError('');
    setOtpAttempts(0);
    setIsLocked(false);
    setCountdown(0);
  };

  const quickLogin = (demoRole: RoleType, gold = false) => {
    setLoading(true);
    setTimeout(() => {
      dispatch(loginAs({
        role: demoRole,
        name: demoRole === 'Vendor' ? 'Ramesh Kumar' : gold ? 'Ananya M.' : 'Priya S.',
        email: demoRole === 'Vendor' ? 'ramesh@greenbazaar.in' : gold ? 'ananya@email.com' : 'priya@email.com',
        isGoldMember: gold,
        shopId: demoRole === 'Vendor' ? 'shop1' : undefined,
      }));
      setLoading(false);
      navigate(demoRole === 'Vendor' ? '/vendor/dashboard' : '/buyer/home');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <ShoppingBasket className="w-5 h-5 text-white" />
          </div>
          <span className="text-slate-900" style={{ fontWeight: 700, fontSize: '1.05rem' }}>BazaarLive</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Demo Quick Login */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
            <p className="text-slate-500 text-xs text-center mb-3 uppercase tracking-wide" style={{ fontWeight: 600 }}>
              Quick Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('Buyer')}
                className="flex flex-col items-center gap-1 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 text-xs" style={{ fontWeight: 600 }}>Buyer</span>
              </button>
              <button
                onClick={() => quickLogin('Buyer', true)}
                className="flex flex-col items-center gap-1 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
              >
                <Crown className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700 text-xs" style={{ fontWeight: 600 }}>Gold Buyer</span>
              </button>
              <button
                onClick={() => quickLogin('Vendor')}
                className="flex flex-col items-center gap-1 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Store className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 text-xs" style={{ fontWeight: 600 }}>Vendor</span>
              </button>
            </div>
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-slate-900 mb-2" style={{ fontWeight: 800, fontSize: '1.4rem' }}>
                  {step === 'phone' ? 'Enter Your Mobile Number' : 'Enter OTP'}
                </h2>
                <p className="text-slate-500 text-sm">
                  {step === 'phone' 
                    ? 'We\'ll send you a one-time password to verify your number'
                    : `We've sent a 6-digit OTP to +91 ${phone}`
                  }
                </p>
              </div>

              <AnimatePresence mode="wait">
                {step === 'phone' ? (
                  <motion.form
                    key="phone"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handlePhoneSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-slate-700 text-sm block mb-1.5" style={{ fontWeight: 500 }}>
                        Mobile Number
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-500">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">+91</span>
                          <div className="w-px h-4 bg-slate-300" />
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="9876543210"
                          className="w-full border border-slate-200 rounded-xl pl-20 pr-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                          maxLength={10}
                        />
                      </div>
                      <p className="text-slate-400 text-xs mt-1">
                        Numbers ending 0-4: Buyer • Numbers ending 5-9: Vendor
                      </p>
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !validatePhone(phone)}
                      className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3.5 rounded-xl transition-all"
                      style={{ fontWeight: 700 }}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Send OTP
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-slate-700 text-sm block mb-3" style={{ fontWeight: 500 }}>
                        Enter 6-digit OTP
                      </label>
                      <div className="flex gap-2 justify-center">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={el => { otpRefs.current[index] = el; }}
                            type="text"
                            value={digit}
                            onChange={e => handleOtpChange(index, e.target.value)}
                            onKeyDown={e => handleOtpKeyDown(index, e)}
                            className={`w-12 h-12 text-center border rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all ${
                              isLocked 
                                ? 'border-red-300 bg-red-50 text-red-500' 
                                : 'border-slate-200 focus:border-orange-500'
                            }`}
                            maxLength={6}
                            disabled={isLocked}
                          />
                        ))}
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 text-center">{error}</p>
                    )}

                    {loading && (
                      <div className="flex items-center justify-center gap-2 text-slate-500">
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-orange-500 rounded-full animate-spin" />
                        <span className="text-sm">Verifying OTP...</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4">
                      <button
                        onClick={restartFlow}
                        className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1"
                      >
                        <ArrowRight className="w-3 h-3 rotate-180" />
                        Change Number
                      </button>
                      
                      <button
                        onClick={handleResendOtp}
                        disabled={countdown > 0}
                        className={`text-sm flex items-center gap-1 ${
                          countdown > 0 
                            ? 'text-slate-400 cursor-not-allowed' 
                            : 'text-orange-500 hover:text-orange-600'
                        }`}
                      >
                        <RotateCcw className="w-3 h-3" />
                        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                      </button>
                    </div>

                    {isLocked && (
                      <div className="text-center pt-2">
                        <button
                          onClick={restartFlow}
                          className="text-orange-500 hover:text-orange-600 text-sm"
                          style={{ fontWeight: 600 }}
                        >
                          Restart Login Flow
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Features */}
              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-2">
                {[
                  { icon: MapPin, label: '5km radius' },
                  { icon: Shield, label: 'Verified' },
                  { icon: Zap, label: 'Live prices' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 text-slate-400">
                    <Icon className="w-4 h-4" />
                    <span style={{ fontSize: '0.7rem' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
