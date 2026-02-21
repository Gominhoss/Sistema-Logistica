export default function Timeline({ history }) {
  // Se não houver histórico, não renderiza nada
  if (!history || history.length === 0) {
    return <p className="text-gray-500 italic">Nenhum evento registrado ainda.</p>;
  }

  // Ordena o histórico por data (mais recente primeiro) para garantir a ordem correta na linha do tempo
  const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="relative border-l border-blue-500 ml-4 mt-6">
      {sortedHistory.map((evento, index) => {
        // Formatando a data feia do banco (ISO) para o padrão brasileiro
        const dataFormatada = new Date(evento.timestamp).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        // Verificamos se é o primeiro da lista ordenada (ou seja, o mais recente de todos)
        const isMaisRecente = index === 0;

        return (
          <div key={evento._id || index} className="mb-8 ml-6">
            {/* A "Bolinha" da linha do tempo */}
            <span 
              className={`absolute flex items-center justify-center w-4 h-4 rounded-full -left-2 ring-4 ring-white ${
                isMaisRecente ? 'bg-green-500' : 'bg-blue-500'
              }`}
            ></span>
            
            {/* Conteúdo do Evento */}
            <div className={isMaisRecente ? 'bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500' : ''}>
              <h3 className={`flex items-center mb-1 text-lg font-semibold ${isMaisRecente ? 'text-blue-900' : 'text-gray-900'}`}>
                {evento.status}
                {isMaisRecente && <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase">Atual</span>}
              </h3>
              <time className="block mb-2 text-sm font-normal text-gray-400">
                {dataFormatada}
              </time>
              <p className="text-base font-normal text-gray-600">
                📍 {evento.location}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}