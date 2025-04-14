// frontend/app/login/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/'); // Redireciona para a home se já estiver logado
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.access_token;

      localStorage.setItem('token', token);
      router.push('/tarefas');
    } catch (err) {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 h-screen">
        <img src="https://d3q3w18r1z0nt6.cloudfront.net/images/commons/nw-logo.png" alt="Newway" className='mb-6 logo' />
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Entre na sua conta
                    </h1>
                    <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="nome@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required  />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label className="text-gray-500 dark:text-gray-300">Lembrar me</label>
                                </div>
                            </div>
                            <a href="#" className="text-sm text-white font-medium text-primary-600 hover:underline dark:text-primary-500">Esqueceu sua senha?</a>
                        </div>
                        <button type="submit" className="btn w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 cursor-pointer">Sign in</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                            Não tem uma conta ainda? <a href="/cadastro" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Cadastre-se</a>
                        </p>
                       
                    </form>
                </div>
            </div>
        </div>
        </section>
  );
}