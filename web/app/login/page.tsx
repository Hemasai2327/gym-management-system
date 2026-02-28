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

    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError('Invalid credentials');
      return;
    }

    const data = await res.json();
    localStorage.setItem('token', data.accessToken);
    router.replace('/admin/dashboard');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/gym-bg.jpg')" }}
    >
      <div className="bg-black/70 backdrop-blur-lg p-10 rounded-2xl w-95 text-white shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2">Strive Fitness</h1>
        <p className="text-gray-300 text-center mb-6">
          Please sign in to your account
        </p>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 rounded bg-white/10 border border-white/20 mb-4 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-white/10 border border-white/20 mb-4 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-lg font-semibold"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account? <span className="text-orange-400">Sign Up</span>
        </p>
      </div>
    </div>
  );
}
