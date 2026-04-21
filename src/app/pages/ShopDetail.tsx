import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Shield, Phone, ArrowLeft, CheckCircle, AlertTriangle,
  XCircle, Clock, Crown, Lock, TrendingUp, Package, MessageCircle,
  ChevronRight, Send
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useAppSelector } from '../../store/hooks';
import { shops, reviews, priceHistory } from '../../data/mockData';
import { Product } from '../../store/productSlice';

type CategoryFilter = 'All' | string;

const stockConfig = {
  'In Stock': { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle, dot: 'bg-emerald-500' },
  'Low': { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, dot: 'bg-amber-500' },
  'Out': { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle, dot: 'bg-red-500' },
};

function PriceTrendChart({ productName }: { productName: string }) {
  const data = priceHistory[productName];
  if (!data) return null;
  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={30}
            tickFormatter={v => `₹${v}`} />
          <Tooltip
            contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            formatter={(v: number) => [`₹${v}`, 'Price']}
          />
          <Line type="monotone" dataKey="price" stroke="#F97316" strokeWidth={2.5} dot={{ fill: '#F97316', r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function PriceComparison({ product, allProducts }: { product: Product; allProducts: Product[] }) {
  const sameItem = allProducts.filter(p => p.name === product.name && p.stockStatus !== 'Out');
  if (sameItem.length < 2) return null;
  const minPrice = Math.min(...sameItem.map(p => p.currentPrice));
  const avgPrice = sameItem.reduce((s, p) => s + p.currentPrice, 0) / sameItem.length;
  const isLowest = product.currentPrice <= minPrice;
  const isBelowAvg = product.currentPrice < avgPrice;

  return (
    <div className={`flex items-center gap-1.5 text-xs ${isLowest ? 'text-emerald-600' : isBelowAvg ? 'text-blue-500' : 'text-slate-400'}`}>
      {isLowest && <TrendingUp className="w-3 h-3" />}
      {isLowest ? 'Lowest nearby' : isBelowAvg ? 'Below avg' : `Avg ₹${avgPrice.toFixed(0)}`}
    </div>
  );
}

export function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const allProducts = useAppSelector(s => s.products); 
  const user = useAppSelector(s => s.user);

  const shop = shops.find(s => s.id === id);
  const products = allProducts.filter(p => p.shopId === id);
  const shopReviews = reviews.filter(r => r.shopId === id);

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
  });

  const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reviewForm.rating || !reviewForm.comment.trim()) return;
    
    // In a real app, this would submit to the backend
    // For now, we'll just show a success message and reset the form
    alert('Review submitted successfully!');
    setReviewForm({ rating: 0, comment: '' });
    setShowReviewForm(false);
  };

  if (!shop) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600" style={{ fontWeight: 600 }}>Shop not found</p>
          <Link to="/buyer/explore" className="text-orange-500 text-sm mt-2 inline-block">Back to Explore</Link>
        </div>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = products.filter(p =>
    categoryFilter === 'All' || p.category === categoryFilter
  );

  // Compute average prices for price spike detection
  const avgPrices: Record<string, number> = {};
  Array.from(new Set(allProducts.map(p => p.name))).forEach(name => {
    const group = allProducts.filter(p => p.name === name);
    avgPrices[name] = group.reduce((s, p) => s + p.currentPrice, 0) / group.length;
  });

  const inStock = products.filter(p => p.stockStatus === 'In Stock').length;
  const low = products.filter(p => p.stockStatus === 'Low').length;
  const out = products.filter(p => p.stockStatus === 'Out').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img src={shop.coverImage} alt={shop.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        {/* Back button */}
        <Link
          to="/buyer/explore"
          className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-2 rounded-xl text-sm hover:bg-white/30 transition-colors"
          style={{ fontWeight: 600 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        {/* Shop name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {shop.verified && (
                    <span className="flex items-center gap-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-lg" style={{ fontWeight: 700 }}>
                      <Shield className="w-3 h-3" /> Verified Vendor
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-lg ${shop.isOpen ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-white'}`} style={{ fontWeight: 600 }}>
                    {shop.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
                <h1 className="text-white" style={{ fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>{shop.name}</h1>
                <p className="text-white/70 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {shop.address}
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-white" style={{ fontWeight: 800, fontSize: '1.1rem' }}>{shop.rating}</span>
                  <span className="text-white/60 text-sm">({shop.reviewCount})</span>
                </div>
                <p className="text-white/60 text-xs">Member since {shop.memberSince}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
        {/* Mobile rating */}
        <div className="sm:hidden flex items-center gap-3 mb-6 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-slate-900" style={{ fontWeight: 800 }}>{shop.rating}</span>
          </div>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 text-sm">{shop.reviewCount} reviews</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 text-sm">{shop.distance}km away</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Anti-Monopoly Warning Banner */}
            {products.some(p => p.isFlagged) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-red-800" style={{ fontWeight: 700 }}>Price Alert</p>
                    <p className="text-red-600 text-sm">One or more prices are 25% or more above the area average.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stock Overview */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'In Stock', count: inStock, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
                { label: 'Low Stock', count: low, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
                { label: 'Out of Stock', count: out, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
              ].map(({ label, count, bg, text, border }) => (
                <div key={label} className={`${bg} ${border} border rounded-2xl p-3 text-center`}>
                  <p className={`${text}`} style={{ fontWeight: 800, fontSize: '1.5rem' }}>{count}</p>
                  <p className="text-slate-500 text-xs">{label}</p>
                </div>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm transition-all border ${
                    categoryFilter === cat
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                  style={{ fontWeight: categoryFilter === cat ? 700 : 500 }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-slate-900" style={{ fontWeight: 700 }}>Live Price Board</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-orange-600 text-xs" style={{ fontWeight: 700 }}>LIVE</span>
                </div>
              </div>

              <div className="divide-y divide-slate-50">
                {filteredProducts.map(product => {
                  const avg = avgPrices[product.name];
                  const isSpike = product.isFlagged || (avg && product.currentPrice > avg * 1.25);
                  const cfg = stockConfig[product.stockStatus];
                  const isExpanded = expandedProduct === product.id;
                  const hasChart = !!priceHistory[product.name];

                  return (
                    <div key={product.id}>
                      <div
                        className={`px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${isSpike ? 'bg-red-50/30' : ''}`}
                        onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-slate-900 text-sm ${product.isFlagged ? 'line-through opacity-75' : ''}`} style={{ fontWeight: 600 }}>
                                {product.name}
                              </p>
                              {product.isFlagged && (
                                <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-lg border border-red-200" style={{ fontWeight: 700 }}>
                                  <AlertTriangle className="w-3 h-3" /> Flagged
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-slate-400 text-xs">{product.category} • {product.unit}</p>
                              <span className="text-slate-300">•</span>
                              <PriceComparison product={product} allProducts={allProducts} />
                            </div>
                          </div>
                          <div className="flex items-center gap-4 ml-3">
                            {/* Stock badge */}
                            <div className={`flex items-center gap-1 ${cfg.bg} ${cfg.border} border rounded-lg px-2 py-1`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              <span className={`text-xs ${cfg.color}`} style={{ fontWeight: 600 }}>
                                {product.stockStatus}
                              </span>
                            </div>
                            {/* Price */}
                            <div className="text-right">
                              <p className={`text-slate-900 ${product.isFlagged ? 'text-red-600' : ''}`} style={{ fontWeight: 800 }}>
                                ₹{product.currentPrice}
                              </p>
                              <p className="text-slate-400 text-xs">/{product.unit}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded - Price Trend Chart */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-slate-50 bg-slate-50/50"
                        >
                          <div className="px-5 py-4">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-slate-700 text-sm" style={{ fontWeight: 600 }}>
                                7-Day Price Trend
                              </p>
                              {!user.isGoldMember && (
                                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 text-xs text-amber-700">
                                  <Crown className="w-3 h-3" />
                                  <span style={{ fontWeight: 600 }}>Gold feature</span>
                                </div>
                              )}
                            </div>
                            {user.isGoldMember ? (
                              hasChart ? (
                                <PriceTrendChart productName={product.name} />
                              ) : (
                                <p className="text-slate-400 text-sm text-center py-4">No trend data yet</p>
                              )
                            ) : (
                              <div className="relative">
                                <div className="filter blur-sm pointer-events-none">
                                  {hasChart && <PriceTrendChart productName={product.name} />}
                                  {!hasChart && <div className="h-32 bg-slate-100 rounded-xl" />}
                                </div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl">
                                  <Lock className="w-6 h-6 text-amber-500 mb-2" />
                                  <p className="text-slate-700 text-sm" style={{ fontWeight: 700 }}>Gold Members Only</p>
                                  <p className="text-slate-500 text-xs mt-1">Upgrade to see price trend charts</p>
                                </div>
                              </div>
                            )}
                            <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                              <span>Updated: {product.lastUpdated}</span>
                              {avg && <span>Area avg: ₹{avg.toFixed(0)}</span>}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-slate-900" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  Customer Reviews
                  <span className="text-slate-400 text-sm ml-2" style={{ fontWeight: 400 }}>({shopReviews.length})</span>
                </h2>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Leave Review
                </button>
              </div>

              {/* Review Form */}
              <AnimatePresence>
                {showReviewForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-slate-50 rounded-2xl p-5 mb-6"
                  >
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="text-slate-700 text-sm block mb-2" style={{ fontWeight: 600 }}>
                          Rating
                        </label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                              className={`w-8 h-8 ${star <= reviewForm.rating ? 'text-amber-400' : 'text-slate-300'} hover:text-amber-400 transition-colors`}
                            >
                              <Star className="w-full h-full fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-slate-700 text-sm block mb-2" style={{ fontWeight: 600 }}>
                          Your Review
                        </label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                          placeholder="Share your experience with this shop..."
                          rows={3}
                          maxLength={200}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all resize-none"
                        />
                        <p className="text-slate-400 text-xs mt-1">{reviewForm.comment.length}/200 characters</p>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={!reviewForm.rating || !reviewForm.comment.trim()}
                          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-2 rounded-xl text-sm transition-colors"
                          style={{ fontWeight: 600 }}
                        >
                          <Send className="w-4 h-4" />
                          Submit Review
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                {shopReviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm" style={{ fontWeight: 800 }}>{review.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <p className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{review.buyerName}</p>
                            {review.verified && (
                              <span className="flex items-center gap-1 text-xs text-blue-600">
                                <Shield className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-3.5 h-3.5 ${idx < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm mt-1.5">{review.comment}</p>
                        <p className="text-slate-400 text-xs mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {review.timestamp}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Shop Info Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-slate-900 mb-4" style={{ fontWeight: 700 }}>Shop Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4.5 h-4.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Address</p>
                    <p className="text-slate-700 text-sm" style={{ fontWeight: 500 }}>{shop.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4.5 h-4.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Phone</p>
                    <p className="text-slate-700 text-sm" style={{ fontWeight: 500 }}>{shop.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-4.5 h-4.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Owner</p>
                    <p className="text-slate-700 text-sm" style={{ fontWeight: 500 }}>{shop.owner}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gold CTA (non-gold users) */}
            {!user.isGoldMember && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <h3 className="text-amber-800" style={{ fontWeight: 800 }}>Go Gold</h3>
                </div>
                <ul className="space-y-2 mb-4">
                  {['Price trend charts', 'Historical data', 'Early demand alerts', 'Price alerts'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-amber-700 text-sm">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/auth"
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl text-sm transition-colors"
                  style={{ fontWeight: 700 }}
                >
                  Upgrade to Gold
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* WhatsApp Contact */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-slate-900 mb-3" style={{ fontWeight: 700 }}>Contact Vendor</h3>
              <a
                href={`https://wa.me/${shop.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm transition-colors"
                style={{ fontWeight: 700 }}
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Post Demand */}
            <div className="bg-slate-900 rounded-2xl p-5 text-center">
              <p className="text-white text-sm mb-1" style={{ fontWeight: 700 }}>Don't see what you need?</p>
              <p className="text-slate-400 text-xs mb-4">Post a demand request — vendors will stock it!</p>
              <Link
                to="/buyer/demand"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm transition-colors"
                style={{ fontWeight: 700 }}
              >
                Request an Item
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
