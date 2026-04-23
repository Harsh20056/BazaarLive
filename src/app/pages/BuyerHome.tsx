import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Search, ChevronRight, Shield,
  Package, Map, List,
  CheckCircle, SlidersHorizontal,
  Bell, Crown, ArrowRight
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { shops, Shop } from '../../data/mockData';
import { Product } from '../../store/productSlice';

type ViewMode = 'list' | 'map';
type SortBy = 'distance' | 'rating' | 'name';

// Custom map component using SVG
function MapView({ selectedShop, onSelectShop }: {
  selectedShop: Shop | null;
  onSelectShop: (shop: Shop) => void;
}) {
  // Map dimensions and shop positions on the SVG canvas
  const shopPositions: Record<string, { x: number; y: number }> = {
    shop1: { x: 52, y: 45 },
    shop2: { x: 68, y: 62 },
    shop3: { x: 35, y: 30 },
    shop4: { x: 72, y: 70 },
    shop5: { x: 28, y: 55 },
  };

  return (
    <div className="relative bg-slate-100 rounded-2xl overflow-hidden" style={{ height: '420px' }}>
      {/* Fake map background */}
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Background */}
        <rect width="100" height="100" fill="#e8ead6" />
        {/* Roads */}
        <line x1="0" y1="50" x2="100" y2="50" stroke="#ffffff" strokeWidth="2" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#ffffff" strokeWidth="2" />
        <line x1="0" y1="35" x2="100" y2="60" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="20" y1="0" x2="80" y2="100" stroke="#ffffff" strokeWidth="1" />
        <line x1="0" y1="70" x2="70" y2="25" stroke="#ffffff" strokeWidth="1" />
        {/* Blocks */}
        <rect x="5" y="5" width="20" height="20" fill="#d4d8c8" rx="2" />
        <rect x="55" y="5" width="18" height="22" fill="#d4d8c8" rx="2" />
        <rect x="5" y="55" width="16" height="20" fill="#d4d8c8" rx="2" />
        <rect x="55" y="55" width="22" height="18" fill="#d4d8c8" rx="2" />
        <rect x="30" y="12" width="14" height="12" fill="#d4d8c8" rx="2" />
        <rect x="75" y="35" width="18" height="14" fill="#d4d8c8" rx="2" />
        {/* Water */}
        <ellipse cx="15" cy="80" rx="12" ry="8" fill="#b8d4e8" opacity="0.6" />
        {/* Park */}
        <rect x="40" y="38" width="14" height="10" fill="#c8dbb0" rx="3" />
        {/* 5km radius circle */}
        <circle cx="52" cy="45" r="40" fill="none" stroke="#F97316" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.7" />
      </svg>

      {/* Shop Markers */}
      {shops.map(shop => {
        const pos = shopPositions[shop.id];
        const isSelected = selectedShop?.id === shop.id;
        return (
          <button
            key={shop.id}
            onClick={() => onSelectShop(shop)}
            className="absolute transform -translate-x-1/2 -translate-y-full group"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div className={`flex flex-col items-center transition-all duration-200 ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                isSelected ? 'bg-orange-500' : shop.isOpen ? 'bg-slate-800' : 'bg-slate-400'
              }`}>
                <Package className="w-4 h-4 text-white" />
              </div>
              {isSelected && (
                <div className="absolute bottom-10 bg-white rounded-xl shadow-xl border border-slate-100 p-3 w-48 z-10 text-left">
                  <p className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{shop.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-amber-500 text-xs flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400" /> {shop.rating}
                    </span>
                    <span className="text-slate-400 text-xs">• {shop.distance}km</span>
                  </div>
                  {!shop.isOpen && (
                    <span className="text-red-500 text-xs" style={{ fontWeight: 600 }}>Closed</span>
                  )}
                </div>
              )}
            </div>
            <div className="w-1 h-2 bg-current opacity-50 mx-auto" />
          </button>
        );
      })}

      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 bg-white/80 rounded px-2 py-0.5 text-slate-400" style={{ fontSize: '0.6rem' }}>
        BazaarLive Map • 5km Radius
      </div>

      {/* Center marker (user) */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: '52%', top: '45%' }}
      >
        <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
        <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-30" />
      </div>

      {/* Legend */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl p-2.5 shadow-md border border-slate-100">
        <p className="text-slate-700 text-xs mb-1.5" style={{ fontWeight: 700 }}>Legend</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border border-white shadow-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <span className="text-slate-600" style={{ fontSize: '0.65rem' }}>Your location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-800 rounded-full border border-white shadow-sm" />
            <span className="text-slate-600" style={{ fontSize: '0.65rem' }}>Open shops</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full border border-white shadow-sm" />
            <span className="text-slate-600" style={{ fontSize: '0.65rem' }}>Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StockSummary({ shopId }: { shopId: string }) {
  const products = useAppSelector(s => s.products.filter(p => p.shopId === shopId));
  const inStock = products.filter(p => p.stockStatus === 'In Stock').length;
  const total = products.length;
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
      <span>{inStock}/{total} items in stock</span>
    </div>
  );
}

export function BuyerHome() {
  const user = useAppSelector(s => s.user);
  const demands = useAppSelector(s => s.demands);
  const [view, setView] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('distance');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOpen, setFilterOpen] = useState<boolean | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('MP Nagar, Bhopal');

  const openDemands = demands.filter(d => d.status === 'Open').length;

  const allProducts = useAppSelector(s => s.products);
  const filteredShops = shops
    .filter(s => {
      // Search in shop names, tags, and owner names
      const matchShopSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        s.owner.toLowerCase().includes(search.toLowerCase());
      
      // Also search in items sold by this shop
      const shopProducts = allProducts.filter((p: Product) => p.shopId === s.id);
      const matchItemSearch = shopProducts.some((p: Product) => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      );
      
      const matchSearch = matchShopSearch || matchItemSearch;
      const matchOpen = filterOpen === null ? true : s.isOpen === filterOpen;
      return matchSearch && matchOpen;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-slate-900 mb-1" style={{ fontWeight: 800, fontSize: '1.8rem' }}>
                Welcome back, {user.name}!
              </h1>
              <p className="text-slate-500 flex items-center gap-1 text-sm">
                <MapPin className="w-4 h-4 text-orange-500" />
                {selectedLocation}
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/buyer/demand"
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-4 py-2 transition-colors"
                style={{ fontWeight: 600 }}
              >
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Request Item</span>
                {openDemands > 0 && (
                  <span className="bg-white text-orange-500 text-xs rounded-full px-1.5 py-0.5" style={{ fontWeight: 700 }}>
                    {openDemands}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Location Selector */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-700 text-sm mb-1" style={{ fontWeight: 600 }}>Your Location</p>
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="text-slate-900 bg-transparent border-none focus:outline-none cursor-pointer"
                  style={{ fontWeight: 500 }}
                ><option value="MP Nagar, Bhopal">MP Nagar, Bhopal</option>
<option value="Arera Colony, Bhopal">Arera Colony, Bhopal</option>
<option value="Indrapuri, Bhopal">Indrapuri, Bhopal</option>
<option value="Gulmohar, Bhopal">Gulmohar, Bhopal</option>
<option value="Kolar Road, Bhopal">Kolar Road, Bhopal</option>
<option value="TT Nagar, Bhopal">TT Nagar, Bhopal</option>
<option value="Ayodhya Bypass, Bhopal">Ayodhya Bypass, Bhopal</option>
<option value="Bawadiya Kalan, Bhopal">Bawadiya Kalan, Bhopal</option>
                </select>
              </div>
              <div className="text-right">
                <p className="text-slate-900" style={{ fontWeight: 800, fontSize: '1.2rem' }}>{filteredShops.length}</p>
                <p className="text-slate-500 text-xs">shops nearby</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search + Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search shops by name, tags, or items they sell..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-20 sm:pr-24 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-sm"
            />
            <Link
              to="/buyer/search"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600 text-xs sm:text-sm bg-white px-1 sm:px-0"
              style={{ fontWeight: 600 }}
            >
              Advanced
            </Link>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortBy)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 shadow-sm"
              style={{ fontWeight: 500 }}
            >
              <option value="distance">Nearest First</option>
              <option value="rating">Top Rated</option>
              <option value="name">A-Z</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 bg-white border rounded-xl text-sm shadow-sm transition-colors ${
                showFilters ? 'border-orange-500 text-orange-600' : 'border-slate-200 text-slate-600'
              }`}
              style={{ fontWeight: 500 }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            {/* View Toggle */}
            <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {(['list', 'map'] as ViewMode[]).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-3 text-sm transition-colors ${
                    view === v ? 'bg-orange-500 text-white' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {v === 'list' ? <List className="w-4 h-4" /> : <Map className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

       {/* Filters Dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-slate-100 rounded-2xl p-4 mb-6 shadow-sm"
            >
              <p className="text-slate-700 text-sm mb-3" style={{ fontWeight: 600 }}>Filter by</p>
              <div className="flex flex-wrap gap-2">
                <p className="text-slate-500 text-sm mr-2">Status:</p>
                {[
                  { label: 'All Shops', value: null },
                  { label: 'Open Now', value: true },
                  { label: 'Closed', value: false },
                ].map(({ label, value }) => (
                  <button
                    key={label}
                    onClick={() => setFilterOpen(value)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      filterOpen === value ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'
                    }`}
                    style={{ fontWeight: filterOpen === value ? 600 : 400 }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {view === 'map' && (
          <div className="mb-6">
            <MapView selectedShop={selectedShop} onSelectShop={setSelectedShop} />
          </div>
        )}

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-600 text-sm"><span style={{ fontWeight: 700 }}>{filteredShops.length}</span> shops found</p>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-full" /> In Stock</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-400 rounded-full" /> Low Stock</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-400 rounded-full" /> Out</span>
          </div>
        </div>

        <div className={`grid gap-4 ${view === 'list' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {filteredShops.map((shop, i) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${
                selectedShop?.id === shop.id ? 'border-orange-400 ring-2 ring-orange-100' : 'border-slate-100'
              }`}
              onClick={() => setSelectedShop(shop)}
            >
              {/* Cover */}
              <div className="relative h-36 overflow-hidden">
                <img src={shop.coverImage} alt={shop.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {shop.verified && (
                    <span className="flex items-center gap-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-lg" style={{ fontWeight: 600 }}>
                      <Shield className="w-3 h-3" /> Verified
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-lg ${shop.isOpen ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-200'}`} style={{ fontWeight: 600 }}>
                    {shop.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                {/* Distance */}
                <div className="absolute bottom-3 right-3 bg-white/90 rounded-lg px-2 py-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-500" />
                  <span className="text-slate-800 text-xs" style={{ fontWeight: 700 }}>{shop.distance}km</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-slate-900" style={{ fontWeight: 700 }}>{shop.name}</h3>
                    <p className="text-slate-500 text-xs">{shop.address.split(',').slice(0, 2).join(',')}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 rounded-lg px-2 py-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span className="text-amber-700 text-sm" style={{ fontWeight: 700 }}>{shop.rating}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {shop.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-slate-50 text-slate-600 text-xs px-2 py-0.5 rounded-lg border border-slate-100">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stock */}
                <StockSummary shopId={shop.id} />

                {/* Reviews */}
                <p className="text-slate-400 text-xs mt-1">{shop.reviewCount} verified reviews</p>

                <Link
                  to={`/buyer/shop/${shop.id}`}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm transition-colors"
                  style={{ fontWeight: 700 }}
                  onClick={e => e.stopPropagation()}
                >
                  View Price Board
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600" style={{ fontWeight: 600 }}>No shops found</p>
            <p className="text-slate-400 text-sm mt-1">Try a different search term or clear your filters.</p>
          </div>
        )}

        {/* Gold CTA for non-Gold users */}
        {!user.isGoldMember && (
          <div className="mt-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-6 h-6 text-amber-500" />
              <h3 className="text-amber-800" style={{ fontWeight: 800 }}>Unlock Gold Features</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <ul className="space-y-2">
                {[
                  'Price trend charts for all items',
                  'Price alerts when items drop',
                  'Historical price data',
                  'Watchlist to track favorites'
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-amber-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-amber-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {[
                  'Early demand alerts',
                  'Advanced search filters',
                  'Shop comparison tools',
                  'Priority customer support'
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-amber-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-amber-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl text-sm transition-colors"
              style={{ fontWeight: 700 }}
            >
              <Crown className="w-4 h-4" />
              Upgrade to Gold - ₹49/month
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}