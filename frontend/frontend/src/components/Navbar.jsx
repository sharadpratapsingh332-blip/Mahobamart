
import { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import {
  Search,
  MapPin,
  ShoppingBag,
  BadgeIndianRupee,
  LayoutDashboard,
  House,
  UserRound,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      setResults(null);
      return;
    }

    try {
      const res = await api.get(
        `/search?keyword=${encodeURIComponent(value)}`
      );
      setResults(res.data);
    } catch (error) {
      console.log("Search error:", error);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setResults(null);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
        {/* Top Navbar */}
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex shrink-0 items-center gap-2"
          >
           
<img
  src="/mahobamart-logo.png"
  alt="MahobaMart Logo"
  className="h-16 w-auto max-w-[190px] object-contain sm:h-12 sm:max-w-[240px]"
/>

            
          </Link>

          {/* Desktop Search */}
          <div className="relative mx-4 hidden max-w-lg flex-1 lg:block">
            <div className="flex items-center rounded-full bg-gray-100 px-4 py-3">
              <Search size={19} className="shrink-0 text-gray-500" />
              <input
                value={search}
                onChange={handleSearch}
                placeholder="Search for food, grocery, medicine..."
                className="ml-3 w-full bg-transparent text-sm outline-none"
              />
            </div>

            {results && (
              <SearchResults
                results={results}
                clearSearch={clearSearch}
              />
            )}
          </div>

          {/* Desktop Location */}
          <div className="hidden shrink-0 items-center gap-2 text-sm text-gray-700 xl:flex">
            <MapPin size={20} />
            <span>Mahoba, Uttar Pradesh</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden shrink-0 items-center gap-4 lg:flex xl:gap-5">
            <Link
              to="/"
              className="flex items-center gap-1 text-sm font-medium hover:text-green-600"
            >
              <House size={20} />
              Home
            </Link>

            <Link
              to="/orders"
              className="flex items-center gap-1 text-sm font-medium hover:text-green-600"
            >
              <ShoppingBag size={20} />
              Orders
            </Link>

            <Link
              to="/offers"
              className="flex items-center gap-1 text-sm font-medium hover:text-green-600"
            >
              <BadgeIndianRupee size={20} />
              Offers
            </Link>

            {user?.role === "shop" && (
              <Link
                to="/shop-dashboard"
                className="flex items-center gap-1 text-sm font-medium hover:text-green-600"
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1 text-sm font-medium hover:text-green-600"
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
            )}

            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-green-600 px-3 py-2 text-sm font-medium text-green-700"
              >
                <UserRound size={19} />
                Profile
                <ChevronDown size={15} />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-lg border border-green-600 px-3 py-2 text-sm text-green-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            {user && (
              <Link
                to="/profile"
                aria-label="Profile"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-700"
              >
                <UserRound size={22} />
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-800"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search: mobile and tablet */}
        <div className="relative px-3 pb-3 lg:hidden sm:px-5">
          <div className="flex items-center rounded-full bg-gray-100 px-4 py-3">
            <Search size={19} className="shrink-0 text-gray-500" />
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search products..."
              className="ml-3 min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          {results && (
            <SearchResults
              results={results}
              clearSearch={clearSearch}
            />
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="border-t border-gray-100 bg-white p-4 lg:hidden">
            <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={18} className="text-green-600" />
              Mahoba, Uttar Pradesh
            </div>

            <nav className="grid grid-cols-2 gap-2">
              <MobileLink to="/" icon={House} onClick={closeMenu}>
                Home
              </MobileLink>

              <MobileLink to="/orders" icon={ShoppingBag} onClick={closeMenu}>
                My Orders
              </MobileLink>

              <MobileLink
                to="/offers"
                icon={BadgeIndianRupee}
                onClick={closeMenu}
              >
                Offers
              </MobileLink>

              {user && (
                <MobileLink
                  to="/profile"
                  icon={UserRound}
                  onClick={closeMenu}
                >
                  My Profile
                </MobileLink>
              )}

              {user?.role === "shop" && (
                <MobileLink
                  to="/shop-dashboard"
                  icon={LayoutDashboard}
                  onClick={closeMenu}
                >
                  Dashboard
                </MobileLink>
              )}

              {user?.role === "admin" && (
                <MobileLink
                  to="/admin/dashboard"
                  icon={LayoutDashboard}
                  onClick={closeMenu}
                >
                  Dashboard
                </MobileLink>
              )}

              {!user && (
                <>
                  <MobileLink
                    to="/login"
                    icon={UserRound}
                    onClick={closeMenu}
                  >
                    Login
                  </MobileLink>

                  <MobileLink
                    to="/register"
                    icon={UserRound}
                    onClick={closeMenu}
                  >
                    Sign Up
                  </MobileLink>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-gray-200 bg-white px-1 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-3px_12px_rgba(0,0,0,0.05)] lg:hidden">
        <BottomLink to="/" icon={House} label="Home" />
        <BottomLink to="/orders" icon={ShoppingBag} label="Orders" />
        <BottomLink
          to="/offers"
          icon={BadgeIndianRupee}
          label="Offers"
        />
        <BottomLink
          to={user ? "/profile" : "/login"}
          icon={UserRound}
          label={user ? "Profile" : "Login"}
        />
      </nav>
    </>
  );
};

const SearchResults = ({ results, clearSearch }) => {
  const products = results.products || [];
  const shops = results.shops || [];
  const categories = results.categories || [];

  return (
    <div className="absolute left-0 top-full z-[60] mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-gray-100 bg-white p-3 shadow-xl">
      {products.length > 0 && (
        <div>
          <h3 className="mb-2 font-bold text-green-600">Products</h3>
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              onClick={clearSearch}
              className="flex items-center gap-3 border-b py-2 hover:bg-gray-50"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-10 w-10 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {shops.length > 0 && (
        <div className="mt-3">
          <h3 className="mb-2 font-bold text-blue-600">Shops</h3>
          {shops.map((shop) => (
            <Link
              key={shop._id}
              to={`/shop/${shop._id}`}
              onClick={clearSearch}
              className="block border-b py-2 text-sm hover:bg-gray-50"
            >
              {shop.name}
            </Link>
          ))}
        </div>
      )}

      {categories.length > 0 && (
        <div className="mt-3">
          <h3 className="mb-2 font-bold text-purple-600">Categories</h3>
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/category/${category._id}`}
              onClick={clearSearch}
              className="block border-b py-2 text-sm hover:bg-gray-50"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 &&
        shops.length === 0 &&
        categories.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-500">
            No results found
          </p>
        )}
    </div>
  );
};

const MobileLink = ({ to, icon: Icon, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 text-sm font-medium hover:bg-green-50"
  >
    <Icon size={19} className="text-green-700" />
    {children}
  </Link>
);

const BottomLink = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="flex min-w-0 flex-col items-center gap-1 py-1 text-xs font-medium text-gray-600 hover:text-green-700"
  >
    <Icon size={22} />
    <span>{label}</span>
  </Link>
);

export default Navbar;