import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Building2,
  ExternalLink,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  MessagesSquare,
  PlusSquare,
  X,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { signOutAdmin } from '../services/api';

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/properties/new', label: 'Add Property', icon: PlusSquare, end: false },
  { to: '/admin/categories', label: 'Categories', icon: FolderKanban, end: false },
  { to: '/admin/enquiries', label: 'Enquiries', icon: MessagesSquare, end: false },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote, end: false },
  { to: '/admin/content', label: 'Website Content', icon: FileText, end: false },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      if (!isSupabaseConfigured || !supabase) {
        navigate('/admin/login', { replace: true });
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;

      if (!data.session) {
        navigate('/admin/login', { replace: true });
        return;
      }

      setUserEmail(data.session.user.email || 'Administrator');
      setChecking(false);
    }

    checkAuth();

    const authListener = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin/login', { replace: true });
      }
    });

    return () => {
      active = false;
      authListener?.data.subscription.unsubscribe();
    };
  }, [navigate]);

  async function handleSignOut() {
    await signOutAdmin();
    navigate('/admin/login', { replace: true });
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-[#0B1C3D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-600">Verifying administrator session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-[#0B1C3D] text-white shrink-0">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-white/10">
          <Building2 className="h-5 w-5 text-[#C6A254] shrink-0" />
          <span className="font-display text-lg font-semibold tracking-tight whitespace-nowrap">
            Ojoa Admin Portal
          </span>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1" aria-label="Administrator navigation">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#132B57] text-[#D9BA74]'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <p className="px-2 text-xs text-slate-400 truncate" title={userEmail}>
            {userEmail}
          </p>
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-sm hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Public Website</span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-300 hover:text-red-200 rounded-sm hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#0B1C3D] text-white border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2.5">
            <Building2 className="h-5 w-5 text-[#C6A254]" />
            <span className="font-display text-lg font-semibold">Ojoa Admin</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-sm border border-white/20"
            aria-label="Toggle admin navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="px-4 pb-4 space-y-1 border-t border-white/10 pt-2">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-[44px] items-center gap-3 px-3 rounded-sm text-sm font-medium ${
                      isActive ? 'bg-[#132B57] text-[#D9BA74]' : 'text-slate-300'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <Link
                to="/"
                className="text-xs text-slate-300 py-2 px-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Public Website
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs text-red-300 py-2 px-3"
              >
                Sign Out
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex h-16 items-center justify-between bg-white border-b border-slate-200 px-8">
          <p className="text-xs font-medium text-slate-500">
            Ojoa Global Homes Limited · Administrator Workspace
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/properties/new"
              className="inline-flex items-center gap-1.5 rounded-sm bg-[#0B1C3D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#132B57] transition-colors whitespace-nowrap"
            >
              <PlusSquare className="h-3.5 w-3.5" />
              <span>Add Property</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
