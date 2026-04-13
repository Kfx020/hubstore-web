type HeaderProps = {
  produto: string;
  cliente: string;
  loja: string;
  data: string;
  status: string;
};

export default function Header ({
  produto,
  cliente,
  loja,
  data,
  status,
}: HeaderProps) {
  return (
    <header className="border-b border-neutral-800 px-6 py-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{produto}</h1>
          <p className="mt-2 text-sm text-neutral-300">Cliente: {cliente}</p>
          <p className="text-sm text-neutral-300">Loja: {loja}</p>
          <p className="text-sm text-neutral-300">Data: {data}</p>
        </div>

        <div className="text-sm text-neutral-300">
          <p>Status: {status}</p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-lg border border-neutral-700 px-3 py-2 hover:bg-neutral-800">
              Resumo do dia
            </button>
            <button className="rounded-lg border border-neutral-700 px-3 py-2 hover:bg-neutral-800">
              Ranking
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}