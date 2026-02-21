"use client"; // Esta linha é obrigatória no Next.js para usar useState e interatividade

import { useState } from 'react';
import mockData from '../mocks/packageMock.json';
import Timeline from '../components/Timeline';

export default function Home() {
  // 1. Estados da nossa aplicação
  const [codigoDigitado, setCodigoDigitado] = useState(''); // Guarda o que o usuário digita
  const [pacoteEncontrado, setPacoteEncontrado] = useState(null); // Guarda os dados do pacote para exibir
  const [erro, setErro] = useState(''); // Guarda mensagens de erro

  // 2. Função que roda quando o formulário é enviado (clique no botão ou Enter)
  const handleBuscar = (e) => {
    e.preventDefault(); // Evita que a página recarregue do zero

    // Simulando a chamada na API: verificamos se o código bate com o nosso mock
    if (codigoDigitado === mockData.trackingCode) {
      setPacoteEncontrado(mockData); // Mostra o pacote na tela
      setErro(''); // Limpa qualquer erro anterior
    } else {
      setPacoteEncontrado(null); // Esconde os dados
      setErro(`Pacote não encontrado. Dica: teste com o código ${mockData.trackingCode}`);
    }
  };

  return (
    <main className="p-8 font-sans max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-900">Rastreamento Rápido</h1>

      {/* 3. A Barra de Pesquisa */}
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
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Buscar
        </button>
      </form>

      {/* 4. Feedback de Erro */}
      {erro && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <p className="text-red-700">{erro}</p>
        </div>
      )}

      {/* 5. Condicional: Só renderiza as informações SE um pacote foi encontrado */}
      {pacoteEncontrado && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg mb-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{pacoteEncontrado.description}</h2>
            <div className="flex justify-between items-center mt-3">
              <p className="text-gray-600">Categoria: <span className="font-medium text-gray-800">{pacoteEncontrado.type}</span></p>
              <p className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                {pacoteEncontrado.status}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-3 text-gray-700">Especificações</h3>
          <ul className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm mb-8 grid grid-cols-2 gap-4">
            {Object.entries(pacoteEncontrado.specs).map(([chave, valor]) => (
              <li key={chave} className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{chave.replace('_', ' ')}</span> 
                <span className="text-gray-800 font-medium">{String(valor)}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2 text-gray-700">Histórico de Movimentação</h3>
          <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
            <Timeline history={pacoteEncontrado.history} />
          </div>
          
        </div>
      )}
    </main>
  );
}