"use client";

import { useMemo } from "react";

import BackToOperationButton from "@/components/BackToOperationButton";
import Header from "@/components/Header";
import { useAppState } from "@/context/AppStateContext";

export default function RankingPage() {
  const { lojaAtual, vendedores, atendimentos } = useAppState();

  const vendedoresLoja = useMemo(() => {
    return vendedores.filter(
      (vendedor) => vendedor.lojaId === lojaAtual.id && vendedor.ativo
    );
  }, [vendedores, lojaAtual.id]);

  const atendimentosLoja = useMemo(() => {
    return atendimentos.filter(
      (atendimento) => atendimento.lojaId === lojaAtual.id
    );
  }, [atendimentos, lojaAtual.id]);

  const ranking = useMemo(() => {
    const metaMensalLoja = lojaAtual.valorMetaMes;

    /*
      PRIMEIRA VERSAO DO MVP

      Mantive a mesma logica inicial de metas:
      dias operacionais do mes = dias da semana * 4
    */
    const diasOperacionaisMes = lojaAtual.diasOperacaoSemana.length * 4;

    const metaDiariaLoja =
      diasOperacionaisMes > 0 ? metaMensalLoja / diasOperacionaisMes : 0;

    const quantidadeVendedores = vendedoresLoja.length;

    const metaDiariaPorVendedor =
      quantidadeVendedores > 0
        ? metaDiariaLoja / quantidadeVendedores
        : 0;

    const base = vendedoresLoja.map((vendedor) => {
      const atendimentosVendedor = atendimentosLoja.filter(
        (atendimento) => atendimento.vendedorId === vendedor.id
      );

      const totalAtendimentos = atendimentosVendedor.length;

      const totalVendas = atendimentosVendedor.filter(
        (atendimento) => atendimento.resultado === "Venda"
      ).length;

      /*
        VALOR VENDIDO

        Se ainda nao existir valorVenda salvo nos atendimentos,
        o total fica 0 sem quebrar a tela.
      */
      const valorVendido = atendimentosVendedor.reduce((total, atendimento) => {
        return total + (atendimento.valorVenda || 0);
      }, 0);

      const faltaParaMeta = Math.max(metaDiariaPorVendedor - valorVendido, 0);

      const percentualMeta =
        metaDiariaPorVendedor > 0
          ? (valorVendido / metaDiariaPorVendedor) * 100
          : 0;

      return {
        vendedorId: vendedor.id,
        vendedorNome: vendedor.nome,
        atendimentos: totalAtendimentos,
        vendas: totalVendas,
        valorVendido,
        metaDiaria: metaDiariaPorVendedor,
        faltaParaMeta,
        percentualMeta,
      };
    });

    const ordenado = [...base].sort((a, b) => {
      if (b.valorVendido !== a.valorVendido) {
        return b.valorVendido - a.valorVendido;
      }

      if (b.vendas !== a.vendas) {
        return b.vendas - a.vendas;
      }

      if (b.atendimentos !== a.atendimentos) {
        return b.atendimentos - a.atendimentos;
      }

      return a.vendedorNome.localeCompare(b.vendedorNome, "pt-BR");
    });

    return ordenado.map((item, index) => ({
      posicao: index + 1,
      ...item,
    }));
  }, [lojaAtual, vendedoresLoja, atendimentosLoja]);

  function formatarMoeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarPercentual(valor: number) {
    return `${valor.toFixed(1)}%`;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 px-4 py-6 text-white md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[28px] border border-neutral-800 bg-neutral-900/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <Header
            produto="Vezify"
            cliente="Hering"
            loja={lojaAtual.nome}
            data="13/04/2026"
            status="Online"
          />

          <section className="border-b border-neutral-800 px-6 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                  Desempenho operacional
                </p>

                <h2 className="mt-2 text-3xl font-bold">Ranking do dia</h2>

                <p className="mt-2 text-sm text-neutral-400">
                  Ranking com venda, meta do dia e quanto falta para bater.
                </p>
              </div>

             <BackToOperationButton
                label="Voltar para operação"
                className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
              />
            </div>
          </section>

          <section className="p-6">
            {ranking.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-neutral-700 bg-neutral-950/70 p-8 text-sm text-neutral-400">
                Nenhum dado disponível para montar o ranking.
              </div>
            ) : (
              <div className="space-y-4">
                {ranking.map((item) => (
                  <div
                    key={item.vendedorId}
                    className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/15 text-lg font-bold text-cyan-300">
                          {item.posicao}
                        </div>

                        <div>
                          <p className="text-lg font-bold text-white">
                            {item.vendedorNome}
                          </p>
                          <p className="text-sm text-neutral-400">
                            Posição #{item.posicao}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5 xl:min-w-[900px]">
                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                            Atendimentos
                          </p>
                          <p className="mt-2 text-2xl font-bold text-white">
                            {item.atendimentos}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                            Vendas
                          </p>
                          <p className="mt-2 text-2xl font-bold text-white">
                            {item.vendas}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                            Valor vendido
                          </p>
                          <p className="mt-2 text-lg font-bold text-white">
                            {formatarMoeda(item.valorVendido)}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                            Meta do dia
                          </p>
                          <p className="mt-2 text-lg font-bold text-white">
                            {formatarMoeda(item.metaDiaria)}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 px-4 py-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                            Falta para bater
                          </p>
                          <p className="mt-2 text-lg font-bold text-white">
                            {formatarMoeda(item.faltaParaMeta)}
                          </p>
                          <p className="mt-1 text-xs text-neutral-400">
                            {formatarPercentual(item.percentualMeta)} da meta
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}