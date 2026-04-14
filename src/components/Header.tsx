import Link from "next/link";

/*
  TIPAGEM DAS PROPS DO HEADER

  Escolhi deixar o Header recebendo esses dados por props
  porque isso permite reutilizar o mesmo cabeçalho em várias telas,
  mudando só os valores.
*/
type HeaderProps = {
  produto: string;
  cliente: string;
  loja: string;
  data: string;
  status: string;
};

export default function Header({
  produto,
  cliente,
  loja,
  data,
  status,
}: HeaderProps) {
  return (
    /*
      CABEÇALHO PRINCIPAL

      Escolhi deixar o cabeçalho em componente separado porque:
      - ele aparece em mais de uma tela
      - fica mais fácil de manter
      - evita repetir o mesmo bloco em várias páginas
    */
    <header className="border-b border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 px-6 py-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        {/* Lado esquerdo: identidade do sistema e dados da loja */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            {produto}
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            Painel operacional de atendimento e conversão da loja
          </p>

          <div className="mt-4 space-y-1 text-sm text-neutral-300">
            <p>Cliente: {cliente}</p>
            <p>Loja: {loja}</p>
            <p>Data: {data}</p>
          </div>
        </div>

        {/* Lado direito: status e navegação */}
        <div className="flex flex-col items-start gap-4 md:items-end">
          {/* Status visual */}
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span>Status: {status}</span>
          </div>

          {/* 
            Navegação rápida

            Escolhi usar Link porque esses botões só mudam de página.
            Se eu usasse botão, ficaria parecendo ação da tela.
            Com Link, fica mais claro que é navegação.
          */}
          <div className="flex gap-2">
            <Link
              href="/resumo"
              className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Resumo do dia
            </Link>

            <Link
              href="/ranking"
              className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Ranking
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}