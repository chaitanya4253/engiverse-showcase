import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, Key, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/v1/auth/setup-status')
      .then(res => res.json())
      .then(data => {
        setIsConfigured(data.isConfigured);
        setLoading(false);
      })
      .catch(() => {
        setIsConfigured(true);
        setLoading(false);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      setSuccessMsg('Authentication successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 800);
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative z-10">
      <div className="w-full max-w-md glass-panel border border-cyan-500/40 rounded-3xl p-8 shadow-2xl bg-gray-950/90 relative overflow-hidden">
        
        {/* Glow pill */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>

        <div className="text-center space-y-3 mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-black text-white tracking-wide">
            Engiverse Admin Portal
          </h2>
          <p className="text-xs text-gray-400 font-mono">
            Direct Database Authenticated Administrative Access
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {!isConfigured && isConfigured !== null && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs space-y-2 font-mono">
            <div className="flex items-center space-x-2 font-bold text-amber-300">
              <Terminal className="w-4 h-4 shrink-0" />
              <span>Direct Database Admin Setup Required:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-300">
              Web-based registration is disabled for security compliance. To create an admin account directly in the database, run:
            </p>
            <div className="p-2 rounded bg-black border border-amber-500/30 text-cyan-400 text-[11px] select-all">
              npm run create-admin
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">Username or Email</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3.5 text-gray-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="engiverse_lead"
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3.5 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Secure Admin Login</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
