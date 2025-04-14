// frontend/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  email: string;
  sub: number;
  role: string;
  iat: number;
  exp: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
        const decoded = jwtDecode<DecodedToken>(token);
      setUser(decoded);
    } catch (err) {
      console.error('Erro ao decodificar o token:', err);
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo, {user?.email}</h1>
      <p className="mb-4">Perfil: {user?.role}</p>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Sair
      </button>
    </div>
  );
}
