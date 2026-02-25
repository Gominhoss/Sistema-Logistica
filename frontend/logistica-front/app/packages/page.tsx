"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Timeline from '../../components/Timeline';

export default function ListPackages() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/packages`);
      if (!resposta.ok) throw new Error('Erro ao carregar pacotes.');
      const dados = await resposta.json();
      setPackages(dados);
    } catch (error) {
      setErro(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatarEntidade = (entidade) => {
    if (!entidade) return 'Não informado';
    if (typeof entidade === 'object') return entidade.name || entidade.nome || 'Não informado';
    return entidade;
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">📦 Gestão de Pacotes</h1>
          <p className="text-gray-500 text-lg">Visualize e gerencie toda a operação logística</p>
        </div>
        <button 
          onClick={fetchPackages}
          className="bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-sm"
        >
          Atualizar Lista
        </button>
      </div>

      {erro && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
          <p className="text-red-700">{erro}</p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-100 h-64 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border-b-4 border-b-blue-500 group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">
                  {pkg.trackingCode}
                </span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  pkg.status === 'Entregue' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {pkg.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-1">{pkg.description}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400 font-medium w-20">De:</span>
                  <span className="text-gray-700 font-semibold">{formatarEntidade(pkg.sender)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400 font-medium w-20">Para:</span>
                  <span className="text-gray-700 font-semibold">{formatarEntidade(pkg.recipient)}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedPackage(pkg)}
                className="w-full py-3 bg-gray-50 text-gray-600 font-bold rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all active:scale-95"
              >
                Ver Detalhes
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-900">Detalhes do Pacote</h2>
              <button 
                onClick={() => setSelectedPackage(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Descrição</label>
                  <p className="text-lg font-bold text-gray-800">{selectedPackage.description}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Código de Rastreio</label>
                  <p className="text-lg font-bold text-blue-600">{selectedPackage.trackingCode}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h4 className="font-bold text-gray-800 mb-4">Especificações Técnicas</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedPackage.specs && Object.entries(selectedPackage.specs).map(([chave, valor]) => (
                    <div key={chave}>
                      <span className="text-xs text-gray-500 font-medium block uppercase">{chave}</span>
                      <span className="text-gray-900 font-semibold">{String(valor)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
                  Histórico de Movimentação
                </h4>
                <Timeline history={selectedPackage.history} />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedPackage(null)}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
