import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBasket,
  LayoutDashboard,
  MapPin,
  Home,
  Bell,
  Crown,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/userSlice";

export function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((s) => s.user);
  const demands = useAppSelector((s) => s.demands);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const openDemands = demands.filter((d) => d.status === "Open").length;

  const vendorLinks = [
    { to: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];
  const buyerLinks = [
    { to: "/buyer/home", label: "Home", icon: Home },
    { to: "/buyer/explore", label: "Explore", icon: MapPin },
    { to: "/buyer/demand", label: "Request Item", icon: Bell },
  ];

  const links = user.userRole === "Vendor" ? vendorLinks : buyerLinks;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
              <ShoppingBasket className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-slate-900"
                style={{ fontWeight: 700, fontSize: "1.05rem" }}
              >
                BazaarLive
              </span>
              <span
                className="text-orange-500"
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                REAL PRICES. RIGHT NOW.
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  location.pathname === to
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                style={{ fontWeight: location.pathname === to ? 600 : 500 }}
              >
                <Icon className="w-4 h-4" />
                {label}
                {label === "Request Item" && openDemands > 0 && (
                  <span
                    className="ml-1 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5"
                    style={{ fontSize: "0.7rem", fontWeight: 700 }}
                  >
                    {openDemands}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Gold Badge */}
            {user.isGoldMember && (
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span
                  className="text-amber-700"
                  style={{ fontSize: "0.75rem", fontWeight: 700 }}
                >
                  GOLD
                </span>
              </div>
            )}

            {/* Role Badge */}
            <div
              className={`text-xs px-2.5 py-1 rounded-full border ${
                user.userRole === "Vendor"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
              style={{ fontWeight: 600 }}
            >
              {user.userRole}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span
                    className="text-orange-700 text-sm"
                    style={{ fontWeight: 700 }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p
                        className="text-slate-900 text-sm"
                        style={{ fontWeight: 600 }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-slate-500"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-100 mb-2">
                <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-700" style={{ fontWeight: 700 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p
                    className="text-slate-900 text-sm"
                    style={{ fontWeight: 600 }}
                  >
                    {user.name}
                  </p>
                  <p className="text-slate-500" style={{ fontSize: "0.75rem" }}>
                    {user.userRole} {user.isGoldMember ? "• Gold Member" : ""}
                  </p>
                </div>
              </div>
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                    location.pathname === to
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-700"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
