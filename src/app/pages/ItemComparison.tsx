import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  ArrowLeft, TrendingDown, TrendingUp, MapPin, Star, 
  CheckCircle, AlertTriangle, XCircle, Crown, Lock,
  Plus, Eye
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { shops } from '../../data/mockData';
import { Product } from '../../store/productSlice';

const stockConfig = {
  'In Stock': { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle },
  'Low': { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle },
  'Out': { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
};

export function ItemComparison() {
  const { itemName } = useParams<{ itemName: string }>();
  const allProducts = useAppSelector(s => s.products);
  const user = useAppSelector(s => s.user);
  
  const [watchlisted, setWatchlisted] = useState(false);

  if (!itemName) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600" style={{ fontWeight: 600 }}>Item not found</p>
          <Link to="/buyer/explore" className="text-orange-500 text-sm mt-2 inline-block">Back to Explore</Link>
        </div>
      </div>
    );
  }

  const decodedItemName = decodeURIComponent(itemName);
  const itemProducts = allProducts.filter(p => p.name === decodedItemName);
  
  if (itemProducts.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600" style={{ fontWeight: 600 }}>No shops found selling "{decodedItemName}"</p>
          <Link to="/buyer/explore" className="text-orange-500 text-sm mt-2 inline-block">Back to Explore</Link>
        </div>
      </div>
    );
  }

  // Sort by price (ascending) and filter out out-of-stock items for best deal calculation
  const inStockProducts = itemProducts.filter(p => p.stockStatus !== 'Out');
  const sortedProducts = [...itemProducts].sort((a, b) => a.currentPrice - b.currentPrice);
  const minPrice = Math.min(...inStockProducts.map(p => p.currentPrice));
  const maxPrice = Math.max(...itemProducts.map(p => p.currentPrice));
  const avgPrice = itemProducts.reduce((sum, p) => sum + p.currentPrice, 0) / itemProducts.length;

  const handleWatchlist = () => {
    if (!user.isGoldMember) {
      // Show Gold gate - in a real app this would be a modal
      alert('Watchlist is a Gold feature. Upgrade to Gold to save items to your watchlist!');
      return;
    }
    setWatchlisted(!watchlisted);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/buyer/explore"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm" style={{ fontWeight: 500 }}>Back to Explore</span>
          </Link>
        </div>

        {/* Item Header */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-slate-900 mb-2" style={{ fontWeight: 800, fontSize: '1.8rem' }}>
                {decodedItemName}
              </h1>
              <p className="text-slate-500 mb-4">Comparing prices across {itemProducts.length} nearby shops</p>
              
              {/* Price Range Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                  <span>₹{minPrice}</span>
                  <span className="text-slate-400">Price Range</span>
                  <span>₹{maxPrice}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-red-400 rounded-full"
                    style={{ width: '100%' }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-md"
                    style={{ left: `${((avgPrice - minPrice) / (maxPrice - minPrice)) * 100}%` }}
                    title={`Average: ₹${avgPrice.toFixed(0)}`}
                  />
                </div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-slate-400">Avg: ₹{avgPrice.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* Watchlist Button */}
            <button
              onClick={handleWatchlist}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                watchlisted 
                  ? 'bg-orange-50 border-orange-300 text-orange-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'
              }`}
              style={{ fontWeight: 600 }}
            >
              {!user.isGoldMember && <Crown className="w-4 h-4" />}
              <Eye className="w-4 h-4" />
              {watchlisted ? 'Watching' : 'Watch Item'}
            </button>
          </div>
        </div>

        {/* Shop Comparison List */}
        <div className="space-y-3">
          {sortedProducts.map((product, index) => {
            const shop = shops.find(s => s.id === product.shopId);
            if (!shop) return null;

            const cfg = stockConfig[product.stockStatus];
            const isLowest = product.currentPrice === minPrice && product.stockStatus !== 'Out';
            const isHighest = product.currentPrice === maxPrice;
            const priceDiff = product.currentPrice - minPrice;
            const priceDiffPercent = minPrice > 0 ? ((priceDiff / minPrice) * 100) : 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
                  isLowest ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Shop Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <img 
                        src={shop.coverImage} 
                        alt={shop.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      {isLowest && (
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full" style={{ fontWeight: 700 }}>
                          BEST
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-slate-900" style={{ fontWeight: 700 }}>{shop.name}</h3>
                        {shop.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {shop.distance}km away
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {shop.rating}
                        </span>
                        <span className={`flex items-center gap-1 ${cfg.color}`}>
                          <cfg.icon className="w-3 h-3" />
                          {product.stockStatus}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-400 mt-1">Updated {product.lastUpdated}</p>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`text-2xl ${isLowest ? 'text-emerald-600' : isHighest ? 'text-red-500' : 'text-slate-900'}`} style={{ fontWeight: 800 }}>
                        ₹{product.currentPrice}
                      </div>
                      <span className="text-slate-400 text-sm">/{product.unit}</span>
                    </div>
                    
                    {priceDiff > 0 && (
                      <div className="flex items-center gap-1 text-xs text-red-500">
                        <TrendingUp className="w-3 h-3" />
                        +₹{priceDiff} ({priceDiffPercent.toFixed(0)}% more)
                      </div>
                    )}
                    
                    {isLowest && inStockProducts.length > 1 && (
                      <div className="flex items-center gap-1 text-xs text-emerald-600" style={{ fontWeight: 600 }}>
                        <TrendingDown className="w-3 h-3" />
                        Best Deal
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <Link
                    to={`/buyer/shop/${shop.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    View Shop Details
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Gold CTA for non-Gold users */}
        {!user.isGoldMember && (
          <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-6 h-6 text-amber-500" />
              <h3 className="text-amber-800" style={{ fontWeight: 800 }}>Unlock Gold Features</h3>
            </div>
            <ul className="space-y-2 mb-4">
              {[
                'Price trend charts for this item',
                'Price alerts when it drops',
                'Historical price data',
                'Watchlist to track favorites'
              ].map(feature => (
                <li key={feature} className="flex items-center gap-2 text-amber-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl text-sm transition-colors"
              style={{ fontWeight: 700 }}
            >
              <Crown className="w-4 h-4" />
              Upgrade to Gold - ₹49/month
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}