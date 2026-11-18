import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { BrandLogo } from '../../components/BrandLogo';
import { SeoHead } from '../../components/SeoHead';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { signInAdmin } from '../../services/api';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          navigate('/admin', { replace: true });
        }
      });
    }
  }, [navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInAdmin(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Sign-in failed. Please verify your administrator credentials.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SeoHead
        title="Admin Login | Ojoa Global Homes Limited"
        description="Secure administrator sign-in for Ojoa Global Homes Limited property management."
      />

      <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block mb-4">
              <BrandLogo variant="dark" />
            </Link>
            <h1 className="font-display text-3xl font-semibold text-[#0B1C3D]">
              Administrator Sign In
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Authorized staff access for property, enquiry, and content management.
            </p>
          </div>

          <div className="rounded-sm border border-slate-200 bg-white p-8">
            {!isSupabaseConfigured && (
              <div className="mb-6 rounded-sm border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 space-y-1.5">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Supabase Configuration Required</span>
                </p>
                <p className="leading-relaxed">
                  Set <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
                  <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> in your environment variables, run <code className="font-mono">supabase/schema.sql</code>, and create your admin user in Supabase Authentication.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold text-[#0B1C3D] mb-1.5"
                >
                  Administrator Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ojoaglobalhomes.com"
                  className="w-full min-h-[44px] rounded-sm border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0B1C3D] focus:outline-none focus:ring-1 focus:ring-[#0B1C3D]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-[#0B1C3D] mb-1.5"
                >
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full min-h-[44px] rounded-sm border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0B1C3D] focus:outline-none focus:ring-1 focus:ring-[#0B1C3D]"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !isSupabaseConfigured}
                className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-sm bg-[#0B1C3D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#132B57] transition-colors disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                <span>{loading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#0B1C3D]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Ojoa Global Homes Website</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
