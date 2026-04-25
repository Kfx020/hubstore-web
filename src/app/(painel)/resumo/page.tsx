"use client";

import { useMemo } from "react";

import BackToOperationButton from "@/components/BackToOperationButton";
import Header from "@/components/Header";
import { useAppState } from "@/context/AppStateContext";

export default function ResumoPage() {
  const { lojaAtual, clienteAtual, marcaAtual, dataOperacao, atendimentos } =
    useAppState();

  const atendimentosLoja = useMemo(() => {
    return atendimentos.filter(
      (atendimento) => atendimento.lojaId === lojaAtual.id
    );
  }, [atendimentos, lojaAtual.id]);

  function ehVenda(resultado?: string) {
    return resultado === "Venda";
  }

  function ehNaoVenda(resultado?: string) {
    return resultado === "Não venda" || resultado === "Nao venda";
  }

  function ehTroca(resultado?: string) {
    return resultado === "Troca";
  }

  function ehTrocaComDiferenca(resultado?: string) {
    return (
      resultado === "Troca com diferença" ||
      resultado === "Troca com diferenca"
    );
  }

  const resumo = useMemo(() => {
    const totalAtendimentos = atendimentosLoja.length;

    const totalVendas = atendimentosLoja.filter((atendimento) =>
      ehVenda(atendimento.resultado)
    ).length;

    const totalNaoVendas = atendimentosLoja.filter((atendimento) =>
      ehNaoVenda(atendimento.resultado)
    ).length;

    const totalTrocas = atendimentosLoja.filter((atendimento) =>
      ehTroca(atendimento.resultado)
    ).length;

    const totalTrocasComDiferenca = atendimentosLoja.filter((atendimento) =>
      ehTrocaComDiferenca(atendimento.resultado)
    ).length;

    const desempenhoPorVendedor = new Map<
      string,
      {
        vendedorNome: string;
        atendimentos: number;
        vendas: number;
      }
    >();

    atendimentosLoja.forEach((atendimento) => {
      const atual = desempenhoPorVendedor.get(atendimento.vendedorId) ?? {
        vendedorNome: atendimento.vendedorNome?.trim() || "Vendedor sem nome",
        atendimentos: 0,
        vendas: 0,
      };

      atual.atendimentos += 1;

      if (ehVenda(atendimento.resultado)) {
        atual.vendas += 1;
      }

      desempenhoPorVendedor.set(atendimento.vendedorId, atual);
    });

    const vendedoresOrdenados = Array.from(
      desempenhoPorVendedor.values()
    ).sort((a, b) => {
      if (b.vendas !== a.vendas) {
        return b.vendas - a.vendas;
      }

      if (b.atendimentos !== a.atendimentos) {
        return b.atendimentos - a.atendimentos;
      }

      return a.vendedorNome.localeCompare(b.vendedorNome, "pt-BR");
    });

    return {
      totalAtendimentos,
      totalVendas,
      totalNaoVendas,
      totalTrocas,
      totalTrocasComDiferenca,
      melhorResultado: vendedoresOrdenados[0]?.vendedorNome?.trim() || "Sem dados",
      maiorVolumeVendas: vendedoresOrdenados[0]?.vendas ?? 0,
      pa: "--",
    };
  }, [atendimentosLoja]);

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
                  Resumo operacional
                </p>

                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Resumo do dia
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Leitura rapida dos principais numeros da operacao atual.
                </p>
              </div>

              <BackToOperationButton
                label="Voltar para operacao"
                className="w-full rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 sm:w-auto"
              />
            </div>
          </section>

          <section className="grid gap-4 border-b border-neutral-800 p-4 sm:p-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-400">Vendedor destaque do dia</p>
              <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
                {resumo.melhorResultado}
              </p>
              <p className="mt-1 text-sm leading-6 text-neutral-500">
                Maior resultado em vendas na operacao do dia.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-400">Maior volume de vendas</p>
              <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
                {resumo.maiorVolumeVendas}
              </p>
              <p className="mt-1 text-sm leading-6 text-neutral-500">
                Quantidade de vendas do destaque do dia.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 md:col-span-2 xl:col-span-1">
              <p className="text-sm text-neutral-400">PA</p>
              <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
                {resumo.pa}
              </p>
              <p className="mt-1 text-sm leading-6 text-neutral-500">
                Sera calculado quando entrar ticket e quantidade.
              </p>
            </div>
          </section>

          <section className="grid gap-4 p-4 sm:p-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Atendimentos</p>
              <p className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {resumo.totalAtendimentos}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Total registrado na loja.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Vendas</p>
              <p className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {resumo.totalVendas}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Atendimentos finalizados com venda.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Nao vendas</p>
              <p className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {resumo.totalNaoVendas}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Clientes que nao concluiram compra.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Trocas</p>
              <p className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {resumo.totalTrocas}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Trocas registradas no dia.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5 md:col-span-2 xl:col-span-1">
              <p className="text-sm text-neutral-400">Trocas com diferenca</p>
              <p className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {resumo.totalTrocasComDiferenca}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Trocas com ajuste de valor.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
