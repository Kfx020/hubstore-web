"use client";

import { useMemo } from "react";

import BackToOperationButton from "@/components/BackToOperationButton";
import Header from "@/components/Header";
import { useAppState } from "@/context/AppStateContext";
import { calcularMetaLoja, formatarMoeda } from "@/lib/calculations";

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

    return {
      totalAtendimentos,
      totalVendas,
      totalNaoVendas,
      totalTrocas,
      totalTrocasComDiferenca,
    };
  }, [atendimentosLoja]);

  const metaLoja = useMemo(() => {
    return calcularMetaLoja(lojaAtual);
  }, [lojaAtual]);

  const cardsComerciais = [
    {
      titulo: "Meta do dia",
      valor: formatarMoeda(metaLoja.valorMetaDia),
      detalhe: "Meta diaria definida pela regra atual da loja.",
    },
    {
      titulo: "Valor vendido hoje",
      valor: "--",
      detalhe: "Aguardando PDV",
    },
    {
      titulo: "Falta para meta do dia",
      valor: "--",
      detalhe: "Aguardando valor vendido do PDV.",
    },
    {
      titulo: "PA da loja",
      valor: "--",
      detalhe: "Aguardando quantidade vendida e tickets PDV.",
    },
    {
      titulo: "Tickets PDV",
      valor: "--",
      detalhe: "Aguardando PDV",
    },
    {
      titulo: "Ticket medio",
      valor: "--",
      detalhe: "Aguardando PDV",
    },
    {
      titulo: "Quantidade vendida",
      valor: "--",
      detalhe: "Aguardando pecas vendidas pelo PDV.",
    },
  ];

  const cardsOperacionais = [
    {
      titulo: "Atendimentos",
      valor: resumo.totalAtendimentos,
      detalhe: "Total registrado na loja.",
    },
    {
      titulo: "Vendas registradas",
      valor: resumo.totalVendas,
      detalhe: "Atendimentos finalizados com venda no Vezify.",
    },
    {
      titulo: "Nao vendas",
      valor: resumo.totalNaoVendas,
      detalhe: "Clientes que nao concluiram compra.",
    },
    {
      titulo: "Trocas",
      valor: resumo.totalTrocas,
      detalhe: "Trocas registradas no dia.",
    },
    {
      titulo: "Trocas com diferenca",
      valor: resumo.totalTrocasComDiferenca,
      detalhe: "Trocas com ajuste de valor.",
    },
  ];

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
                  Situacao da loja hoje, com operacao registrada no Vezify e
                  indicadores comerciais preparados para o PDV.
                </p>
              </div>

              <BackToOperationButton
                label="Voltar para operacao"
                className="w-full rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 sm:w-auto"
              />
            </div>
          </section>

          <section className="border-b border-neutral-800 p-4 sm:p-6">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-400">
                Desempenho da loja hoje
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {cardsComerciais.map((card) => (
                <div
                  key={card.titulo}
                  className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5"
                >
                  <p className="text-sm text-neutral-400">{card.titulo}</p>
                  <p className="mt-3 break-words text-2xl font-bold text-white sm:text-3xl">
                    {card.valor}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">
                    {card.detalhe}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="p-4 sm:p-6">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-400">
                Operacao registrada no Vezify
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {cardsOperacionais.map((card) => (
                <div
                  key={card.titulo}
                  className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5"
                >
                  <p className="text-sm text-neutral-400">{card.titulo}</p>
                  <p className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                    {card.valor}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">
                    {card.detalhe}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
