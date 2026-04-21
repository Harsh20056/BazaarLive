import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search as SearchIcon, MapPin, Star, Package, ArrowRight,
  Clock, TrendingUp, X, Filter
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { shops } from '../../data/mockData';

interface SearchResult {
  type: 'shop' | 'item';
  id: string;
  name: string;
  description: string;
  image?: string;
  rating?: number;
  distance?: number;
  price?: number;
  unit?: string;
  shopCount?: number;
  category?: string;
}

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(true);
  
  const allProducts = useAppSelector(s => s.products);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('bazaar-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowRecent(true);
      return;
    }

    setShowRecent(false);
    setLoading(true);

    // Debounce search
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = (searchQuery: string) => {
    const lowerQuery = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search shops
    shops.forEach(shop => {
      const matchesName = shop.name.toLowerCase().includes(lowerQuery);
      const matchesTags = shop.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
      const matchesOwner = shop.owner.toLowerCase().includes(lowerQuery);
      
      if (matchesName || matchesTags || matchesOwner) {
        searchResults.push({
          type: 'shop',
          id: shop.id,
          name: shop.name,
          description: `${shop.address} • ${shop.tags.join(', ')}`,
          image: shop.coverImage,
          rating: shop.rating,
          distance: shop.distance,
        });
      }
    });

    // Search items (group by item name)
    const itemGroups: Record<string, { 
      name: string; 
      category: string; 
      prices: number[]; 
      units: string[];
      shopCount: number;
    }> = {};

    allProducts.forEach(product => {
      const matchesName = product.name.toLowerCase().includes(lowerQuery);
      const matchesCategory = product.category.toLowerCase().includes(lowerQuery);
      
      if (matchesName || matchesCategory) {
        if (!itemGroups[product.name]) {
          itemGroups[product.name] = {
            name: product.name,
            category: product.category,
            prices: [],
            units: [],
            shopCount: 0,
          };
        }
        
        itemGroups[product.name].prices.push(product.currentPrice);
        if (!itemGroups[product.name].units.includes(product.unit)) {
          itemGroups[product.name].units.push(product.unit);
        }
        itemGroups[product.name].shopCount++;
      }
    });

    // Convert item groups to search results
    Object.values(itemGroups).forEach(item => {
      const minPrice = Math.min(...item.prices);
      const maxPrice = Math.max(...item.prices);
      const priceRange = minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice}-${maxPrice}`;
      
      searchResults.push({
        type: 'item',
        id: item.name,
        name: item.name,
        description: `${item.category} • ${priceRange}/${item.units[0]} • ${item.shopCount} shops`,
        price: minPrice,
        unit: item.units[0],
        shopCount: item.shopCount,
        category: item.category,
      });
    });

    // Sort results: exact matches first, then by relevance
    searchResults.sort((a, b) => {
      const aExact = a.name.toLowerCase() === lowerQuery;
      const bExact = b.name.toLowerCase() === lowerQuery;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Then by type (shops first)
      if (a.type !== b.type) {
        return a.type === 'shop' ? -1 : 1;
      }
      
      return a.name.localeCompare(b.name);
    });

    setResults(searchResults);
    setLoading(false);
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setQuery(searchQuery);
    
    // Add to recent searches
    const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('bazaar-recent-searches', JSON.stringify(newRecent));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('bazaar-recent-searches');
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-orange-100 text-orange-800 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-slate-900 mb-4" style={{ fontWeight: 800, fontSize: '1.8rem' }}>
            Search Shops & Items
          </h1>
          
          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for shops, items, or categories..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-sm"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Recent Searches */}
          {showRecent && recentSearches.length > 0 && (
            <motion.div
              key="recent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-slate-700" style={{ fontWeight: 600 }}>Recent Searches</h2>
                <button
                  onClick={clearRecentSearches}
                  className="text-slate-400 hover:text-slate-600 text-sm"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
                  >
                    <Clock className="w-3 h-3" />
                    {search}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-500">Searching...</p>
            </motion.div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-slate-700" style={{ fontWeight: 600 }}>
                  Search Results ({results.length})
                </h2>
              </div>

              {/* Group results by type */}
              {['shop', 'item'].map(type => {
                const typeResults = results.filter(r => r.type === type);
                if (typeResults.length === 0) return null;

                return (
                  <div key={type} className="mb-8">
                    <h3 className="text-slate-600 text-sm uppercase tracking-wide mb-4" style={{ fontWeight: 700 }}>
                      {type === 'shop' ? 'Shops' : 'Items'} ({typeResults.length})
                    </h3>
                    
                    <div className="space-y-3">
                      {typeResults.map((result, index) => (
                        <motion.div
                          key={`${result.type}-${result.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          {result.type === 'shop' ? (
                            <Link
                              to={`/buyer/shop/${result.id}`}
                              className="block bg-white rounded-2xl border border-slate-100 p-5 hover:border-orange-200 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-4">
                                {result.image && (
                                  <img
                                    src={result.image}
                                    alt={result.name}
                                    className="w-16 h-16 rounded-xl object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h4 className="text-slate-900 mb-1" style={{ fontWeight: 700 }}>
                                    {highlightMatch(result.name, query)}
                                  </h4>
                                  <p className="text-slate-500 text-sm mb-2">
                                    {highlightMatch(result.description, query)}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-slate-400">
                                    {result.distance && (
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {result.distance}km away
                                      </span>
                                    )}
                                    {result.rating && (
                                      <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        {result.rating}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400" />
                              </div>
                            </Link>
                          ) : (
                            <Link
                              to={`/buyer/compare/${encodeURIComponent(result.name)}`}
                              className="block bg-white rounded-2xl border border-slate-100 p-5 hover:border-orange-200 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                                  <Package className="w-8 h-8 text-slate-400" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-slate-900 mb-1" style={{ fontWeight: 700 }}>
                                    {highlightMatch(result.name, query)}
                                  </h4>
                                  <p className="text-slate-500 text-sm mb-2">
                                    {highlightMatch(result.description, query)}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                      <TrendingUp className="w-3 h-3" />
                                      From ₹{result.price}
                                    </span>
                                    <span>{result.shopCount} shops nearby</span>
                                  </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400" />
                              </div>
                            </Link>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* No Results */}
          {!loading && query && results.length === 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-16"
            >
              <SearchIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-slate-600 mb-2" style={{ fontWeight: 600 }}>
                No results found for "{query}"
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Try searching for different keywords or check your spelling.
              </p>
              <div className="space-y-2 text-sm text-slate-500">
                <p>Try searching for:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Milk', 'Rice', 'Green Basket', 'Organic', 'Vegetables'].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => handleSearch(suggestion)}
                      className="bg-slate-100 hover:bg-orange-50 hover:text-orange-600 px-3 py-1 rounded-lg transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}