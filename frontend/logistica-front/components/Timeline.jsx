export default function Timeline({ history }) {
  // Se não houver histórico, não renderiza nada
  if (!history || history.length === 0) {
    return <p className="text-gray-500 italic">Nenhum evento registrado ainda.</p>;
  }

  return (
    <div className="relative border-l border-blue-500 ml-4 mt-6">
      {history.map((evento, index) => {
        // Formatando a data feia do banco (ISO) para o padrão brasileiro
        const dataFormatada = new Date(evento.timestamp).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        // Verificamos se é o último evento da lista para dar um destaque visual (a bolinha fica diferente)
        const isUltimoEvento = index === history.length - 1;

        return (
          <div key={evento._id} className="mb-8 ml-6">
            {/* A "Bolinha" da linha do tempo */}
            <span 
              className={`absolute flex items-center justify-center w-4 h-4 rounded-full -left-2 ring-4 ring-white ${
                isUltimoEvento ? 'bg-green-500' : 'bg-blue-500'
              }`}
            ></span>
            
            {/* Conteúdo do Evento */}
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
              {evento.status}
            </h3>
            <time className="block mb-2 text-sm font-normal text-gray-400">
              {dataFormatada}
            </time>
            <p className="text-base font-normal text-gray-600">
              📍 {evento.location}
            </p>
          </div>
        );
      })}
    </div>
  );
}