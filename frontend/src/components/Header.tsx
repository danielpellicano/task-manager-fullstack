// frontend/components/Header.tsx
'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  email: string;
  sub: number;
  role: string;
  iat: number;
  exp: number;
}

export default function Header() {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser(decoded);
    } catch (error) {
      console.error('Erro ao decodificar o token no header:', error);
    }
  }, []);

  if (!user) return null;

  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="/dashboard" className="flex items-center">
            <img src="https://d3q3w18r1z0nt6.cloudfront.net/images/commons/nw-logo.png" alt="Newway" className='logo' />
          </a>
          <div className="flex items-center lg:order-2">
            <span className="text-sm text-gray-700 dark:text-gray-300 mr-4">
              {user.email} ({user.role})
            </span>
            <a href="#" className="text-white">Logout</a>
          </div>
         
        </div>
      </nav>
    </header>
  );
}