import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  ShoppingBasket, MapPin, TrendingDown, Bell, Shield, Star,
  ArrowRight, ChevronRight, Zap, Users, Store, CheckCircle,
  BarChart2, MessageCircle, Package, FileText
} from 'lucide-react';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1568477070631-5bfef06fdf44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080';
const VENDOR_IMAGE = 'https://images.unsplash.com/photo-1727159166330-046fead13394?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';

const pillars = [
  {
    icon: TrendingDown,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: 'Anti-Monopoly Pricing',
    desc: 'Price Spike alerts fire automatically when any item is listed 25% above the local average.',
  },
  {
    icon: Zap,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    title: 'Live Price Board',
    desc: 'Vendors update prices in real-time. You see what they see—no middlemen, no surprises.',
  },
  {
    icon: MapPin,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    title: '5km Hyperlocal Radius',
    desc: 'Discover every shop within your neighborhood. Filter by distance, category, or stock.',
  },
  {
    icon: Bell,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'Demand Alerts',
    desc: 'Can\'t find an item? Post a request. Vendors see community demand and stock accordingly.',
  },
  {
    icon: Star,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    title: 'Gold Membership',
    desc: 'Unlock price trend charts, early demand alerts, and historical pricing data.',
  },
  {
    icon: MessageCircle,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    title: 'WhatsApp Fallback',
    desc: 'No smartphone? No problem. Vendors can sync their price board via WhatsApp.',
  },
];

const steps = [
  { num: '01', title: 'Find your local shops', desc: 'Open the map and see all grocery stores within 5km of your location with real-time stock info.' },
  { num: '02', title: 'Compare live prices', desc: 'Browse price boards updated by vendors themselves. Know exactly what you\'ll pay before you go.' },
  { num: '03', title: 'Shop smarter, save more', desc: 'Pick the best deal, avoid price spikes, and never waste a trip to an out-of-stock store again.' },
];

const stats = [
  { value: '2,400+', label: 'Verified Shops', icon: Store },
  { value: '₹0', label: 'Commission Fee', icon: Package },
  { value: '5km', label: 'Radius Coverage', icon: MapPin },
  { value: '98%', label: 'Price Accuracy', icon: CheckCircle },
];

const floatingPrices = [
  { item: 'Tomatoes', price: '₹38/kg', change: '-5%', positive: true, delay: 0 },
  { item: 'Basmati Rice', price: '₹88/kg', change: '+2%', positive: false, delay: 0.5 },
  { item: 'Farm Eggs', price: '₹75/dz', change: '-6%', positive: true, delay: 1 },
];

