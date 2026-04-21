import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Send, Clock, ThumbsUp, CheckCircle, AlertTriangle,
  Search, Filter, Zap, MapPin, TrendingUp, Package
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addDemand, upvoteDemand, DemandAlert } from '../../store/demandSlice';

const CATEGORIES = ['Dairy', 'Eggs', 'Grains', 'Vegetables', 'Oil', 'Pulses', 'Specialty', 'Fruits', 'Other'];
const URGENCY_OPTIONS = ['Low', 'Medium', 'High'] as const;

const urgencyConfig = {
  High: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' },
  Medium: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
  Low: { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', dot: 'bg-slate-400' },
};

const statusConfig = {
  Open: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  Fulfilled: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

export function BuyerDemand() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.user);
  const demands = useAppSelector(s => s.demands);
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({
    item: '',
    description: '',
    category: 'Other',
    urgency: 'Medium' as typeof URGENCY_OPTIONS[number],
    location: 'Koramangala, Bengaluru',
  });
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Open' | 'Fulfilled'>('All');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.item.trim()) return;
    dispatch(addDemand({
      item: form.item,
      description: form.description,
      buyerName: user.name || 'Anonymous',
      location: form.location,
      category: form.category,
      urgency: form.urgency,
    }));
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ item: '', description: '', category: 'Other', urgency: 'Medium', location: 'Koramangala, Bengaluru' });
    }, 2500);
  };

  const handleUpvote = (id: string) => {
    if (!upvoted.has(id)) {
      dispatch(upvoteDemand(id));
      setUpvoted(prev => new Set(prev).add(id));
    }
  };

  const filteredDemands = demands.filter(d => {
    const matchSearch = d.item.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openCount = demands.filter(d => d.status === 'Open').length;
  const totalVotes = demands.reduce((s, d) => s + d.votes, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-orange-500" />
            <span className="text-orange-500 text-sm uppercase tracking-wide" style={{ fontWeight: 700 }}>Demand Board</span>
          </div>
          <h1 className="text-slate-900 mb-2" style={{ fontWeight: 800, fontSize: '1.8rem' }}>Request an Item</h1>
          <p className="text-slate-500">Can't find what you need? Post a request — local vendors see these and stock accordingly.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Active Requests', value: openCount, icon: Bell, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
            { label: 'Community Votes', value: totalVotes, icon: ThumbsUp, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'Items Fulfilled', value: demands.filter(d => d.status === 'Fulfilled').length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`${bg} ${border} border rounded-2xl p-4 text-center`}>
              <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
              <p className="text-slate-900" style={{ fontWeight: 800, fontSize: '1.5rem' }}>{value}</p>
              <p className="text-slate-500 text-xs">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4">
                <h2 className="text-white" style={{ fontWeight: 700 }}>Post a Request</h2>
                <p className="text-orange-100 text-xs mt-0.5">Vendors in your area will see this</p>
              </div>
              <div className="p-5">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-8 text-center"
                    >
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                      </div>
                      <p className="text-slate-900" style={{ fontWeight: 700 }}>Request Posted!</p>
                      <p className="text-slate-500 text-sm mt-1">Vendors in your area have been notified.</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="text-slate-700 text-sm block mb-1.5" style={{ fontWeight: 600 }}>
                          Item Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.item}
                          onChange={e => setForm(f => ({ ...f, item: e.target.value }))}
                          placeholder="e.g. Organic Honey, A2 Milk"
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 text-sm block mb-1.5" style={{ fontWeight: 600 }}>Category</label>
                        <select
                          value={form.category}
                          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all bg-white"
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 text-sm block mb-1.5" style={{ fontWeight: 600 }}>Description</label>
                        <textarea
                          value={form.description}
                          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                          placeholder="Tell vendors more about what you need — quantity, quality preferences, etc."
                          rows={3}
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 text-sm block mb-1.5" style={{ fontWeight: 600 }}>Urgency</label>
                        <div className="grid grid-cols-3 gap-2">
                          {URGENCY_OPTIONS.map(opt => {
                            const cfg = urgencyConfig[opt];
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setForm(f => ({ ...f, urgency: opt }))}
                                className={`py-2 rounded-xl border text-sm transition-all ${
                                  form.urgency === opt
                                    ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                }`}
                                style={{ fontWeight: form.urgency === opt ? 700 : 400 }}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-700 text-sm block mb-1.5" style={{ fontWeight: 600 }}>Your Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={form.location}
                            onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl transition-colors"
                        style={{ fontWeight: 700 }}
                      >
                        <Send className="w-4 h-4" />
                        Post Request
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Demand Feed */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search + Filter */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search demands..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 shadow-sm"
                />
              </div>
              <div className="flex gap-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {(['All', 'Open', 'Fulfilled'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-2 text-sm transition-colors ${
                      filterStatus === s ? 'bg-orange-500 text-white' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                    style={{ fontWeight: filterStatus === s ? 700 : 400 }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {filteredDemands.map((demand, i) => {
              const urgCfg = urgencyConfig[demand.urgency];
              const staCfg = statusConfig[demand.status];
              const hasUpvoted = upvoted.has(demand.id);

              return (
                <motion.div
                  key={demand.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
                    demand.status === 'Fulfilled' ? 'border-emerald-100' : 'border-slate-100 hover:border-orange-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Upvote */}
                    <button
                      onClick={() => handleUpvote(demand.id)}
                      disabled={hasUpvoted || demand.status === 'Fulfilled'}
                      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all flex-shrink-0 ${
                        hasUpvoted
                          ? 'bg-orange-50 border-orange-300 text-orange-600'
                          : demand.status === 'Fulfilled'
                          ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 cursor-pointer'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs" style={{ fontWeight: 700 }}>{demand.votes}</span>
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h3 className="text-slate-900" style={{ fontWeight: 700 }}>{demand.item}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${urgCfg.bg} ${urgCfg.border} ${urgCfg.color}`} style={{ fontWeight: 600 }}>
                            {demand.urgency}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${staCfg.bg} ${staCfg.border} ${staCfg.color}`} style={{ fontWeight: 600 }}>
                            {demand.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm mt-1">{demand.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" /> {demand.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {demand.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {demand.timestamp}
                        </span>
                        <span>by {demand.buyerName}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {filteredDemands.length === 0 && (
              <div className="text-center py-16">
                <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500" style={{ fontWeight: 600 }}>No requests found</p>
                <p className="text-slate-400 text-sm mt-1">Be the first to post a demand request!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
