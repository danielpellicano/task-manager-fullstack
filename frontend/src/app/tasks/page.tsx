// frontend/app/tarefas/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import TaskForm from '../../components/TaskForm';

interface Tarefa {
  id: number;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TarefasPage() {
  const router = useRouter();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(null);

  const fetchTarefas = async () => {
    try {
      const response = await api.get('/tasks');
      setTarefas(response.data);
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchTarefas();
  }, [router]);

  const handleEdit = (tarefa: Tarefa) => {
    setTarefaSelecionada(tarefa);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Minhas Tarefas</h1>

      <TaskForm
        tarefaEditavel={tarefaSelecionada ?? undefined}
        onSubmitSuccess={() => {
          setTarefaSelecionada(null);
          fetchTarefas();
        }}
      />

      <ul className="space-y-4">
        {tarefas.map((tarefa) => (
          <li key={tarefa.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{tarefa.title}</h2>
            <p className="text-sm text-gray-600">{tarefa.description}</p>
            <p className="text-sm mt-2">
              Status: <span className={tarefa.done ? 'text-green-600' : 'text-yellow-600'}>
                {tarefa.done ? 'Concluída' : 'Pendente'}
              </span>
            </p>
            <button
              onClick={() => handleEdit(tarefa)}
              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
            >
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
