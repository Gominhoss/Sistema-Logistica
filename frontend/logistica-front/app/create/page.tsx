"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function CreatePackage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  // Estados do Formulário
  const [formData, setFormData] = useState({
    description: '',
    type: 'Comum',
    sender: { name: '', document: '' },
    recipient: { name: '', address: '', city: '', state: '', zipCode: '' },
    specs: [{ key: '', value: '' }]
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleInputChange = (section, field, value) => {
    if (section === 'basic') {
      setFormData({ ...formData, [field]: value });
    } else {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [field]: value }
      });
    }
  };

  const addSpec = () => {
    setFormData({ ...formData, specs: [...formData.specs, { key: '', value: '' }] });
  };

  const removeSpec = (index) => {
    const newSpecs = [...formData.specs];
    newSpecs.splice(index, 1);
    setFormData({ ...formData, specs: newSpecs });
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specs: newSpecs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Se NÃO estiver no último passo, apenas avança
    if (step < 3) {
      nextStep();
      return;
    }

    // Se estiver no último passo (3), aí sim faz o cadastro
    setIsLoading(true);
    setError('');

    // Converter specs de array [{key, value}] para objeto {key: value}
    const specsObject = {};
    formData.specs.forEach(spec => {
      if (spec.key.trim()) {
        specsObject[spec.key.trim()] = spec.value;
      }
    });

    const finalData = {
      ...formData,
      specs: specsObject
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Erro ao cadastrar pacote.');
      }

      const result = await response.json();
      setSuccessData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (successData) {
    return (
      <main className="max-w-xl mx-auto p-6 animate-in fade-in zoom-in duration-500">
        <div className="bg-white border border-green-200 rounded-2xl p-10 text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✓
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Pacote Cadastrado!</h2>
          <p className="text-gray-600 mb-8">O código de rastreio gerado para este pacote é:</p>
          
          <div className="bg-blue-50 border-2 border-dashed border-blue-200 p-6 rounded-xl mb-8">
            <span className="text-4xl font-mono font-bold text-blue-700 tracking-widest uppercase">
              {successData.trackingCode}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-8 px-4">
            Anote este código ou compartilhe com o destinatário para que ele possa acompanhar a entrega.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md">
              Rastrear este Pacote
            </Link>
            <button 
              onClick={() => { setSuccessData(null); setStep(1); setFormData({
                description: '',
                type: 'Comum',
                sender: { name: '', document: '' },
                recipient: { name: '', address: '', city: '', state: '', zipCode: '' },
                specs: [{ key: '', value: '' }]
              }); }}
              className="text-gray-500 hover:text-gray-700 font-medium py-2"
            >
              Cadastrar Novo Pacote
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      {/* Header do Wizard */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Novo Envio</h1>
        <p className="text-gray-500">Siga as etapas para registrar o pacote no sistema</p>
      </div>

      {/* Indicador de Passos */}
      <div className="flex items-center justify-between mb-12 relative px-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
              step >= i ? 'bg-blue-600 text-white scale-110 shadow-lg ring-4 ring-blue-100' : 'bg-gray-200 text-gray-500'
            }`}>
              {i}
            </div>
            <span className={`text-xs mt-2 font-semibold ${step >= i ? 'text-blue-700' : 'text-gray-400'}`}>
              {i === 1 ? 'Básico' : i === 2 ? 'Pessoas' : 'Specs'}
            </span>
          </div>
        ))}
        {/* Barra de Progresso de fundo */}
        <div className="absolute top-5 left-10 right-10 h-0.5 bg-gray-200 -z-0">
          <div 
            className="h-full bg-blue-600 transition-all duration-500" 
            style={{ width: `${(step - 1) * 50}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-500">
        <div className="p-8">
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* ETAPA 1: Informações Básicas */}
          {step === 1 && (
            <section className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Informações Básicas</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Descrição do Pacote</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: iPhone 15 Pro Max - Azul"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  value={formData.description}
                  onChange={(e) => handleInputChange('basic', 'description', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Tipo de Mercadoria</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all appearance-none"
                  value={formData.type}
                  onChange={(e) => handleInputChange('basic', 'type', e.target.value)}
                >
                  <option value="Comum">Comum</option>
                  <option value="Eletrônico">Eletrônico</option>
                  <option value="Frágil">Frágil</option>
                  <option value="Perecível">Perecível</option>
                </select>
              </div>
            </section>
          )}

          {/* ETAPA 2: Envolvidos */}
          {step === 2 && (
            <section className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Dados do Remetente</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Nome</label>
                    <input
                      required
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.sender.name}
                      onChange={(e) => handleInputChange('sender', 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Documento (CPF/CNPJ)</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.sender.document}
                      onChange={(e) => handleInputChange('sender', 'document', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Dados do Destinatário</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Nome Completo</label>
                    <input
                      required
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.recipient.name}
                      onChange={(e) => handleInputChange('recipient', 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Endereço de Entrega</label>
                    <input
                      required
                      type="text"
                      placeholder="Rua, Número, Complemento"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.recipient.address}
                      onChange={(e) => handleInputChange('recipient', 'address', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Cidade</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.recipient.city}
                        onChange={(e) => handleInputChange('recipient', 'city', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Estado (UF)</label>
                      <input
                        type="text"
                        maxLength="2"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                        value={formData.recipient.state}
                        onChange={(e) => handleInputChange('recipient', 'state', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-semibold text-gray-600 mb-1">CEP</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.recipient.zipCode}
                        onChange={(e) => handleInputChange('recipient', 'zipCode', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ETAPA 3: Specs Dinâmicas */}
          {step === 3 && (
            <section className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-bold text-gray-800">Especificações do Produto</h2>
                <button 
                  type="button" 
                  onClick={addSpec}
                  className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold hover:bg-blue-100 transition-colors"
                >
                  + Adicionar Campo
                </button>
              </div>
              <p className="text-xs text-gray-500 italic">Ex: Peso: 1.5kg, Voltagem: 220v, Validade: 12/2026</p>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {formData.specs.map((spec, index) => (
                  <div key={index} className="flex gap-3 items-end group animate-in slide-in-from-right-2">
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Propriedade</label>
                      <input
                        type="text"
                        placeholder="Ex: Peso"
                        className="w-full p-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Valor</label>
                      <input
                        type="text"
                        placeholder="Ex: 2kg"
                        className="w-full p-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                      />
                    </div>
                    {formData.specs.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeSpec(index)}
                        className="bg-gray-100 text-gray-400 p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Rodapé de Ações */}
        <div className="bg-gray-50 p-6 flex justify-between items-center border-t border-gray-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 text-gray-600 font-semibold hover:text-gray-900 transition-colors"
            >
              Voltar
            </button>
          ) : (
            <Link href="/" className="px-6 py-2 text-gray-600 font-semibold hover:text-gray-900 transition-colors">
              Cancelar
            </Link>
          )}

          {step < 3 ? (
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold shadow-md transition-all active:scale-95"
            >
              Continuar
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-green-600 hover:bg-green-700 text-white px-10 py-2 rounded-lg font-bold shadow-md transition-all active:scale-95 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Cadastrando...' : 'Finalizar e Gerar Código'}
            </button>
          )}
        </div>
      </form>
    </main>
  );
}