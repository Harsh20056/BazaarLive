import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, MapPin, Store, Camera, CheckCircle,
  Upload, X, Package
} from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { loginAs } from '../../store/userSlice';

type OnboardingStep = 1 | 2 | 3 | 4;

const BHOPAL_AREAS = [
  'MP Nagar Zone-I',
  'MP Nagar Zone-II', 
  'Arera Colony',
  'TT Nagar',
  'Shyamla Hills',
  'New Market',
  'Bittan Market',
  'Chowk Bazaar',
  'Hamidia Road',
  'Kolar Road'
];

const SHOP_CATEGORIES = [
  'Grocery & Staples',
  'Fresh Vegetables',
  'Dairy Products',
  'Organic Foods',
  'Spices & Condiments',
  'Beverages',
  'Snacks & Packaged Foods',
  'Personal Care',
  'Household Items',
  'Other'
];

export function VendorOnboarding() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [formData, setFormData] = useState({
    shopName: '',
    location: '',
    coordinates: { lat: 0, lng: 0 },
    categories: [] as string[],
    shopPhoto: null as File | null,
    shopPhotoPreview: '',
  });
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStep);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        shopPhoto: file,
        shopPhotoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    
    // Simulate onboarding completion
    setTimeout(() => {
      // Store vendor data in localStorage for persistence
      localStorage.setItem('vendor-onboarding', JSON.stringify(formData));
      
      // Update user state
      dispatch(loginAs({
        role: 'Vendor',
        name: 'Shop Owner',
        email: 'vendor@example.com',
        isGoldMember: false,
        shopId: 'shop1',
      }));
      
      setLoading(false);
      navigate('/vendor/dashboard');
    }, 2000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.shopName.length >= 2;
      case 2:
        return formData.location !== '';
      case 3:
        return formData.categories.length > 0;
      case 4:
        return true; // Photo is optional
      default:
        return false;
    }
  };

  const stepTitles = {
    1: 'Shop Name',
    2: 'Location',
    3: 'Categories',
    4: 'Shop Photo'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-slate-900" style={{ fontWeight: 800, fontSize: '1.6rem' }}>
              Set up your shop
            </h1>
            <span className="text-slate-500 text-sm">
              Step {currentStep} of 4
            </span>
          </div>
          
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-orange-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-slate-900 mb-2" style={{ fontWeight: 700, fontSize: '1.3rem' }}>
                {stepTitles[currentStep]}
              </h2>
              <p className="text-slate-500 text-sm">
                {currentStep === 1 && "What should customers call your shop?"}
                {currentStep === 2 && "Where is your shop located in Bhopal?"}
                {currentStep === 3 && "What categories of items do you sell?"}
                {currentStep === 4 && "Add a photo to help customers find you"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Shop Name */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="text-slate-700 text-sm block mb-2" style={{ fontWeight: 600 }}>
                      Shop Name *
                    </label>
                    <input
                      type="text"
                      value={formData.shopName}
                      onChange={e => setFormData(prev => ({ ...prev, shopName: e.target.value }))}
                      placeholder="e.g. Green Basket Grocers"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                      autoFocus
                    />
                    <p className="text-slate-400 text-xs mt-1">
                      Choose a name that customers will easily remember
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="text-slate-700 text-sm block mb-2" style={{ fontWeight: 600 }}>
                      Select Your Area *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {BHOPAL_AREAS.map(area => (
                        <button
                          key={area}
                          onClick={() => setFormData(prev => ({ ...prev, location: area }))}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            formData.location === area
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm" style={{ fontWeight: 500 }}>{area}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Categories */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="text-slate-700 text-sm block mb-2" style={{ fontWeight: 600 }}>
                      Shop Categories * (Select at least one)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {SHOP_CATEGORIES.map(category => (
                        <button
                          key={category}
                          onClick={() => handleCategoryToggle(category)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            formData.categories.includes(category)
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <span className="text-sm" style={{ fontWeight: 500 }}>{category}</span>
                            {formData.categories.includes(category) && (
                              <CheckCircle className="w-4 h-4 ml-auto text-orange-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-slate-400 text-xs mt-2">
                      Selected: {formData.categories.length} categories
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Photo */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="text-slate-700 text-sm block mb-2" style={{ fontWeight: 600 }}>
                      Shop Photo (Optional)
                    </label>
                    
                    {formData.shopPhotoPreview ? (
                      <div className="relative">
                        <img
                          src={formData.shopPhotoPreview}
                          alt="Shop preview"
                          className="w-full h-48 object-cover rounded-xl border border-slate-200"
                        />
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, shopPhoto: null, shopPhotoPreview: '' }))}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="block w-full h-48 border-2 border-dashed border-slate-300 rounded-xl hover:border-orange-400 transition-colors cursor-pointer">
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                          <Camera className="w-8 h-8 mb-2" />
                          <p className="text-sm" style={{ fontWeight: 500 }}>Click to upload photo</p>
                          <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                    
                    <p className="text-slate-400 text-xs mt-2">
                      A good photo helps customers recognize your shop
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${
                  currentStep === 1
                    ? 'text-slate-400 cursor-not-allowed'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-2.5 rounded-xl text-sm transition-colors"
                  style={{ fontWeight: 700 }}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-2.5 rounded-xl text-sm transition-colors"
                  style={{ fontWeight: 700 }}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Store className="w-4 h-4" />
                      Complete Setup
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Skip Option */}
        {currentStep === 4 && (
          <div className="text-center mt-4">
            <button
              onClick={handleSubmit}
              className="text-slate-500 hover:text-slate-700 text-sm"
            >
              Skip photo for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}