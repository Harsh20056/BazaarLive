import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Bell, TrendingUp, AlertTriangle, CheckCircle,
  Save, MessageCircle, Minus, Plus,
  Clock, Crown
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updatePrice, toggleStock, StockStatus } from '../../store/productSlice';
import { fulfillDemand } from '../../store/demandSlice';
import { upgradeToGold } from '../../store/userSlice';
import { shops } from '../../data/mockData';

type Tab = 'priceboard' | 'demand';

function StockSelect({ value, onChange }: { value: StockStatus; onChange: (v: StockStatus) => void }) {
  const options: StockStatus[] = ['In Stock', 'Low', 'Out'];
  const colors = {
    'In Stock': 'bg-emerald-100 text-emerald-700 border-emerald-300',
    'Low': 'bg-amber-100 text-amber-700 border-amber-300',
    'Out': 'bg-red-100 text-red-700 border-red-300',
  };
  return (
    <div className="flex gap-1">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-2 py-1 rounded-lg border text-xs transition-all ${value === opt ? colors[opt] : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'
            }`}
          style={{ fontWeight: value === opt ? 600 : 400 }}
        >
          {opt === 'In Stock' ? 'In' : opt}
        </button>
      ))}
    </div>
  );
}

export function VendorDashboard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.user);
  const allProducts = useAppSelector(s => s.products);
  const demands = useAppSelector(s => s.demands);

  const shopId = user.shopId || 'shop1';
  const shop = shops.find(s => s.id === shopId);
  const products = allProducts.filter(p => p.shopId === shopId);

  const [tab, setTab] = useState<Tab>('priceboard');
  const [localPrices, setLocalPrices] = useState<Record<string, string>>({});
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [whatsappSynced, setWhatsappSynced] = useState(false);

  useEffect(() => {
    const init: Record<string, string> = {};
    products.forEach(p => { init[p.id] = String(p.currentPrice); });
    setLocalPrices(init);
  }, []);

  const openDemands = demands.filter(d => d.status === 'Open');

  // Compute average prices across all shops for price spike detection
  const avgPrices: Record<string, number> = {};
  const allProductNames = [...new Set(allProducts.map(p => p.name))];
  allProductNames.forEach(name => {
    const group = allProducts.filter(p => p.name === name);
    avgPrices[name] = group.reduce((s, p) => s + p.currentPrice, 0) / group.length;
  });

  const isPriceSpike = (product: typeof products[0]) => {
    const avg = avgPrices[product.name];
    return avg && Number(localPrices[product.id] || product.currentPrice) > avg * 1.25;
  };

  const canIncreasePrice = (product: typeof products[0]) => {
    const avg = avgPrices[product.name];
    const currentPrice = Number(localPrices[product.id] || product.currentPrice);
    // Allow increase only if current price is below 25% spike threshold
    return !avg || currentPrice < avg * 1.25;
  };

  const getMaxAllowedPrice = (product: typeof products[0]) => {
    const avg = avgPrices[product.name];
    return avg ? Math.floor(avg * 1.25) : Infinity;
  };

  const handlePriceChange = (productId: string, value: string, product: typeof products[0]) => {
    const numValue = parseFloat(value);
    const maxPrice = getMaxAllowedPrice(product);
    
    // If trying to set a price above the 25% spike threshold, cap it at the maximum allowed
    if (!isNaN(numValue) && numValue > maxPrice) {
      setLocalPrices(p => ({ ...p, [productId]: String(maxPrice) }));
    } else {
      setLocalPrices(p => ({ ...p, [productId]: value }));
    }
  };

  const handleSavePrice = (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const price = parseFloat(localPrices[id]);
    const maxPrice = getMaxAllowedPrice(product);
    
    if (!isNaN(price) && price > 0) {
      // Cap the price at the maximum allowed if it exceeds the threshold
      const finalPrice = Math.min(price, maxPrice);
      
      dispatch(updatePrice({ id, price: finalPrice }));
      
      // Update local state to reflect the capped price
      if (finalPrice !== price) {
        setLocalPrices(prev => ({ ...prev, [id]: String(finalPrice) }));
      }
      
      setSavedIds(prev => new Set(prev).add(id));
      setTimeout(() => setSavedIds(prev => { const n = new Set(prev); n.delete(id); return n; }), 2000);
    }
  };

  const handleSaveAll = () => {
    products.forEach(p => {
      const price = parseFloat(localPrices[p.id]);
      const maxPrice = getMaxAllowedPrice(p);
      
      if (!isNaN(price) && price > 0) {
        // Cap the price at the maximum allowed if it exceeds the threshold
        const finalPrice = Math.min(price, maxPrice);
        dispatch(updatePrice({ id: p.id, price: finalPrice }));
        
        // Update local state to reflect the capped price
        if (finalPrice !== price) {
          setLocalPrices(prev => ({ ...prev, [p.id]: String(finalPrice) }));
        }
      }
    });
    const allIds = new Set(products.map(p => p.id));
    setSavedIds(allIds);
    setTimeout(() => setSavedIds(new Set()), 2000);
  };

  const handleWhatsAppSync = () => {
    setWhatsappSynced(true);
    setTimeout(() => setWhatsappSynced(false), 3000);
  };

  const inStock = products.filter(p => p.stockStatus === 'In Stock').length;
  const lowStock = products.filter(p => p.stockStatus === 'Low').length;
  const outOfStock = products.filter(p => p.stockStatus === 'Out').length;

  const urgencyColors = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-600 text-xs uppercase tracking-wide" style={{ fontWeight: 700 }}>Live</span>
            </div>
            <h1 className="text-slate-900" style={{ fontWeight: 800, fontSize: '1.6rem' }}>{shop?.name}</h1>
            <p className="text-slate-500 text-sm">Managed by {user.name} • {shop?.address}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* WhatsApp Sync Button */}
            <button
              onClick={handleWhatsAppSync}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${whatsappSynced
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-green-700 border-green-300 hover:bg-green-50'
                }`}
              style={{ fontWeight: 600 }}
            >
              <MessageCircle className="w-4 h-4" />
              {whatsappSynced ? 'Synced!' : 'Sync via WhatsApp'}
            </button>
            {!user.isGoldMember && (
              <button
                onClick={() => dispatch(upgradeToGold())}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-2 rounded-xl text-sm shadow-md shadow-amber-200 hover:from-amber-500 hover:to-amber-600 transition-all"
                style={{ fontWeight: 700 }}
              >
                <Crown className="w-4 h-4" />
                Upgrade to Gold
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <Package className="w-5 h-5 text-slate-400 mb-2" />
            <p className="text-slate-900" style={{ fontWeight: 800, fontSize: '1.8rem' }}>{products.length}</p>
            <p className="text-slate-500 text-sm">Total Items</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
            <CheckCircle className="w-5 h-5 text-emerald-500 mb-2" />
            <p className="text-emerald-700" style={{ fontWeight: 800, fontSize: '1.8rem' }}>{inStock}</p>
            <p className="text-slate-500 text-sm">In Stock</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-500 mb-2" />
            <p className="text-amber-700" style={{ fontWeight: 800, fontSize: '1.8rem' }}>{lowStock}</p>
            <p className="text-slate-500 text-sm">Low Stock</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm">
            <Minus className="w-5 h-5 text-red-500 mb-2" />
            <p className="text-red-700" style={{ fontWeight: 800, fontSize: '1.8rem' }}>{outOfStock}</p>
            <p className="text-slate-500 text-sm">Out of Stock</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 w-fit">
          {([
            { key: 'priceboard', label: 'Price Board', icon: TrendingUp },
            { key: 'demand', label: `Demand Alerts`, icon: Bell, count: openDemands.length },
          ] as { key: Tab; label: string; icon: any; count?: number }[]).map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-all ${tab === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              style={{ fontWeight: tab === key ? 700 : 500 }}
            >
              <Icon className="w-4 h-4" />
              {label}
              {count !== undefined && count > 0 && (
                <span className="bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-0.5" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'priceboard' && (
            <motion.div
              key="priceboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Save All Button */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-slate-500 text-sm">Update prices and stock status. Changes go live instantly.</p>
                <button
                  onClick={handleSaveAll}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-orange-100"
                  style={{ fontWeight: 700 }}
                >
                  <Save className="w-4 h-4" />
                  Publish All
                </button>
              </div>

              {/* Price Board Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wide" style={{ fontWeight: 700 }}>
                  <div className="col-span-3">Product</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Base Price</div>
                  <div className="col-span-2">Your Price</div>
                  <div className="col-span-2">Stock Status</div>
                  <div className="col-span-1">Action</div>
                </div>
                <div className="divide-y divide-slate-50">
                  {products.map(product => {
                    const spike = isPriceSpike(product);
                    const saved = savedIds.has(product.id);
                    const currentVal = Number(localPrices[product.id] || product.currentPrice);
                    const avg = avgPrices[product.name];
                    return (
                      <motion.div
                        key={product.id}
                        layout
                        className={`px-4 sm:px-6 py-4 ${spike ? 'bg-red-50/50' : ''}`}
                      >
                        {/* Mobile layout */}
                        <div className="sm:hidden space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>{product.name}</p>
                              <p className="text-slate-400 text-xs">{product.category} • {product.unit}</p>
                            </div>
                            {spike && (
                              <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-lg border border-red-200" style={{ fontWeight: 700 }}>
                                <AlertTriangle className="w-3 h-3" /> Price Spike - Increases Blocked
                              </span>
                            )}
                            {!canIncreasePrice(product) && !spike && (
                              <span className="flex items-center gap-1 bg-amber-100 text-amber-600 text-xs px-2 py-1 rounded-lg border border-amber-200" style={{ fontWeight: 700 }}>
                                <AlertTriangle className="w-3 h-3" /> Max: ₹{getMaxAllowedPrice(product)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-slate-50 rounded-lg border border-slate-200">
                              <button onClick={() => setLocalPrices(p => ({ ...p, [product.id]: String(Math.max(1, currentVal - 1)) }))} className="px-2 py-1.5 text-slate-500 hover:text-slate-700">
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                value={localPrices[product.id] ?? product.currentPrice}
                                onChange={e => handlePriceChange(product.id, e.target.value, product)}
                                className="w-16 text-center text-slate-900 text-sm bg-transparent focus:outline-none"
                                style={{ fontWeight: 700 }}
                                max={getMaxAllowedPrice(product)}
                              />
                              <button 
                                onClick={() => {
                                  if (canIncreasePrice(product)) {
                                    setLocalPrices(p => ({ ...p, [product.id]: String(currentVal + 1) }))
                                  }
                                }} 
                                disabled={!canIncreasePrice(product)}
                                className={`px-2 py-1.5 transition-colors ${
                                  canIncreasePrice(product) 
                                    ? 'text-slate-500 hover:text-slate-700' 
                                    : 'text-slate-300 cursor-not-allowed'
                                }`}
                                title={!canIncreasePrice(product) ? 'Cannot increase price above 25% of area average' : ''}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <StockSelect
                              value={product.stockStatus}
                              onChange={v => dispatch(toggleStock({ id: product.id, status: v }))}
                            />
                            <button
                              onClick={() => handleSavePrice(product.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${saved ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                              style={{ fontWeight: 700 }}
                            >
                              {saved ? '✓' : 'Save'}
                            </button>
                          </div>
                        </div>

                        {/* Desktop layout */}
                        <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-3">
                            <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>{product.name}</p>
                            <p className="text-slate-400 text-xs">{product.unit} • {product.lastUpdated}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-lg">{product.category}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 text-sm">₹{product.basePrice}</span>
                            {avg && (
                              <p className="text-slate-400" style={{ fontSize: '0.7rem' }}>avg ₹{avg.toFixed(0)}</p>
                            )}
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center gap-1">
                              <div className="flex items-center gap-1 bg-slate-50 rounded-lg border border-slate-200">
                                <button
                                  onClick={() => setLocalPrices(p => ({ ...p, [product.id]: String(Math.max(1, currentVal - 1)) }))}
                                  className="px-1.5 py-1 text-slate-400 hover:text-slate-600"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <input
                                  type="number"
                                  value={localPrices[product.id] ?? product.currentPrice}
                                  onChange={e => handlePriceChange(product.id, e.target.value, product)}
                                  className="w-14 text-center text-slate-900 text-sm bg-transparent focus:outline-none py-1"
                                  style={{ fontWeight: 700 }}
                                  max={getMaxAllowedPrice(product)}
                                />
                                <button
                                  onClick={() => {
                                    if (canIncreasePrice(product)) {
                                      setLocalPrices(p => ({ ...p, [product.id]: String(currentVal + 1) }))
                                    }
                                  }}
                                  disabled={!canIncreasePrice(product)}
                                  className={`px-1.5 py-1 transition-colors ${
                                    canIncreasePrice(product) 
                                      ? 'text-slate-400 hover:text-slate-600' 
                                      : 'text-slate-300 cursor-not-allowed'
                                  }`}
                                  title={!canIncreasePrice(product) ? 'Cannot increase price above 25% of area average' : ''}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              {spike && (
                                <span title="Price Spike Warning" className="text-red-500">
                                  <AlertTriangle className="w-4 h-4" />
                                </span>
                              )}
                            </div>
                            {spike && (
                              <p className="text-red-500 text-xs mt-0.5" style={{ fontWeight: 600 }}>
                                25%+ above avg - Price increases blocked
                              </p>
                            )}
                            {!canIncreasePrice(product) && !spike && (
                              <p className="text-amber-600 text-xs mt-0.5" style={{ fontWeight: 600 }}>
                                Max price: ₹{getMaxAllowedPrice(product)}
                              </p>
                            )}
                          </div>
                          <div className="col-span-2">
                            <StockSelect
                              value={product.stockStatus}
                              onChange={v => dispatch(toggleStock({ id: product.id, status: v }))}
                            />
                          </div>
                          <div className="col-span-1">
                            <button
                              onClick={() => handleSavePrice(product.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white hover:bg-orange-600'
                                }`}
                              style={{ fontWeight: 700 }}
                            >
                              {saved ? '✓ Saved' : 'Save'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Price Spike Legend */}
              <div className="mt-4 space-y-2">
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <span>In Stock</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full" />
                    <span>Low Stock</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span>Out of Stock</span>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-amber-800 text-sm font-semibold">Anti-Monopoly Price Protection</p>
                      <p className="text-amber-700 text-xs mt-1">
                        Price increases are automatically blocked when your price reaches 25% above the local area average. 
                        This helps maintain fair pricing for buyers while allowing competitive pricing flexibility.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'demand' && (
            <motion.div
              key="demand"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <p className="text-slate-500 text-sm">Buyers in your area are requesting these items. Stock them to capture demand!</p>
              {demands.map((demand, i) => (
                <motion.div
                  key={demand.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`bg-white rounded-2xl border p-5 shadow-sm ${demand.status === 'Fulfilled' ? 'border-emerald-100 opacity-60' : 'border-slate-100'
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-slate-900" style={{ fontWeight: 700 }}>{demand.item}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${urgencyColors[demand.urgency]}`} style={{ fontWeight: 600 }}>
                          {demand.urgency} Priority
                        </span>
                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{demand.category}</span>
                        {demand.status === 'Fulfilled' && (
                          <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full border border-emerald-200" style={{ fontWeight: 600 }}>
                            Fulfilled
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm mb-2">{demand.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>By {demand.buyerName}</span>
                        <span>•</span>
                        <span>{demand.location}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{demand.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 text-center">
                        <p className="text-orange-700" style={{ fontWeight: 800, fontSize: '1.2rem' }}>{demand.votes}</p>
                        <p className="text-orange-500 text-xs">votes</p>
                      </div>
                      {demand.status === 'Open' && (
                        <button
                          onClick={() => dispatch(fulfillDemand(demand.id))}
                          className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors"
                          style={{ fontWeight: 600 }}
                        >
                          Mark Fulfilled
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
