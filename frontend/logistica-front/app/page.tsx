"use client";

import React, { useState } from 'react';
import Timeline from '../components/Timeline';

interface Entidade {
  name?: string;
  nome?: string;
  document?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface Historico {
  status: string;
  location: string;
  timestamp: string | Date;
}

interface PacoteData {
  _id: string;
  trackingCode: string;
  description: string;
  type: string;
  status: string;
  sender: Entidade | string;
  recipient: Entidade | string;
  specs: Record<string, string | number>;
  history: Historico[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default function Home() {
  const [codigoDigitado, setCodigoDigitado] = useState<string>('');
  const [pacoteEncontrado, setPacoteEncontrado] = useState<PacoteData | null>(null);
  const [erro, setErro] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [novoStatus, setNovoStatus] = useState<string>('');
  const [novaLocalizacao, setNovaLocalizacao] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  //Regra depreciada que eslint reclama:sonarqube(typescript:S1874)
  //eslint-disable-next-line
  const handleBuscar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!codigoDigitado.trim()) {
      setErro('Por favor, digite um código de rastreio.');
      return;
    }

    setIsLoading(true);
    setErro('');
    setPacoteEncontrado(null);

    try {
      const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/packages/${codigoDigitado}`);

      if (!resposta.ok) {
        throw new Error('Pacote não encontrado ou código inválido.');
      }

      const dadosDoBanco: PacoteData = await resposta.json();
      setPacoteEncontrado(dadosDoBanco);

    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro('Erro ao conectar com o servidor. O backend está rodando?');
      }
    } finally {
      setIsLoading(false);
    }
  };

  //Regra depreciada que eslint reclama:sonarqube(typescript:S1874)
  //eslint-disable-next-line
  const handleAtualizarStatus = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!pacoteEncontrado) return; 

    if (!novoStatus || !novaLocalizacao) {
      alert('Por favor, preencha o novo status e a localização.');
      return;
    }

    setIsUpdating(true);

    try {
      const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/packages/${pacoteEncontrado.trackingCode}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: novoStatus,
          location: novaLocalizacao,
        }),
      });

      if (!resposta.ok) {
        throw new Error('Erro ao atualizar o status do pacote.');
      }

      const pacoteAtualizado: PacoteData = await resposta.json();
      setPacoteEncontrado(pacoteAtualizado);
      setNovoStatus('');
      setNovaLocalizacao('');
      alert('Status atualizado com sucesso!');

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Erro desconhecido ao atualizar status.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const formatarEntidade = (entidade: Entidade | string | null | undefined): string => {
    if (!entidade) return 'Não informado';
    
    if (typeof entidade === 'object') {
      return entidade.name || entidade.nome || 'Nome não informado';
    }
    
    return String(entidade);
  };

  return (
    <main className="max-w-2xl mx-auto px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Rastreamento Rápido</h1>
        <p className="text-gray-500">Acompanhe o status da sua entrega em tempo real</p>
      </div>

      <form onSubmit={handleBuscar} className="mb-10 flex gap-3 shadow-2xl p-2 bg-white rounded-2xl border border-gray-100">
        <input
          type="text"
          placeholder="Digite o código de rastreio (ex: BR-1A2B3C)"
          value={codigoDigitado}
          onChange={(e) => setCodigoDigitado(e.target.value)}
          className="flex-1 p-4 border-none focus:ring-0 focus:outline-none text-lg"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-10 py-4 rounded-xl text-white font-bold transition-all shadow-md active:scale-95 ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? '...' : 'Buscar'}
        </button>
      </form>

      {erro && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <p className="text-red-700">{erro}</p>
        </div>
      )}

      {pacoteEncontrado && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg mb-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{pacoteEncontrado.description}</h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Remetente</p>
                <p className="text-gray-800 font-medium">{formatarEntidade(pacoteEncontrado.sender)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Destinatário</p>
                <p className="text-gray-800 font-medium">{formatarEntidade(pacoteEncontrado.recipient)}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-600">Categoria: <span className="font-medium text-gray-800">{pacoteEncontrado.type}</span></p>
              <p className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                {pacoteEncontrado.status}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-3 text-gray-700">Especificações</h3>
          <ul className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm mb-8 grid grid-cols-2 gap-4">
            {pacoteEncontrado.specs && Object.keys(pacoteEncontrado.specs).length > 0 ? (
              Object.entries(pacoteEncontrado.specs).map(([chave, valor]) => (
                <li key={chave} className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{chave.replace('_', ' ')}</span> 
                  <span className="text-gray-800 font-medium">{String(valor)}</span>
                </li>
              ))
            ) : (
              <li className="col-span-2 text-gray-400 italic text-sm text-center py-4">
                Nenhuma especificação técnica informada.
              </li>
            )}
          </ul>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8 shadow-sm">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
              Atualizar Status do Pacote
            </h3>
            <form onSubmit={handleAtualizarStatus} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="selectNovoStatus" className="text-xs font-semibold text-blue-800 uppercase mb-1">Novo Status</label>
                <select
                  id="selectNovoStatus"
                  value={novoStatus}
                  onChange={(e) => setNovoStatus(e.target.value)}
                  className="p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-gray-800 bg-white"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Em trânsito">Em trânsito</option>
                  <option value="Saiu para entrega">Saiu para entrega</option>
                  <option value="Entregue">Entregue</option>
                  <option value="Aguardando retirada">Aguardando retirada</option>
                  <option value="Retornou ao remetente">Retornou ao remetente</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="inputNovaLocalizacao" className="text-xs font-semibold text-blue-800 uppercase mb-1">Localização Atual</label>
                <input
                  id="inputNovaLocalizacao"
                  type="text"
                  placeholder="Ex: CD São Paulo - SP"
                  value={novaLocalizacao}
                  onChange={(e) => setNovaLocalizacao(e.target.value)}
                  className="p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`px-8 py-3 rounded-xl text-white font-bold transition-all shadow-md active:scale-95 ${
                    isUpdating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isUpdating ? 'Atualizando...' : 'Confirmar Atualização'}
                </button>
              </div>
            </form>
          </div>

          <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2 text-gray-700">Histórico de Movimentação</h3>
          <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
            <Timeline history={pacoteEncontrado.history} />
          </div>
          
        </div>
      )}
    </main>
  );
}