export function Landing() {
  const [liveCount, setLiveCount] = useState(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(c => c + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingBasket className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-slate-900" style={{ fontWeight: 700, fontSize: '1.05rem' }}>BazaarLive</span>
              <span className="text-orange-500" style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em' }}>REAL PRICES. RIGHT NOW.</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="hidden sm:block text-slate-600 hover:text-slate-900 text-sm px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
              Sign In
            </Link>
            <Link
              to="/auth"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg transition-colors shadow-md shadow-orange-100"
              style={{ fontWeight: 600 }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, white 2px, transparent 0)', backgroundSize: '50px 50px' }} />
        </div>
        {/* Orange glow */}
        <div className="absolute top-20 right-1/3 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <span className="text-orange-300 text-sm" style={{ fontWeight: 600 }}>
                  {liveCount.toLocaleString()} prices updated today
                </span>
              </div>

              <h1 className="text-white mb-6" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1 }}>
                Real Prices.<br />
                <span className="text-orange-400">Right Now.</span><br />
                <span style={{ fontSize: '0.65em', color: '#94a3b8', fontWeight: 500 }}>At your local bazaar.</span>
              </h1>
              <p className="text-slate-400 text-lg mb-8 max-w-lg">
                BazaarLive connects buyers with verified local grocery vendors. See live prices, check stock status, and compare shops — all within 5km of your location.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/25"
                  style={{ fontWeight: 700 }}
                >
                  <MapPin className="w-5 h-5" />
                  Explore as Buyer
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl transition-all duration-200"
                  style={{ fontWeight: 600 }}
                >
                  <Store className="w-5 h-5" />
                  Register Your Shop
                </Link>
              </div>
            </motion.div>

            {/* Right - Price Board Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              {/* Main card */}
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white" style={{ fontWeight: 700 }}>Green Basket Grocers</p>
                    <p className="text-slate-400 text-sm flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> 0.5 km away • Open Now
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-2 py-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-400 text-xs" style={{ fontWeight: 600 }}>LIVE</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { name: 'Full Cream Milk', price: '₹60', unit: '1L', status: 'In Stock', statusColor: 'bg-emerald-500' },
                    { name: 'Basmati Rice', price: '₹95', unit: '1kg', status: 'Low Stock', statusColor: 'bg-amber-500' },
                    { name: 'Farm Eggs', price: '₹80', unit: 'doz', status: 'In Stock', statusColor: 'bg-emerald-500' },
                    { name: 'Potatoes', price: '₹30', unit: '1kg', status: 'Out of Stock', statusColor: 'bg-red-500' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center justify-between bg-slate-900/50 rounded-xl px-4 py-2.5"
                    >
                      <span className="text-slate-300 text-sm">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-white text-sm" style={{ fontWeight: 700 }}>{item.price}<span className="text-slate-500 text-xs">/{item.unit}</span></span>
                        <div className={`w-2 h-2 rounded-full ${item.statusColor}`} title={item.status} />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between text-xs text-slate-500">
                  <span>Updated 2 min ago</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.8 (142 reviews)</span>
                </div>
              </div>

              {/* Floating price change pills */}
              {floatingPrices.map((fp, i) => (
                <motion.div
                  key={fp.item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + fp.delay, duration: 0.4 }}
                  className={`absolute ${i === 0 ? '-top-6 -left-4' : i === 1 ? '-bottom-7 left-8' : '-right-9 top-1/2'} bg-white rounded-xl shadow-lg px-3 py-2`}
                >
                  <p className="text-slate-800 text-xs" style={{ fontWeight: 600 }}>{fp.item}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600 text-xs">{fp.price}</span>
                    <span className={`text-xs ${fp.positive ? 'text-emerald-600' : 'text-red-500'}`} style={{ fontWeight: 700 }}>{fp.change}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-orange-500">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <Icon className="w-6 h-6 text-orange-100 mx-auto mb-1" />
                <p className="text-white" style={{ fontSize: '2rem', fontWeight: 800 }}>{value}</p>
                <p className="text-orange-100 text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Six Pillars */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-orange-500 text-sm uppercase tracking-widest" style={{ fontWeight: 700 }}>The Six Pillars</span>
            <h2 className="text-slate-900 mt-2" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', fontWeight: 800 }}>Built for India's Local Economy</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">Every feature is designed to level the playing field between buyers and vendors in your neighborhood.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map(({ icon: Icon, color, bg, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-slate-900 mb-2" style={{ fontWeight: 700 }}>{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-orange-500 text-sm uppercase tracking-widest" style={{ fontWeight: 700 }}>How It Works</span>
            <h2 className="text-slate-900 mt-2" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', fontWeight: 800 }}>Shop smarter in 3 steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] right-[-3rem] h-px bg-dashed border-t-2 border-dashed border-orange-200" />
                )}
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
                  <span className="text-white" style={{ fontSize: '1.4rem', fontWeight: 800 }}>{num}</span>
                </div>
                <h3 className="text-slate-900 mb-2" style={{ fontWeight: 700 }}>{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-400 text-sm uppercase tracking-widest" style={{ fontWeight: 700 }}>For Vendors</span>
              <h2 className="text-white mt-2 mb-4" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', fontWeight: 800 }}>
                Your digital price board.<br />Update in seconds.
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                No more handwritten signs. Update your prices from your phone, see what customers are demanding, and build trust with verified reviews.
              </p>
              <ul className="space-y-3 mb-8">
                {['Update prices in real-time from any device', 'See buyer demand alerts for popular items', 'Manage stock flags with one tap', 'WhatsApp sync for feature phones'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-colors"
                style={{ fontWeight: 700 }}
              >
                Register Your Shop
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <img
                src={VENDOR_IMAGE}
                alt="Vendor updating prices"
                className="rounded-2xl object-cover w-full h-72 lg:h-96"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>+23% more customers</p>
                    <p className="text-slate-500 text-xs">after joining BazaarLive</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-500 to-orange-600">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', fontWeight: 800 }}>
            Join 2,400+ shops and 18,000+ buyers
          </h2>
          <p className="text-orange-100 mb-8">Start discovering real prices in your neighborhood today. No app download required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-3.5 rounded-xl shadow-lg transition-all hover:bg-orange-50"
              style={{ fontWeight: 700 }}
            >
              <Users className="w-5 h-5" />
              Join as Buyer
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 bg-orange-700 text-white px-8 py-3.5 rounded-xl border border-orange-400 transition-all hover:bg-orange-800"
              style={{ fontWeight: 700 }}
            >
              <Store className="w-5 h-5" />
              Register Shop
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingBasket className="w-4 h-4 text-white" />
            </div>
            <span className="text-white" style={{ fontWeight: 700 }}>BazaarLive</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 BazaarLive. Empowering local commerce.</p>
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span className="hover:text-slate-300 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms</span>
            <span className="hover:text-slate-300 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}