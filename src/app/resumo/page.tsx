import Link from "next/link";

/*
  TELA: RESUMO DO DIA

  Escolhi deixar esta tela mais operacional do que analítica.
  O objetivo dela é dar uma leitura rápida do dia da loja.

  Por isso, aqui mostramos:
  - atendimentos
  - vendas
  - não vendas
  - trocas
  - trocas com diferença
  - valor vendido

  A parte mais pesada de KPI e análise continua no Power BI.
*/
export default function ResumoPage() {
  /*
    DADOS FIXOS DO MVP

    Por enquanto são números de demonstração.
    Depois esses dados podem vir da API e do banco.
  */
  const totalAtendimentos = 120;
  const totalVendas = 38;
  const totalNaoVendas = 70;
  const totalTrocas = 8;
  const totalTrocasComDiferenca = 4;
  const valorVendidoDia = "R$ 12.480,00";

  /*
    DADOS DE APOIO VISUAL

    Escolhi criar esses blocos porque eles deixam a leitura da tela
    mais rápida e dão mais cara de sistema pronto.
  */
  const melhorResultado = "Joana Andrade";
  const destaqueLoja = "Loja com operação estável";
  const maiorVenda = "R$ 2.350,00";

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 px-4 py-6 text-white md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        {/* 
          CONTAINER PRINCIPAL

          Escolhi manter a mesma linguagem visual das outras telas
          para deixar o HUBStore mais consistente visualmente.
        */}
        <div className="overflow-hidden rounded-[28px] border border-neutral-800 bg-neutral-900/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          {/* CABEÇALHO DA TELA */}
          <header className="border-b border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 px-6 py-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              {/* Lado esquerdo: identidade da tela */}
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                  Resumo operacional
                </p>

                <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
                  Resumo do dia
                </h1>

                <p className="mt-2 text-sm text-neutral-400">
                  Visão rápida dos principais números da operação atual
                </p>

                <div className="mt-4 space-y-1 text-sm text-neutral-300">
                  <p>Sistema: HUBStore</p>
                  <p>Cliente: Hering</p>
                  <p>Loja: Riomar</p>
                  <p>Data: 13/04/2026</p>
                </div>
              </div>

              {/* Lado direito: status e navegação */}
              <div className="flex flex-col items-start gap-3 md:items-end">
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-300">
                  Fechamento parcial do dia
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

          {/* CARDS SUPERIORES DE LEITURA RÁPIDA */}
          <section className="grid gap-4 border-b border-neutral-800 px-6 py-5 md:grid-cols-3">
            {/* 
              Escolhi esses 3 cards porque eles ajudam a dar contexto
              antes de olhar os números detalhados.
            */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-400">Melhor resultado do dia</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {melhorResultado}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-400">Maior venda do dia</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {maiorVenda}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-400">Situação da loja</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {destaqueLoja}
              </p>
            </div>
          </section>

          {/* KPIs OPERACIONAIS DO DIA */}
          <section className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Card: atendimentos */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Atendimentos</p>
              <p className="mt-3 text-4xl font-bold text-white">
                {totalAtendimentos}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Total registrado na operação hoje
              </p>
            </div>

            {/* Card: vendas */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Vendas</p>
              <p className="mt-3 text-4xl font-bold text-white">
                {totalVendas}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Atendimentos finalizados com venda
              </p>
            </div>

            {/* Card: não vendas */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Não vendas</p>
              <p className="mt-3 text-4xl font-bold text-white">
                {totalNaoVendas}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Clientes que não concluíram compra
              </p>
            </div>

            {/* Card: trocas */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Trocas</p>
              <p className="mt-3 text-4xl font-bold text-white">
                {totalTrocas}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Trocas registradas no dia
              </p>
            </div>

            {/* Card: trocas com diferença */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Trocas com diferença</p>
              <p className="mt-3 text-4xl font-bold text-white">
                {totalTrocasComDiferenca}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Trocas com ajuste de valor
              </p>
            </div>

            {/* Card: valor vendido */}
            <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 via-neutral-950 to-neutral-950 p-5 shadow-[0_10px_40px_rgba(34,211,238,0.08)]">
              <p className="text-sm text-cyan-300">Valor vendido do dia</p>
              <p className="mt-3 text-4xl font-bold text-white">
                {valorVendidoDia}
              </p>
              <p className="mt-2 text-sm text-neutral-400">
                Valor total vendido pela equipe hoje
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}