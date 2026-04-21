import { useRef, useState } from 'react';
import { Link } from 'react-router';
import {
  ShoppingBasket, MapPin, Star, Shield, Store, User, Eye, Bell, TrendingDown,
  Zap, CheckCircle, MessageCircle, Package, AlertTriangle, ArrowLeft,
  Crown, Save, Search, Filter, ChevronRight, Phone, Lock, TrendingUp,
  ThumbsUp, Send, Clock, Minus, Plus, BarChart2, Download, X
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ─── Mock data used in mockups ────────────────────────────────────────────────
const priceHistory = {
  'Full Cream Milk': [
    { day: 'Mon', price: 58 }, { day: 'Tue', price: 60 }, { day: 'Wed', price: 60 },
    { day: 'Thu', price: 62 }, { day: 'Fri', price: 60 }, { day: 'Sat', price: 60 }, { day: 'Sun', price: 60 },
  ],
  'Basmati Rice': [
    { day: 'Mon', price: 88 }, { day: 'Tue', price: 88 }, { day: 'Wed', price: 90 },
    { day: 'Thu', price: 92 }, { day: 'Fri', price: 95 }, { day: 'Sat', price: 95 }, { day: 'Sun', price: 95 },
  ],
};

const vendorProducts = [
  { id: 'p1', name: 'Full Cream Milk', category: 'Dairy', unit: '1L', basePrice: 55, currentPrice: 60, stockStatus: 'In Stock', spike: false },
  { id: 'p2', name: 'Farm Eggs', category: 'Eggs', unit: 'doz', basePrice: 72, currentPrice: 80, stockStatus: 'In Stock', spike: false },
  { id: 'p3', name: 'Basmati Rice', category: 'Grains', unit: '1kg', basePrice: 85, currentPrice: 95, stockStatus: 'Low', spike: false },
  { id: 'p4', name: 'Tomatoes', category: 'Vegetables', unit: '1kg', basePrice: 30, currentPrice: 78, stockStatus: 'In Stock', spike: true },
  { id: 'p5', name: 'Sunflower Oil', category: 'Oil', unit: '1L', basePrice: 120, currentPrice: 130, stockStatus: 'Low', spike: false },
  { id: 'p6', name: 'Yellow Dal', category: 'Pulses', unit: '1kg', basePrice: 90, currentPrice: 95, stockStatus: 'Out', spike: false },
  { id: 'p7', name: 'Potatoes', category: 'Vegetables', unit: '1kg', basePrice: 28, currentPrice: 30, stockStatus: 'In Stock', spike: false },
];

const demandAlerts = [
  { id: 'd1', item: 'Organic Honey', category: 'Specialty', urgency: 'High', votes: 24, status: 'Open', buyerName: 'Ananya M.', location: 'Koramangala', timestamp: '2 hours ago', description: 'Looking for pure forest honey, 500ml jar preferred' },
  { id: 'd2', item: 'A2 Milk', category: 'Dairy', urgency: 'High', votes: 18, status: 'Open', buyerName: 'Suresh P.', location: 'HSR Layout', timestamp: '5 hours ago', description: 'Need A2 Desi cow milk daily, 2 litres' },
  { id: 'd3', item: 'Quinoa', category: 'Grains', urgency: 'Medium', votes: 12, status: 'Fulfilled', buyerName: 'Priya S.', location: 'Koramangala', timestamp: '1 day ago', description: 'Any brand of organic quinoa' },
  { id: 'd4', item: 'Cold-pressed Coconut Oil', category: 'Oil', urgency: 'Low', votes: 8, status: 'Open', buyerName: 'Kiran B.', location: 'Bellandur', timestamp: '2 days ago', description: 'Virgin coconut oil for cooking' },
];

const shopProducts = [
  { id: 'sp1', name: 'Full Cream Milk', category: 'Dairy', unit: '1L', currentPrice: 60, stockStatus: 'In Stock', spike: false },
  { id: 'sp2', name: 'Farm Eggs', category: 'Eggs', unit: 'doz', currentPrice: 80, stockStatus: 'In Stock', spike: false },
  { id: 'sp3', name: 'Basmati Rice', category: 'Grains', unit: '1kg', currentPrice: 95, stockStatus: 'Low', spike: false },
  { id: 'sp4', name: 'Tomatoes', category: 'Vegetables', unit: '1kg', currentPrice: 78, stockStatus: 'In Stock', spike: true },
  { id: 'sp5', name: 'Sunflower Oil', category: 'Oil', unit: '1L', currentPrice: 130, stockStatus: 'In Stock', spike: false },
  { id: 'sp6', name: 'Potatoes', category: 'Vegetables', unit: '1kg', currentPrice: 30, stockStatus: 'Out', spike: false },
];

const shops = [
  { id: 'shop1', name: 'Green Basket Grocers', owner: 'Ramesh Kumar', distance: 0.5, rating: 4.8, reviewCount: 142, address: 'MG Road, Koramangala', verified: true, isOpen: true, tags: ['Organic', 'Dairy', 'Fresh'], inStock: 5, total: 7 },
  { id: 'shop2', name: 'Daily Fresh Mart', owner: 'Priya Sharma', distance: 1.2, rating: 4.5, reviewCount: 89, address: 'Inner Ring Rd, HSR Layout', verified: true, isOpen: true, tags: ['Budget', 'Bulk', 'Grains'], inStock: 6, total: 8 },
  { id: 'shop3', name: 'Kumar General Store', owner: 'Vijay Kumar', distance: 2.1, rating: 4.2, reviewCount: 203, address: 'Brigade Road, MG Road Area', verified: false, isOpen: true, tags: ['Essentials', 'Daily'], inStock: 4, total: 6 },
  { id: 'shop4', name: 'Organic Valley', owner: 'Meena Patel', distance: 2.8, rating: 4.9, reviewCount: 67, address: 'Sarjapur Road, Bellandur', verified: true, isOpen: false, tags: ['Organic', 'Premium', 'Health'], inStock: 3, total: 5 },
  { id: 'shop5', name: 'City Bazaar', owner: 'Hari Singh', distance: 3.5, rating: 4.0, reviewCount: 312, address: 'Commercial St, Shivajinagar', verified: false, isOpen: true, tags: ['Wholesale', 'Bulk'], inStock: 7, total: 9 },
];

// ─── PAGE LABEL HEADER ────────────────────────────────────────────────────────
function PageLabel({ num, route, title }: { num: number; route: string; title: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
          <ShoppingBasket className="w-4 h-4 text-white" />
        </div>
        <span className="text-white text-sm" style={{ fontWeight: 700 }}>BazaarLive</span>
        <span className="text-slate-500 text-xs">•</span>
        <span className="text-slate-400 text-xs font-mono">{route}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-400 text-xs">{title}</span>
        <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style={{ fontWeight: 700 }}>{num}</span>
      </div>
    </div>
  );
}

// ─── NAVBAR MOCKUP ────────────────────────────────────────────────────────────
function NavbarMockup({ role }: { role?: 'Buyer' | 'Vendor' }) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
          <ShoppingBasket className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>BazaarLive</div>
          <div className="text-orange-500" style={{ fontSize: '0.55rem', fontWeight: 600 }}>REAL PRICES. RIGHT NOW.</div>
        </div>
      </div>
      {role && (
        <div className="flex items-center gap-3">
          {role === 'Buyer' && (
            <>
              <div className="flex items-center gap-1.5 text-slate-600 text-xs px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200"><MapPin className="w-3.5 h-3.5" />Explore</div>
              <div className="flex items-center gap-1.5 text-slate-600 text-xs px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200"><Bell className="w-3.5 h-3.5" />Demands</div>
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-1.5 rounded-lg"><User className="w-3 h-3" />Priya S.</div>
            </>
          )}
          {role === 'Vendor' && (
            <>
              <div className="flex items-center gap-1.5 text-slate-600 text-xs px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200"><Package className="w-3.5 h-3.5" />Dashboard</div>
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-1.5 rounded-lg"><Store className="w-3 h-3" />Ramesh K.</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PAGE 1: LANDING ──────────────────────────────────────────────────────────
function LandingMockup() {
  const pillars = [
    { icon: TrendingDown, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Anti-Monopoly Pricing', desc: 'Price Spike alerts fire when any item is 25%+ above the local average.' },
    { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50', title: 'Live Price Board', desc: 'Vendors update prices in real-time. No middlemen, no surprises.' },
    { icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50', title: '5km Hyperlocal Radius', desc: 'Discover every shop within your neighborhood.' },
    { icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50', title: 'Demand Alerts', desc: "Can't find an item? Post a request for vendors." },
    { icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', title: 'Gold Membership', desc: 'Unlock price trend charts and historical pricing data.' },
    { icon: MessageCircle, color: 'text-teal-600', bg: 'bg-teal-50', title: 'WhatsApp Fallback', desc: 'Vendors can sync their price board via WhatsApp.' },
  ];
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl" />
        <div className="flex items-center justify-between">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
              <span className="text-orange-300 text-xs" style={{ fontWeight: 600 }}>1,247 prices updated today</span>
            </div>
            <h1 className="text-white mb-3" style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.1 }}>
              Real Prices.<br />
              <span className="text-orange-400">Right Now.</span><br />
              <span style={{ fontSize: '0.6em', color: '#94a3b8', fontWeight: 500 }}>At your local bazaar.</span>
            </h1>
            <p className="text-slate-400 text-sm mb-5">BazaarLive connects buyers with verified local grocery vendors. See live prices, check stock status, and compare shops — all within 5km.</p>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-orange-500 text-white text-sm px-5 py-2.5 rounded-xl" style={{ fontWeight: 700 }}>
                <MapPin className="w-4 h-4" /> Explore as Buyer
              </div>
              <div className="flex items-center gap-2 bg-white/10 text-white border border-white/20 text-sm px-5 py-2.5 rounded-xl" style={{ fontWeight: 600 }}>
                <Store className="w-4 h-4" /> Register Your Shop
              </div>
            </div>
          </div>
          {/* Live Price Board preview */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 shadow-2xl w-72">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white text-sm" style={{ fontWeight: 700 }}>Green Basket Grocers</p>
                <p className="text-slate-400" style={{ fontSize: '0.7rem' }}>0.5 km away • Open Now</p>
              </div>
              <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 rounded px-2 py-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span className="text-emerald-400" style={{ fontSize: '0.65rem', fontWeight: 600 }}>LIVE</span>
              </div>
            </div>
            {[
              { name: 'Full Cream Milk', price: '₹60', unit: '1L', dot: 'bg-emerald-500' },
              { name: 'Basmati Rice', price: '₹95', unit: '1kg', dot: 'bg-amber-500' },
              { name: 'Farm Eggs', price: '₹80', unit: 'doz', dot: 'bg-emerald-500' },
              { name: 'Potatoes', price: '₹30', unit: '1kg', dot: 'bg-red-500' },
            ].map(item => (
              <div key={item.name} className="flex items-center justify-between bg-slate-900/50 rounded-lg px-3 py-2 mb-1.5">
                <span className="text-slate-300 text-xs">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-xs" style={{ fontWeight: 700 }}>{item.price}<span className="text-slate-500">/{item.unit}</span></span>
                  <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Stats banner */}
      <div className="bg-orange-500 px-8 py-5">
        <div className="flex items-center justify-around">
          {[['2,400+', 'Verified Shops'], ['₹0', 'Subscription Fee'], ['5km', 'Radius Coverage'], ['98%', 'Price Accuracy']].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="text-white" style={{ fontWeight: 800, fontSize: '1.5rem' }}>{val}</p>
              <p className="text-orange-100 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Six Pillars */}
      <div className="px-8 py-8 bg-slate-50">
        <div className="text-center mb-6">
          <span className="text-orange-500 text-xs uppercase tracking-widest" style={{ fontWeight: 700 }}>The Six Pillars</span>
          <h2 className="text-slate-900 mt-1" style={{ fontWeight: 800, fontSize: '1.4rem' }}>Built for India's Local Economy</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {pillars.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-2`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="text-slate-900 text-sm mb-1" style={{ fontWeight: 700 }}>{title}</h3>
              <p className="text-slate-500" style={{ fontSize: '0.72rem' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
      {/* How it works */}
      <div className="px-8 py-6 bg-white">
        <div className="text-center mb-5">
          <span className="text-orange-500 text-xs uppercase tracking-widest" style={{ fontWeight: 700 }}>How It Works</span>
          <h2 className="text-slate-900 mt-1" style={{ fontWeight: 800, fontSize: '1.3rem' }}>Shop smarter in 3 steps</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[
            { num: '01', title: 'Find local shops', desc: 'Open the map and see all grocery stores within 5km of your location.' },
            { num: '02', title: 'Compare live prices', desc: 'Browse price boards updated by vendors themselves.' },
            { num: '03', title: 'Shop smarter', desc: 'Pick the best deal, avoid price spikes, and save every trip.' },
          ].map(({ num, title, desc }) => (
            <div key={num} className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-orange-200">
                <span className="text-white" style={{ fontWeight: 800 }}>{num}</span>
              </div>
              <h3 className="text-slate-900 text-sm mb-1" style={{ fontWeight: 700 }}>{title}</h3>
              <p className="text-slate-500" style={{ fontSize: '0.72rem' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className="bg-slate-900 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
            <ShoppingBasket className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white text-sm" style={{ fontWeight: 700 }}>BazaarLive</span>
        </div>
        <p className="text-slate-500 text-xs">© 2026 BazaarLive. Empowering local commerce.</p>
        <div className="flex items-center gap-4 text-slate-500 text-xs">
          <span>Privacy</span><span>Terms</span><span>Support</span>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 2: AUTH ─────────────────────────────────────────────────────────────
function AuthMockup() {
  return (
    <div className="min-h-[600px] bg-slate-50 flex flex-col">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center"><ShoppingBasket className="w-4 h-4 text-white" /></div>
          <span className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>BazaarLive</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Quick Demo */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
            <p className="text-slate-500 text-xs text-center mb-3 uppercase tracking-wide" style={{ fontWeight: 600 }}>Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-1 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <User className="w-4 h-4 text-emerald-600" /><span className="text-emerald-700 text-xs" style={{ fontWeight: 600 }}>Buyer</span>
              </div>
              <div className="flex flex-col items-center gap-1 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                <Crown className="w-4 h-4 text-amber-600" /><span className="text-amber-700 text-xs" style={{ fontWeight: 600 }}>Gold Buyer</span>
              </div>
              <div className="flex flex-col items-center gap-1 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                <Store className="w-4 h-4 text-blue-600" /><span className="text-blue-700 text-xs" style={{ fontWeight: 600 }}>Vendor</span>
              </div>
            </div>
          </div>
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="flex border-b border-slate-100">
              <div className="flex-1 py-4 text-sm text-center text-orange-600 relative" style={{ fontWeight: 700 }}>
                Sign In
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              </div>
              <div className="flex-1 py-4 text-sm text-center text-slate-500">Create Account</div>
            </div>
            <div className="p-6">
              <p className="text-slate-600 text-sm mb-3" style={{ fontWeight: 500 }}>I am a...</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-orange-500 bg-orange-50">
                  <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center"><User className="w-5 h-5 text-white" /></div>
                  <div><p className="text-orange-700 text-sm" style={{ fontWeight: 700 }}>Buyer</p><p className="text-slate-400" style={{ fontSize: '0.7rem' }}>Find best prices</p></div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-200 bg-white">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center"><Store className="w-5 h-5 text-slate-400" /></div>
                  <div><p className="text-slate-700 text-sm" style={{ fontWeight: 700 }}>Vendor</p><p className="text-slate-400" style={{ fontSize: '0.7rem' }}>Manage my shop</p></div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-700 text-sm block mb-1.5" style={{ fontWeight: 500 }}>Email Address</label>
                  <div className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-400 text-sm bg-slate-50">you@example.com</div>
                </div>
                <div>
                  <label className="text-slate-700 text-sm block mb-1.5" style={{ fontWeight: 500 }}>Password</label>
                  <div className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-400 text-sm bg-slate-50 flex items-center justify-between">
                    <span>••••••••</span><Eye className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
                <div className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3.5 rounded-xl text-sm" style={{ fontWeight: 700 }}>
                  Sign In →
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2">
                {[{ icon: MapPin, label: '5km radius' }, { icon: Shield, label: 'Verified' }, { icon: Zap, label: 'Live prices' }].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 text-slate-400">
                    <Icon className="w-4 h-4" /><span style={{ fontSize: '0.7rem' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 3: VENDOR DASHBOARD ─────────────────────────────────────────────────
function VendorDashboardMockup() {
  const stockColors = { 'In Stock': 'bg-emerald-100 text-emerald-700 border-emerald-300', 'Low': 'bg-amber-100 text-amber-700 border-amber-300', 'Out': 'bg-red-100 text-red-700 border-red-300' };
  return (
    <div className="bg-slate-50 min-h-[600px]">
      <NavbarMockup role="Vendor" />
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-emerald-600 text-xs uppercase" style={{ fontWeight: 700 }}>Live</span>
            </div>
            <h1 className="text-slate-900" style={{ fontWeight: 800, fontSize: '1.4rem' }}>Green Basket Grocers</h1>
            <p className="text-slate-500 text-sm">Managed by Ramesh Kumar • 12 MG Road, Koramangala</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white text-green-700 border-green-300 text-sm" style={{ fontWeight: 600 }}>
              <MessageCircle className="w-4 h-4" /> Sync via WhatsApp
            </div>
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-2 rounded-xl text-sm shadow-md shadow-amber-200" style={{ fontWeight: 700 }}>
              <Crown className="w-4 h-4" /> Upgrade to Gold
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { icon: Package, label: 'Total Items', value: '7', color: 'text-slate-900', bg: 'border-slate-100' },
            { icon: CheckCircle, label: 'In Stock', value: '4', color: 'text-emerald-700', bg: 'border-emerald-100' },
            { icon: AlertTriangle, label: 'Low Stock', value: '2', color: 'text-amber-700', bg: 'border-amber-100' },
            { icon: Minus, label: 'Out of Stock', value: '1', color: 'text-red-700', bg: 'border-red-100' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className={`bg-white rounded-2xl p-4 border ${bg} shadow-sm`}>
              <Icon className={`w-4 h-4 ${color === 'text-slate-900' ? 'text-slate-400' : color} mb-2`} />
              <p className={color} style={{ fontWeight: 800, fontSize: '1.6rem' }}>{value}</p>
              <p className="text-slate-500 text-sm">{label}</p>
            </div>
          ))}
        </div>
        {/* Tab */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-4 w-fit">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-slate-900 shadow-sm text-sm" style={{ fontWeight: 700 }}><TrendingUp className="w-4 h-4" />Price Board</div>
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-slate-500 text-sm"><Bell className="w-4 h-4" />Demand Alerts <span className="bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5" style={{ fontSize: '0.65rem', fontWeight: 700 }}>3</span></div>
        </div>
        {/* Price Board */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-slate-500 text-sm">Update prices and stock status. Changes go live instantly.</p>
          <div className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-xl text-sm" style={{ fontWeight: 700 }}>
            <Save className="w-4 h-4" /> Publish All
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wide" style={{ fontWeight: 700 }}>
            <div className="col-span-3">Product</div><div className="col-span-2">Category</div><div className="col-span-2">Base Price</div><div className="col-span-2">Your Price</div><div className="col-span-2">Stock Status</div><div className="col-span-1">Action</div>
          </div>
          {vendorProducts.map(product => (
            <div key={product.id} className={`grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-slate-50 items-center ${product.spike ? 'bg-red-50/40' : ''}`}>
              <div className="col-span-3">
                <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>{product.name}</p>
                <p className="text-slate-400 text-xs">{product.unit}</p>
              </div>
              <div className="col-span-2"><span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-lg">{product.category}</span></div>
              <div className="col-span-2"><span className="text-slate-500 text-sm">₹{product.basePrice}</span></div>
              <div className="col-span-2 flex items-center gap-1.5">
                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                  <Minus className="w-3 h-3 text-slate-400 mx-1.5" />
                  <span className="text-slate-900 text-sm px-1" style={{ fontWeight: 700 }}>{product.currentPrice}</span>
                  <Plus className="w-3 h-3 text-slate-400 mx-1.5" />
                </div>
                {product.spike && <AlertTriangle className="w-4 h-4 text-red-500" title="Price Spike" />}
              </div>
              <div className="col-span-2">
                <span className={`text-xs px-2 py-1 rounded-lg border ${stockColors[product.stockStatus as keyof typeof stockColors]}`} style={{ fontWeight: 600 }}>
                  {product.stockStatus}
                </span>
              </div>
              <div className="col-span-1">
                <span className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded-lg" style={{ fontWeight: 700 }}>Save</span>
              </div>
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="mt-3 flex gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />In Stock</span>
          <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />Low Stock</span>
          <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-red-500 rounded-full" />Out of Stock</span>
          <span className="flex items-center gap-1.5 text-red-500"><AlertTriangle className="w-3 h-3" /><span style={{ fontWeight: 600 }}>Price Spike: 25%+ above local average</span></span>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 4: VENDOR DEMAND ALERTS ────────────────────────────────────────────
function VendorDemandMockup() {
  const urgencyColors: Record<string, string> = { High: 'bg-red-100 text-red-700 border-red-200', Medium: 'bg-amber-100 text-amber-700 border-amber-200', Low: 'bg-slate-100 text-slate-600 border-slate-200' };
  return (
    <div className="bg-slate-50 min-h-[600px]">
      <NavbarMockup role="Vendor" />
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" /><span className="text-emerald-600 text-xs uppercase" style={{ fontWeight: 700 }}>Live</span></div>
            <h1 className="text-slate-900" style={{ fontWeight: 800, fontSize: '1.4rem' }}>Green Basket Grocers</h1>
            <p className="text-slate-500 text-sm">Managed by Ramesh Kumar • 12 MG Road, Koramangala</p>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[['7', 'Total Items', 'border-slate-100'], ['4', 'In Stock', 'border-emerald-100'], ['2', 'Low Stock', 'border-amber-100'], ['1', 'Out of Stock', 'border-red-100']].map(([v, l, b]) => (
            <div key={l} className={`bg-white rounded-2xl p-4 border ${b} shadow-sm`}>
              <p className="text-slate-700" style={{ fontWeight: 800, fontSize: '1.6rem' }}>{v}</p>
              <p className="text-slate-500 text-sm">{l}</p>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-5 w-fit">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-slate-500 text-sm"><TrendingUp className="w-4 h-4" />Price Board</div>
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-slate-900 shadow-sm text-sm" style={{ fontWeight: 700 }}><Bell className="w-4 h-4" />Demand Alerts <span className="bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5" style={{ fontSize: '0.65rem', fontWeight: 700 }}>3</span></div>
        </div>
        <p className="text-slate-500 text-sm mb-4">Buyers in your area are requesting these items. Stock them to capture demand!</p>
        <div className="space-y-3">
          {demandAlerts.map(demand => (
            <div key={demand.id} className={`bg-white rounded-2xl border p-4 shadow-sm ${demand.status === 'Fulfilled' ? 'border-emerald-100 opacity-60' : 'border-slate-100'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{demand.item}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${urgencyColors[demand.urgency]}`} style={{ fontWeight: 600 }}>{demand.urgency} Priority</span>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{demand.category}</span>
                    {demand.status === 'Fulfilled' && <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full border border-emerald-200" style={{ fontWeight: 600 }}>Fulfilled</span>}
                  </div>
                  <p className="text-slate-600 text-xs mb-1.5">{demand.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>By {demand.buyerName}</span><span>•</span><span>{demand.location}</span><span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{demand.timestamp}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5 text-center">
                    <p className="text-orange-700" style={{ fontWeight: 800, fontSize: '1.1rem' }}>{demand.votes}</p>
                    <p className="text-orange-500 text-xs">votes</p>
                  </div>
                  {demand.status === 'Open' && <span className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-lg" style={{ fontWeight: 600 }}>Mark Fulfilled</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 5: BUYER EXPLORE ────────────────────────────────────────────────────
function BuyerExploreMockup() {
  return (
    <div className="bg-slate-50 min-h-[600px]">
      <NavbarMockup role="Buyer" />
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="mb-5">
          <h1 className="text-slate-900 mb-1" style={{ fontWeight: 800, fontSize: '1.5rem' }}>Explore Nearby Shops</h1>
          <p className="text-slate-500 flex items-center gap-1 text-sm">
            <MapPin className="w-4 h-4 text-orange-500" /> Showing <span style={{ fontWeight: 600 }}>5 shops</span> within 5km of Koramangala, Bengaluru
          </p>
        </div>
        {/* Search bar */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <div className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-400 text-sm shadow-sm">Search shops, items, or tags...</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-600 text-sm shadow-sm">Nearest First ▾</div>
          <div className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm shadow-sm text-slate-600"><Filter className="w-4 h-4" />Filters</div>
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-orange-500 text-white text-sm">☰</div>
            <div className="px-4 py-3 text-slate-500 text-sm">⊞</div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-600 text-sm"><span style={{ fontWeight: 700 }}>5</span> shops found</p>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-full" />In Stock</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-400 rounded-full" />Low Stock</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-400 rounded-full" />Out</span>
          </div>
        </div>
        {/* Shop Cards */}
        <div className="grid grid-cols-3 gap-4">
          {shops.map(shop => (
            <div key={shop.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-28 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  {shop.verified && <span className="flex items-center gap-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-lg" style={{ fontWeight: 600 }}><Shield className="w-2.5 h-2.5" />Verified</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-lg ${shop.isOpen ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-200'}`} style={{ fontWeight: 600 }}>{shop.isOpen ? 'Open' : 'Closed'}</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-white/90 rounded-lg px-2 py-0.5 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-orange-500" /><span className="text-slate-800 text-xs" style={{ fontWeight: 700 }}>{shop.distance}km</span>
                </div>
                <div className="absolute bottom-2 left-2 flex gap-1">
                  {shop.tags.slice(0, 2).map(t => <span key={t} className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded">{t}</span>)}
                </div>
              </div>
              <div className="p-3.5">
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <h3 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{shop.name}</h3>
                    <p className="text-slate-500" style={{ fontSize: '0.7rem' }}>{shop.address}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 rounded-lg px-1.5 py-0.5">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-400" /><span className="text-amber-700 text-xs" style={{ fontWeight: 700 }}>{shop.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" /><span>{shop.inStock}/{shop.total} items in stock</span>
                </div>
                <p className="text-slate-400 text-xs mb-2">{shop.reviewCount} verified reviews</p>
                <div className="w-full flex items-center justify-center gap-1.5 bg-orange-500 text-white py-2 rounded-xl text-xs" style={{ fontWeight: 700 }}>
                  View Price Board <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 6: SHOP DETAIL ──────────────────────────────────────────────────────
function ShopDetailMockup() {
  const stockConfig: Record<string, { color: string; bg: string; border: string; dot: string }> = {
    'In Stock': { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    'Low': { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
    'Out': { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' },
  };
  const reviews = [
    { avatar: 'AM', name: 'Ananya M.', rating: 5, comment: 'Prices are always up-to-date! Ramesh updates the board every morning. Best milk in the area.', ts: '2 days ago', verified: true },
    { avatar: 'KB', name: 'Kiran B.', rating: 5, comment: 'Love that I can check prices before visiting. No more price surprises. Highly recommend!', ts: '4 days ago', verified: true },
    { avatar: 'DR', name: 'Deepa R.', rating: 4, comment: 'Good variety and honest pricing. Sometimes onions go low stock quickly.', ts: '1 week ago', verified: false },
  ];
  return (
    <div className="bg-slate-50 min-h-[600px]">
      <NavbarMockup role="Buyer" />
      {/* Hero */}
      <div className="relative h-40 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute top-3 left-4">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-1.5 rounded-xl text-xs" style={{ fontWeight: 600 }}>
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-lg" style={{ fontWeight: 700 }}><Shield className="w-2.5 h-2.5" />Verified Vendor</span>
                <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-lg" style={{ fontWeight: 600 }}>Open Now</span>
              </div>
              <h1 className="text-white" style={{ fontWeight: 800, fontSize: '1.4rem' }}>Green Basket Grocers</h1>
              <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />12 MG Road, Koramangala, Bengaluru</p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /><span className="text-white" style={{ fontWeight: 800 }}>4.8</span><span className="text-white/60 text-xs">(142)</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-5">
        <div className="grid grid-cols-3 gap-5">
          {/* Main */}
          <div className="col-span-2 space-y-4">
            {/* Stock overview */}
            <div className="grid grid-cols-3 gap-3">
              {[['4', 'In Stock', 'bg-emerald-50 border-emerald-200 text-emerald-700'], ['2', 'Low Stock', 'bg-amber-50 border-amber-200 text-amber-700'], ['1', 'Out of Stock', 'bg-red-50 border-red-200 text-red-700']].map(([c, l, cls]) => (
                <div key={l} className={`${cls} border rounded-2xl p-3 text-center`}><p style={{ fontWeight: 800, fontSize: '1.4rem' }}>{c}</p><p className="text-slate-500 text-xs">{l}</p></div>
              ))}
            </div>
            {/* Category filter */}
            <div className="flex gap-2">
              {['All', 'Dairy', 'Eggs', 'Grains', 'Vegetables', 'Oil'].map((cat, i) => (
                <div key={cat} className={`px-3 py-1.5 rounded-xl text-xs border ${i === 0 ? 'bg-orange-500 text-white border-orange-500 shadow-sm' : 'bg-white text-slate-600 border-slate-200'}`} style={{ fontWeight: i === 0 ? 700 : 500 }}>{cat}</div>
              ))}
            </div>
            {/* Products */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>Live Price Board</h2>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-orange-500 rounded-full" /><span className="text-orange-600 text-xs" style={{ fontWeight: 700 }}>LIVE</span></div>
              </div>
              {shopProducts.map(product => {
                const cfg = stockConfig[product.stockStatus];
                return (
                  <div key={product.id} className={`px-5 py-3.5 border-b border-slate-50 flex items-center justify-between ${product.spike ? 'bg-red-50/30' : 'hover:bg-slate-50'}`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>{product.name}</p>
                        {product.spike && <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-lg border border-red-200" style={{ fontWeight: 700 }}><AlertTriangle className="w-3 h-3" />Price Spike</span>}
                      </div>
                      <p className="text-slate-400 text-xs">{product.category} • {product.unit}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-1 ${cfg.bg} ${cfg.border} border rounded-lg px-2 py-1`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        <span className={`text-xs ${cfg.color}`} style={{ fontWeight: 600 }}>{product.stockStatus}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-900 text-sm" style={{ fontWeight: 800 }}>₹{product.currentPrice}</p>
                        <p className="text-slate-400 text-xs">/{product.unit}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Expanded chart row */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-700 text-sm" style={{ fontWeight: 600 }}>7-Day Price Trend — Full Cream Milk</p>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 text-xs text-amber-700">
                  <Crown className="w-3 h-3" /><span style={{ fontWeight: 600 }}>Gold Members Only</span>
                </div>
              </div>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory['Full Cream Milk']}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={28} tickFormatter={(v: number) => `₹${v}`} />
                    <Tooltip contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '11px' }} formatter={(v: number) => [`₹${v}`, 'Price']} />
                    <Line type="monotone" dataKey="price" stroke="#F97316" strokeWidth={2} dot={{ fill: '#F97316', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Reviews */}
            <div>
              <h2 className="text-slate-900 mb-3" style={{ fontWeight: 700 }}>Customer Reviews <span className="text-slate-400 text-sm" style={{ fontWeight: 400 }}>(3)</span></h2>
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.avatar} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs" style={{ fontWeight: 800 }}>{r.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{r.name}</p>
                            {r.verified && <span className="flex items-center gap-1 text-xs text-blue-600"><Shield className="w-3 h-3" />Verified</span>}
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />)}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm">{r.comment}</p>
                        <p className="text-slate-400 text-xs mt-1.5"><Clock className="w-3 h-3 inline mr-1" />{r.ts}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <h3 className="text-slate-900 mb-3 text-sm" style={{ fontWeight: 700 }}>Shop Info</h3>
              {[{ icon: MapPin, label: 'Address', val: '12 MG Road, Koramangala' }, { icon: Phone, label: 'Phone', val: '+91 98765 43210' }, { icon: Package, label: 'Owner', val: 'Ramesh Kumar' }].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-center gap-3 mb-3 last:mb-0">
                  <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-slate-500" /></div>
                  <div><p className="text-slate-400 text-xs">{label}</p><p className="text-slate-700 text-sm" style={{ fontWeight: 500 }}>{val}</p></div>
                </div>
              ))}
            </div>
            {/* Gold CTA */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-4">
              <div className="flex items-center gap-2 mb-2"><Crown className="w-4 h-4 text-amber-500" /><h3 className="text-amber-800 text-sm" style={{ fontWeight: 800 }}>Go Gold</h3></div>
              {['Price trend charts', 'Historical data', 'Early demand alerts', 'Price alerts'].map(f => (
                <div key={f} className="flex items-center gap-2 text-amber-700 text-xs mb-1.5"><CheckCircle className="w-3.5 h-3.5 text-amber-500" />{f}</div>
              ))}
              <div className="w-full flex items-center justify-center gap-1.5 bg-amber-500 text-white py-2 rounded-xl text-xs mt-3" style={{ fontWeight: 700 }}>Upgrade to Gold <ChevronRight className="w-3 h-3" /></div>
            </div>
            {/* WhatsApp */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <h3 className="text-slate-900 mb-3 text-sm" style={{ fontWeight: 700 }}>Contact Vendor</h3>
              <div className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-xl text-xs" style={{ fontWeight: 700 }}>
                <MessageCircle className="w-3.5 h-3.5" /> Chat on WhatsApp
              </div>
            </div>
            {/* Post Demand */}
            <div className="bg-slate-900 rounded-2xl p-4 text-center">
              <p className="text-white text-sm mb-1" style={{ fontWeight: 700 }}>Don't see what you need?</p>
              <p className="text-slate-400 text-xs mb-3">Post a demand request — vendors will stock it!</p>
              <div className="inline-flex items-center gap-1.5 bg-orange-500 text-white px-4 py-2 rounded-xl text-xs" style={{ fontWeight: 700 }}>Request an Item <ChevronRight className="w-3 h-3" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 7: BUYER DEMAND ─────────────────────────────────────────────────────
function BuyerDemandMockup() {
  const urgencyConfig: Record<string, string> = { High: 'bg-red-50 border-red-200 text-red-600', Medium: 'bg-amber-50 border-amber-200 text-amber-600', Low: 'bg-slate-50 border-slate-200 text-slate-600' };
  const statusConfig: Record<string, string> = { Open: 'bg-blue-50 border-blue-200 text-blue-600', Fulfilled: 'bg-emerald-50 border-emerald-200 text-emerald-600' };
  return (
    <div className="bg-slate-50 min-h-[600px]">
      <NavbarMockup role="Buyer" />
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1"><Bell className="w-4 h-4 text-orange-500" /><span className="text-orange-500 text-xs uppercase tracking-wide" style={{ fontWeight: 700 }}>Demand Board</span></div>
          <h1 className="text-slate-900 mb-1" style={{ fontWeight: 800, fontSize: '1.6rem' }}>Request an Item</h1>
          <p className="text-slate-500 text-sm">Can't find what you need? Post a request — local vendors see these and stock accordingly.</p>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[{ l: 'Active Requests', v: '3', ic: Bell, cls: 'text-orange-500 bg-orange-50 border-orange-100' }, { l: 'Community Votes', v: '62', ic: ThumbsUp, cls: 'text-blue-500 bg-blue-50 border-blue-100' }, { l: 'Items Fulfilled', v: '1', ic: CheckCircle, cls: 'text-emerald-500 bg-emerald-50 border-emerald-100' }].map(({ l, v, ic: Icon, cls }) => (
            <div key={l} className={`${cls} border rounded-2xl p-4 text-center`}>
              <Icon className={`w-5 h-5 ${cls.split(' ')[0]} mx-auto mb-1`} />
              <p className="text-slate-900" style={{ fontWeight: 800, fontSize: '1.4rem' }}>{v}</p>
              <p className="text-slate-500 text-xs">{l}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-5">
          {/* Form */}
          <div className="col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4">
                <h2 className="text-white text-sm" style={{ fontWeight: 700 }}>Post a Request</h2>
                <p className="text-orange-100 text-xs">Vendors in your area will see this</p>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-slate-700 text-xs block mb-1" style={{ fontWeight: 600 }}>Item Name *</label>
                  <div className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-400 text-sm bg-slate-50">e.g. Organic Honey, A2 Milk</div>
                </div>
                <div>
                  <label className="text-slate-700 text-xs block mb-1" style={{ fontWeight: 600 }}>Category</label>
                  <div className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 text-sm bg-white">Other ▾</div>
                </div>
                <div>
                  <label className="text-slate-700 text-xs block mb-1" style={{ fontWeight: 600 }}>Description</label>
                  <div className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-slate-400 text-sm bg-slate-50 h-16">Tell vendors more...</div>
                </div>
                <div>
                  <label className="text-slate-700 text-xs block mb-1" style={{ fontWeight: 600 }}>Urgency</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Low', 'Medium', 'High'].map((opt, i) => (
                      <div key={opt} className={`py-2 rounded-xl border text-xs text-center ${i === 1 ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-slate-200 text-slate-500'}`} style={{ fontWeight: i === 1 ? 700 : 400 }}>{opt}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-slate-700 text-xs block mb-1" style={{ fontWeight: 600 }}>Your Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <div className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-700 text-sm">Koramangala, Bengaluru</div>
                  </div>
                </div>
                <div className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl text-sm" style={{ fontWeight: 700 }}>
                  <Send className="w-4 h-4" /> Post Request
                </div>
              </div>
            </div>
          </div>
          {/* Feed */}
          <div className="col-span-3 space-y-3">
            {/* Search */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <div className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-400 shadow-sm">Search demands...</div>
              </div>
              <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm text-sm">
                {['All', 'Open', 'Fulfilled'].map((s, i) => (
                  <div key={s} className={`px-3 py-2 ${i === 0 ? 'bg-orange-500 text-white' : 'text-slate-500'}`} style={{ fontWeight: i === 0 ? 700 : 400 }}>{s}</div>
                ))}
              </div>
            </div>
            {demandAlerts.map(demand => (
              <div key={demand.id} className={`bg-white rounded-2xl border shadow-sm p-4 ${demand.status === 'Fulfilled' ? 'border-emerald-100' : 'border-slate-100'}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border flex-shrink-0 ${demand.status === 'Fulfilled' ? 'bg-slate-50 border-slate-200 text-slate-300' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs" style={{ fontWeight: 700 }}>{demand.votes}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                      <h3 className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{demand.item}</h3>
                      <div className="flex gap-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${urgencyConfig[demand.urgency]}`} style={{ fontWeight: 600 }}>{demand.urgency}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusConfig[demand.status]}`} style={{ fontWeight: 600 }}>{demand.status}</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs mb-2">{demand.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1"><Package className="w-3 h-3" />{demand.category}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{demand.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{demand.timestamp}</span>
                      <span>by {demand.buyerName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PDF EXPORT PAGE ─────────────────────────────────────────────────────
const PAGES = [
  { id: 'page-1', num: 1, route: '/', title: 'Landing Page', Component: LandingMockup },
  { id: 'page-2', num: 2, route: '/auth', title: 'Auth Page', Component: AuthMockup },
  { id: 'page-3', num: 3, route: '/vendor/dashboard', title: 'Vendor Dashboard — Price Board', Component: VendorDashboardMockup },
  { id: 'page-4', num: 4, route: '/vendor/dashboard', title: 'Vendor Dashboard — Demand Alerts', Component: VendorDemandMockup },
  { id: 'page-5', num: 5, route: '/buyer/explore', title: 'Buyer Explore', Component: BuyerExploreMockup },
  { id: 'page-6', num: 6, route: '/buyer/shop/:id', title: 'Shop Detail', Component: ShopDetailMockup },
  { id: 'page-7', num: 7, route: '/buyer/demand', title: 'Buyer Demand Board', Component: BuyerDemandMockup },
];

export function PDFExport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    setDone(false);
    setProgress(0);

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();   // 297mm
    const pdfHeight = pdf.internal.pageSize.getHeight();  // 210mm

    for (let i = 0; i < PAGES.length; i++) {
      const { id, num, route, title } = PAGES[i];
      const el = document.getElementById(id);
      if (!el) continue;

      setProgress(Math.round(((i + 0.5) / PAGES.length) * 100));

      const canvas = await html2canvas(el, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 5000,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      if (i > 0) pdf.addPage();

      // Fit to page height if too tall
      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        // Scale down to fit
        const scaledH = pdfHeight;
        const scaledW = (canvas.width * pdfHeight) / canvas.height;
        const xOffset = (pdfWidth - scaledW) / 2;
        pdf.addImage(imgData, 'JPEG', xOffset, 0, scaledW, scaledH);
      }

      setProgress(Math.round(((i + 1) / PAGES.length) * 100));
    }

    pdf.save('BazaarLive-UI-All-Pages.pdf');
    setGenerating(false);
    setDone(true);
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sticky Control Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <ShoppingBasket className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>BazaarLive</span>
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 text-sm" style={{ fontWeight: 600 }}>UI Documentation — All Pages</span>
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full" style={{ fontWeight: 700 }}>{PAGES.length} screens</span>
          </div>
          <div className="flex items-center gap-3">
            {generating && (
              <div className="flex items-center gap-3">
                <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-slate-500 text-xs" style={{ fontWeight: 600 }}>{progress}%</span>
              </div>
            )}
            {done && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm" style={{ fontWeight: 600 }}>
                <CheckCircle className="w-4 h-4" /> PDF Downloaded!
              </div>
            )}
            <button
              onClick={generatePDF}
              disabled={generating}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-orange-100"
              style={{ fontWeight: 700 }}
            >
              {generating ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating PDF...</>
              ) : (
                <><Download className="w-4 h-4" />Download PDF</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Page Index */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
          <h2 className="text-slate-900 mb-3 text-sm" style={{ fontWeight: 700 }}>Page Index</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {PAGES.map(({ id, num, route, title }) => (
              <a key={id} href={`#${id}`} className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group">
                <span className="w-6 h-6 bg-orange-500 text-white text-xs rounded-lg flex items-center justify-center flex-shrink-0" style={{ fontWeight: 700 }}>{num}</span>
                <div className="min-w-0">
                  <p className="text-slate-800 text-xs truncate" style={{ fontWeight: 600 }}>{title}</p>
                  <p className="text-slate-400 text-xs font-mono truncate">{route}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Pages */}
        <div ref={containerRef} className="space-y-8">
          {PAGES.map(({ id, num, route, title, Component }) => (
            <div key={id} id={id} className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <PageLabel num={num} route={route} title={title} />
              <Component />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-slate-400 text-sm py-6">
          <p>BazaarLive UI Prototype • {PAGES.length} pages • Generated {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
}
