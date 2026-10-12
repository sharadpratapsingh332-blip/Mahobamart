
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import api from "../api/axios";

import {
  House,
  ShoppingBag,
  MapPin,
  UserRound,
  Settings,
  LogOut,
  Pencil,
  Mail,
  ChevronRight,
  Camera,
  Menu,
  X,
} from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(
        "/auth/profile",
        { withCredentials: true }
      );

      setUser(res.data.user || {});
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const name = user?.name || "Your Name";
  const email = user?.email || "your@email.com";
  const role = user?.role || "customer";
  const address = user?.address || "Mahoba, Uttar Pradesh";

  const menuItems = [
    { label: "Home", icon: House, to: "/" },
    { label: "My Orders", icon: ShoppingBag, to: "/orders" },
    { label: "Track Order", icon: MapPin, to: "/orders" },
    { label: "Profile", icon: UserRound, to: "/profile" },
    { label: "Settings", icon: Settings, to: "/settings" },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f9fc] text-slate-800">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex h-[64px] items-center justify-between gap-2 px-3 sm:h-[76px] sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="shrink-0 rounded-lg p-2 hover:bg-gray-100 lg:hidden"
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link to="/" className="flex min-w-0 items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-xl font-black text-white sm:h-11 sm:w-11 sm:text-2xl">
                M
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-extrabold tracking-tight sm:text-2xl">
                  <span className="text-emerald-600">Mahoba</span>Mart
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Local Delivery, Local Support
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden max-w-md flex-1 items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-3 lg:flex">
            <SearchIcon />
            <input
              placeholder="Search for food, grocery, medicine..."
              className="ml-3 w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="hidden items-center gap-2 text-sm font-medium text-slate-600 xl:flex">
            <MapPin size={19} className="text-slate-900" />
            Mahoba, Uttar Pradesh
          </div>

          <Link
            to="/profile"
            className="flex shrink-0 items-center gap-1 rounded-full p-1 sm:gap-2 sm:p-1.5 hover:bg-slate-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 sm:h-10 sm:w-10">
              <UserRound size={22} />
            </div>
            <ChevronRight
              size={16}
              className="hidden rotate-90 sm:block"
            />
          </Link>
        </div>
      </header>

      <div className="relative flex">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <button
            aria-label="Close navigation"
            onClick={closeSidebar}
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed bottom-0 left-0 top-[64px] z-40 w-[min(280px,85vw)] overflow-y-auto border-r border-slate-200 bg-white p-3 transition-transform duration-300 sm:top-[76px] sm:p-4 lg:sticky lg:top-[76px] lg:z-20 lg:h-[calc(100vh-76px)] lg:w-64 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-5 rounded-xl bg-emerald-50 p-4 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <UserRound size={25} />
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold">{name}</p>
                <p className="truncate text-xs text-slate-500">{email}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map(({ label, icon: Icon, to }) => (
              <Link
                key={label}
                to={to}
                onClick={closeSidebar}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition sm:gap-4 sm:px-4 ${
                  label === "Profile"
                    ? "border-l-2 border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 sm:gap-4 sm:px-4"
            >
              <LogOut size={20} />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-3 sm:p-5 md:p-6 lg:p-7">
          <div className="mx-auto max-w-[1500px]">
            {/* Profile Banner */}
            <section className="relative overflow-hidden rounded-xl border border-emerald-50 bg-gradient-to-r from-emerald-50 via-white to-green-50 p-6 sm:p-8">
              <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-emerald-700 shadow-md sm:h-36 sm:w-36">
                    <UserRound size={70} strokeWidth={1.4} />
                  </div>
                  <button
                    title="Change profile photo"
                    onClick={() => alert("Profile photo upload can be added next.")}
                    className="absolute bottom-1 right-0 rounded-full border-2 border-white bg-emerald-700 p-2.5 text-white shadow"
                  >
                    <Camera size={18} />
                  </button>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    {name}
                  </h2>
                  <span className="mt-3 inline-block rounded-full bg-emerald-200 px-4 py-1.5 text-sm font-semibold capitalize text-emerald-900">
                    {role}
                  </span>

                  <div className="mt-4 space-y-2 text-sm text-slate-600 sm:text-base">
                    <p className="flex items-center gap-3 break-all">
                      <Mail size={18} />
                      {email}
                    </p>
                    <p className="flex items-center gap-3">
                      <MapPin size={18} />
                      {address}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    document.getElementById("personal-information")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white shadow-sm hover:bg-emerald-800"
                >
                  <Pencil size={18} />
                  Edit Profile
                </button>
              </div>

              <div className="pointer-events-none absolute -right-10 -top-12 h-56 w-56 rounded-full bg-emerald-100/50 blur-3xl" />
            </section>
            {/* Personal Information */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 xl:grid-cols-[1.15fr_1fr]">
              <div className="min-w-0 space-y-4 sm:space-y-5">
                <section
                  id="personal-information"
                  className="scroll-mt-20 w-full rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"
                >
                  <SectionTitle
                    icon={UserRound}
                    title="Personal Information"
                  />

                  <div className="mt-5 space-y-0 sm:mt-6">
                    <InfoRow label="Full Name" value={name} />
                    <InfoRow label="Email" value={email} />
                    <InfoRow
                      label="Phone"
                      value={user?.phone || "Not added"}
                    />
                    <InfoRow label="Location" value={address} />
                    <InfoRow
                      label="Account Role"
                      value={
                        <span className="capitalize">{role}</span>
                      }
                    />
                  </div>
                </section>

                {/* Local Support Card */}
                <section className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4 sm:p-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 sm:h-14 sm:w-14">
                      <ShoppingBag size={26} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-emerald-950 sm:text-base">
                        Support Local Shop, Grow Together!
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Your orders help local shops and businesses in
                        Mahoba. Thank you for shopping locally. 💚
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SearchIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

const SectionTitle = ({ icon: Icon, title }) => (
  <h2 className="flex items-center gap-3 text-base font-bold text-slate-800 sm:text-lg">
    <Icon size={22} className="shrink-0 text-emerald-700" />
    {title}
  </h2>
);

const InfoRow = ({ label, value }) => (
  <div className="grid grid-cols-[minmax(90px,0.7fr)_minmax(0,1.3fr)] gap-3 border-b border-slate-100 py-3 text-sm last:border-0 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-4 sm:py-4 sm:text-base">
    <span className="text-slate-500">{label}</span>
    <span className="break-words font-medium text-slate-700">
      {value}
    </span>
  </div>
);

export default Profile;

