// frontend/app/tarefas/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import TaskForm from '../../components/TaskForm';
import Header from '@/components/Header';
import {jwtDecode} from 'jwt-decode';

interface Tarefa {
  id: number;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface DecodedToken {
  email: string;
  sub: number;
  role: string;
  iat: number;
  exp: number;
}


export default function TaskPage() {
  const router = useRouter();
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(null);
  const [filtro, setFiltro] = useState<'todas' | 'pendentes' | 'concluidas'>('todas');
  const [lastUpdate, setLastUpdate] = useState('');

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

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser(decoded);
    } catch (err) {
      console.error('Token inválido:', err);
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    setLastUpdate(new Date().toLocaleTimeString());
  }, []);

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

  const handleDelete = async (tarefaId: number) => {
    console.log(tarefaId);
    const confirm = window.confirm('Tem certeza que deseja excluir esta tarefa?');
    if (!confirm) return;
  
    try {
      await api.delete(`/tasks/${tarefaId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchTarefas(); // atualiza a lista após excluir
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      alert('Não foi possível excluir a tarefa.');
    }
  };

  const handleToggleDone = async (tarefa: Tarefa) => {
    try {
      const updated = {
        ...tarefa,
        done: !tarefa.done,
      };
  
      await api.patch(`/tasks/${tarefa.id}`, updated, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      fetchTarefas(); // Atualiza a lista após marcar como concluída/não concluída
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      alert('Erro ao marcar tarefa como concluída.');
    }
  };
  
  

  return (
    <>
    <Header />
    <div className="py-8 px-4 mx-auto max-w-screen-xl">

      {user?.role !== 'admin' && (
      <TaskForm
        tarefaEditavel={tarefaSelecionada ?? undefined}
        onSubmitSuccess={() => {
          setTarefaSelecionada(null);
          fetchTarefas();
        }}
      />
      )}

<div className="mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
        <div className="flex flex-row justify-between items-center mb-2">
          <h1 className="text-3xl font-medium">Lista de Tarefas</h1>
          <div className="inline-flex space-x-2 items-center">
  {/* Todas */}
  <button
    onClick={() => setFiltro('todas')}
    className={`p-2 border rounded-md inline-flex space-x-1 items-center ${
      filtro === 'todas'
        ? 'text-indigo-200 bg-indigo-600 hover:bg-indigo-500 hover:text-white'
        : 'text-slate-600 hover:bg-slate-200'
    }`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zM3.75 12h.007v.008H3.75V12zM3.75 17.25h.007v.008H3.75v-.008z" />
    </svg>
    <span className="text-sm hidden md:block">Todas</span>
  </button>

  {/* Pendentes */}
  <button
    onClick={() => setFiltro('pendentes')}
    className={`p-2 border rounded-md inline-flex space-x-1 items-center ${
      filtro === 'pendentes'
        ? 'text-indigo-200 bg-indigo-600 hover:bg-indigo-500 hover:text-white'
        : 'text-slate-600 hover:bg-slate-200'
    }`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span className="text-sm hidden md:block">Pendentes</span>
  </button>

  {/* Concluídas */}
  <button
    onClick={() => setFiltro('concluidas')}
    className={`p-2 border rounded-md inline-flex space-x-1 items-center ${
      filtro === 'concluidas'
        ? 'text-indigo-200 bg-indigo-600 hover:bg-indigo-500 hover:text-white'
        : 'text-slate-600 hover:bg-slate-200'
    }`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
    </svg>
    <span className="text-sm hidden md:block">Concluídas</span>
  </button>
</div>
</div>
        <p className="text-slate-500">Olá, aqui estão suas tarefas</p>

        <div id="tasks" className="my-5 space-y-1">
        {tarefas
        .filter((t) =>
          filtro === 'todas' ? true : filtro === 'pendentes' ? !t.done : t.done
        )
        .map((tarefa) => (
            <div
              key={tarefa.id}
              className={`flex justify-between items-center border-b border-slate-200 py-3 px-2 border-l-4 ${
                tarefa.done ? 'border-l-indigo-300 bg-gradient-to-r from-indigo-100 to-transparent' : 'border-l-transparent hover:from-slate-100 bg-gradient-to-r from-transparent to-transparent'
              } transition ease-linear duration-150`}
            >
              <div className="inline-flex items-center space-x-2 xxx">
               <div onClick={() => handleToggleDone(tarefa)} className="cursor-pointer">
                  {tarefa.done ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-500 hover:text-indigo-600 hover:cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className={`text-slate-700 ${tarefa.done ? 'line-through text-slate-500' : ''}`}>
                  <div className="font-semibold">{tarefa.title}  {user?.role === 'admin' && (
    <span className="text-gray-500 text-sm ml-2">({tarefa.user.name})</span>
  )}</div>
                  <div className="text-sm text-slate-500">{tarefa.description}</div>
                  <div className="text-xs mt-1">
                    Status:{' '}
                    <span className={tarefa.done ? 'text-green-600' : 'text-yellow-600'}>
                      {tarefa.done ? 'Concluída' : 'Pendente'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Botão editar */}
                <button onClick={() => handleEdit(tarefa)} title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500 hover:text-blue-700 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3zM3 21h18" />
                  </svg>
                </button>

                {/* Botão excluir */}
                <button onClick={() => handleDelete(tarefa.id)} title="Excluir">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-500 hover:text-red-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21L18.16 19.673A2.25 2.25 0 0115.916 21H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79M19.228 5.79a48.11 48.11 0 00-3.478-.397m-12 .562a48.108 48.108 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {lastUpdate && (
          <p className="text-xs text-slate-500 text-center">Última atualização {lastUpdate}</p>
        )}
      </div>
    </div>

    </>
  );
}
