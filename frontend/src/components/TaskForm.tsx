// frontend/components/TarefaForm.tsx
'use client';

import { useState, useEffect } from 'react';
import api from '../app/lib/api';

interface Props {
  onSubmitSuccess: () => void;
  tarefaEditavel?: {
    id: number;
    title: string;
    description?: string;
  };
}

export default function TaskForm({ onSubmitSuccess, tarefaEditavel }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (tarefaEditavel) {
      setTitle(tarefaEditavel.title);
      setDescription(tarefaEditavel.description || '');
    }
  }, [tarefaEditavel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (tarefaEditavel) {
        await api.patch(`/tasks/${tarefaEditavel.id}`, { title, description });
      } else {
        await api.post('/tasks', { title, description });
      }

      setTitle('');
      setDescription('');
      onSubmitSuccess();
    } catch (err) {
      console.error('Erro ao salvar tarefa:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {tarefaEditavel ? 'Editar Tarefa' : 'Nova Tarefa'}
      </h2>

      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <textarea
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {tarefaEditavel ? 'Atualizar' : 'Criar'}
      </button>
    </form>
  );
}
