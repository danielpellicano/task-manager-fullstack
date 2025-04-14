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
            <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              TaskManager
            </span>
          </a>
          <div className="flex items-center lg:order-2">
            <span className="text-sm text-gray-700 dark:text-gray-300 mr-4">
              {user.email} ({user.role})
            </span>
          </div>
          <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <a href="/dashboard" className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white" aria-current="page">Dashboard</a>
              </li>
              <li>
                <a href="/tarefas" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Tarefas</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}