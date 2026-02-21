"use client";

import { useState } from 'react';
import Timeline from '../components/Timeline';

export default function Home() {
  // 1. Estados da nossa aplicação
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [pacoteEncontrado, setPacoteEncontrado] = useState(null);
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. Função assíncrona para buscar na API real
  const handleBuscar = async (e) => {
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

      const dadosDoBanco = await resposta.json();
      setPacoteEncontrado(dadosDoBanco);

    } catch (error) {
      setErro(error.message || 'Erro ao conectar com o servidor. O backend está rodando?');
    } finally {
      setIsLoading(false);
    }
  };

  // Função auxiliar para renderizar campos que podem ser objetos (como Remetente/Destinatário)
  const formatarEntidade = (entidade) => {
    if (!entidade) return 'Não informado';
    if (typeof entidade === 'object') {
      return entidade.name || entidade.nome || 'Nome não informado';
    }
    return entidade;
  };

  // 3. A Interface (UM único return para toda a tela)
  return (
    <main className="p-8 font-sans max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-900">Rastreamento Rápido</h1>

      {/* A Barra de Pesquisa */}
      <form onSubmit={handleBuscar} className="mb-8 flex gap-3 shadow-sm">
        <input
          type="text"
          placeholder="Digite o código de rastreio (ex: BR-99887766-LOG)"
          value={codigoDigitado}
          onChange={(e) => setCodigoDigitado(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-8 py-3 rounded-lg text-white font-semibold transition-colors ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {/* Feedback de Erro */}
      {erro && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <p className="text-red-700">{erro}</p>
        </div>
      )}

      {/* Condicional: Só renderiza as informações SE um pacote foi encontrado */}
      {pacoteEncontrado && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Card Principal */}
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

          {/* Especificações Dinâmicas */}
          <h3 className="text-lg font-bold mb-3 text-gray-700">Especificações</h3>
          <ul className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm mb-8 grid grid-cols-2 gap-4">
            {Object.entries(pacoteEncontrado.specs).map(([chave, valor]) => (
              <li key={chave} className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{chave.replace('_', ' ')}</span> 
                <span className="text-gray-800 font-medium">{String(valor)}</span>
              </li>
            ))}
          </ul>

          {/* Linha do Tempo */}
          <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2 text-gray-700">Histórico de Movimentação</h3>
          <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
            <Timeline history={pacoteEncontrado.history} />
          </div>
          
        </div>
      )}
    </main>
  );
}