'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      if (!res.ok) {
        setError('Invalid credentials');
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.accessToken);
      document.cookie = `token=${data.accessToken}; path=/; max-age=86400`;
      router.replace('/admin/dashboard');
    } catch (err: any) {
      setError('Network error: Unable to connect to server');
      console.error('Login error:', err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-950 bg-cover bg-center"
      style={{ backgroundImage: "url('/gym-bg.jpg')" }}
    >
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2rem] w-full max-w-md text-white shadow-2xl transition-all">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 mb-2">
            Strive Fitness
          </h1>
          <p className="text-slate-300 font-medium">Please sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white/10 transition-all placeholder:text-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white/10 transition-all placeholder:text-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] text-white py-4 rounded-xl font-bold text-lg"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8">
          Don’t have an account? <span className="text-orange-400 font-semibold cursor-pointer hover:text-orange-300 transition-colors">Contact Admin</span>
        </p>
      </div>
    </div>
  );
}

