import Link from "next/link";

/*
  TELA: DESEMPENHO DA EQUIPE

  Escolhi tirar a conversão desta tela porque:
  - conversão é mais gerencial
  - o vendedor não precisa disso na operação
  - essa tela deve ser mais objetiva e útil para o dia a dia

  Então aqui mostramos:
  - atendimentos
  - vendas
  - valor vendido

  Depois, com integração do sistema de vendas, o valor vendido
  pode vir automaticamente.
*/
export default function RankingPage() {
  /*
    DADOS FIXOS DO MVP

    Por enquanto são dados de demonstração.
    Depois poderão vir da API e do banco.
  */
  const equipe = [
    {
      posicao: 1,
      nome: "Joana Andrade",
      atendimentos: 20,
      vendas: 9,
      valorVendido: "R$ 2.350,00",
    },
    {
      posicao: 2,
      nome: "Rafa",
      atendimentos: 18,
      vendas: 7,
      valorVendido: "R$ 1.980,00",
    },
    {
      posicao: 3,
      nome: "Admari",
      atendimentos: 16,
      vendas: 6,
      valorVendido: "R$ 1.740,00",
    },
    {
      posicao: 4,
      nome: "Gilvaneide",
      atendimentos: 22,
      vendas: 8,
      valorVendido: "R$ 2.120,00",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 px-4 py-6 text-white md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        {/* Container principal da tela */}
        <div className="overflow-hidden rounded-[28px] border border-neutral-800 bg-neutral-900/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          {/* Cabeçalho da página */}
          <header className="border-b border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 px-6 py-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              {/* Lado esquerdo: título e dados da loja */}
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
                  Operação da equipe
                </p>

                <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
                  Desempenho da equipe
                </h1>

                <p className="mt-2 text-sm text-neutral-400">
                  Visão rápida dos vendedores no dia atual
                </p>

                <div className="mt-4 space-y-1 text-sm text-neutral-300">
                  <p>Sistema: HUBStore</p>
                  <p>Cliente: Hering</p>
                  <p>Loja: Riomar</p>
                  <p>Data: 13/04/2026</p>
                </div>
              </div>

              {/* Lado direito: ação de voltar */}
              <div className="flex flex-col items-start gap-3 md:items-end">
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-300">
                  Atualização operacional
                </span>

                <Link
                  href="/operacao"
                  className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  Voltar para operação
                </Link>
              </div>
            </div>
          </header>

          {/* Cards superiores com leitura rápida */}
          <section className="grid gap-4 border-b border-neutral-800 px-6 py-5 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-400">Equipe do dia</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {equipe.length} vendedores
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-400">Maior venda do dia</p>
              <p className="mt-2 text-2xl font-bold text-white">
                R$ 2.350,00
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-400">Melhor desempenho</p>
              <p className="mt-2 text-2xl font-bold text-white">
                Joana Andrade
              </p>
            </div>
          </section>

          {/* Lista da equipe */}
          <section className="space-y-4 p-6">
            {equipe.map((item) => {
              /*
                Mantive destaque visual para o 1º lugar
                porque ajuda a leitura e dá mais valor para a tela.
              */
              const primeiroLugar = item.posicao === 1;

              return (
                <div
                  key={item.posicao}
                  className={`rounded-3xl border p-5 transition ${
                    primeiroLugar
                      ? "border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-neutral-950 to-neutral-950 shadow-[0_10px_40px_rgba(245,158,11,0.12)]"
                      : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Posição e nome do vendedor */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold ${
                          primeiroLugar
                            ? "bg-amber-400 text-black"
                            : "bg-neutral-800 text-white"
                        }`}
                      >
                        #{item.posicao}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-semibold text-white">
                            {item.nome}
                          </h2>

                          {primeiroLugar && (
                            <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-300">
                              Destaque do dia
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-neutral-400">
                          Resultado operacional do dia
                        </p>
                      </div>
                    </div>

                    {/* Métricas do vendedor */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-neutral-800 bg-black/40 px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-neutral-500">
                          Atendimentos
                        </p>
                        <p className="mt-2 text-xl font-bold text-white">
                          {item.atendimentos}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-neutral-800 bg-black/40 px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-neutral-500">
                          Vendas
                        </p>
                        <p className="mt-2 text-xl font-bold text-white">
                          {item.vendas}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-neutral-800 bg-black/40 px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-neutral-500">
                          Valor vendido
                        </p>
                        <p className="mt-2 text-xl font-bold text-white">
                          {item.valorVendido}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </main>
  );
}