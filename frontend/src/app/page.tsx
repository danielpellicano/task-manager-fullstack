'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskPage from './tarefas/page'; // ou mova o conteúdo de `tarefas/page.tsx` para cá

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login'); // Redireciona para login se não tiver token
    }
  }, [router]);

  return <TaskPage />; // Aqui pode ser o seu conteúdo da home diretamente
}
