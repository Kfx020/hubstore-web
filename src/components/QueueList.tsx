type QueueListProps = {
  fila: string[];
  onRemoverDafila: (nome:string)=> void
};


export default function QueueList({ 
  fila,
  onRemoverDafila,
}: QueueListProps) {
  return (
     <div>
      {fila.length === 0 ? (
        <p className="text-sm text-neutral-400">
          Nenhum vendedor na fila.
        </p>
      ) : (
        <div className="space-y-3">
          {fila.map((nome, index) => (
            <div
              key={`${nome}-${index}`}
              className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
            >
              <span className="font-medium">
                {index + 1}. {nome}
              </span>

              <button
                onClick={() => onRemoverDafila(nome)}
                className="rounded-lg border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-800"
              >
                Tirar da fila
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}