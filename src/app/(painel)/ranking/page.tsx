"use client";

import { useMemo } from "react";

import BackToOperationButton from "@/components/BackToOperationButton";
import Header from "@/components/Header";
import { useAppState } from "@/context/AppStateContext";
import { calcularResumoMetasLoja, formatarMoeda } from "@/lib/calculations";

export default function RankingPage() {
  const {
    lojaAtual,
    clienteAtual,
    marcaAtual,
    dataOperacao,
    vendedores,
    atendimentos,
  } = useAppState();

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
    const metas = calcularResumoMetasLoja(lojaAtual, vendedoresLoja);

    const base = vendedoresLoja.map((vendedor) => {
      const atendimentosVendedor = atendimentosLoja.filter(
        (atendimento) => atendimento.vendedorId === vendedor.id
      );

      const totalAtendimentos = atendimentosVendedor.length;
      const totalVendas = atendimentosVendedor.filter(
        (atendimento) => atendimento.resultado === "Venda"
      ).length;

      const valorVendido = atendimentosVendedor.reduce((total, atendimento) => {
        return total + (atendimento.valorVenda || 0);
      }, 0);

      const faltaParaMeta = Math.max(
        metas.metaDiariaPorVendedor - valorVendido,
        0
      );

      return {
        vendedorId: vendedor.id,
        vendedorNome: vendedor.nome,
        atendimentos: totalAtendimentos,
        valorVendido,
        vendas: totalVendas,
        metaDiaria: metas.metaDiariaPorVendedor,
        faltaParaMeta,
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 px-4 py-4 text-white sm:px-5 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[24px] border border-neutral-800 bg-neutral-900/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)] md:rounded-[28px]">
          <Header
            produto="Vezify"
            cliente={`${marcaAtual.nome} - ${clienteAtual.nome}`}
            loja={lojaAtual.nome}
            data={dataOperacao}
            status="Online"
          />

          <section className="border-b border-neutral-800 px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                  Desempenho operacional
                </p>

                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Ranking do dia
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Ranking com meta do dia e falta para bater.
                </p>
              </div>

              <BackToOperationButton
                label="Voltar para operacao"
                className="w-full rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 sm:w-auto"
              />
            </div>
          </section>

          <section className="p-4 sm:p-6">
            {ranking.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-neutral-700 bg-neutral-950/70 p-8 text-sm text-neutral-400">
                Nenhum dado disponivel para montar o ranking.
              </div>
            ) : (
              <div className="space-y-4">
                {ranking.map((item) => (
                  <div
                    key={item.vendedorId}
                    className="rounded-3xl border border-neutral-800 bg-neutral-950 p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-lg font-bold text-cyan-300">
                            {item.posicao}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-lg font-bold text-white">
                              {item.vendedorNome}
                            </p>
                            <p className="text-sm text-neutral-400">
                              Posicao #{item.posicao}
                            </p>
                          </div>
                        </div>

                        <div className="self-start rounded-full border border-neutral-800 bg-neutral-900/70 px-3 py-1.5 text-xs text-neutral-400">
                          Meta diaria {formatarMoeda(item.metaDiaria)}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
                            Valor vendido
                          </p>
                          <p className="mt-2 text-lg font-bold text-white break-words">
                            {formatarMoeda(item.valorVendido)}
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
                            Meta do dia
                          </p>
                          <p className="mt-2 text-lg font-bold text-white break-words">
                            {formatarMoeda(item.metaDiaria)}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 px-4 py-3 sm:col-span-2 xl:col-span-1">
                          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                            Falta para bater
                          </p>
                          <p className="mt-2 text-lg font-bold text-white break-words">
                            {formatarMoeda(item.faltaParaMeta)}
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
