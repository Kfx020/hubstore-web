"use client";

import BackToOperationButton from "@/components/BackToOperationButton";
import { useMemo } from "react";

import Header from "@/components/Header";
import { useAppState } from "@/context/AppStateContext";

export default function ResumoPage() {
  /*
    CONTEXTO GLOBAL

    Agora o resumo lê a mesma base central do painel.
  */
  const { lojaAtual, atendimentos } = useAppState();

  /*
    ATENDIMENTOS DA LOJA ATUAL
  */
  const atendimentosLoja = useMemo(() => {
    return atendimentos.filter(
      (atendimento) => atendimento.lojaId === lojaAtual.id
    );
  }, [atendimentos, lojaAtual.id]);

  /*
    FUNCOES AUXILIARES

    Aceitam as duas versões do texto
    para evitar erro com dados antigos e novos.
  */
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

  /*
    RESUMO E CARDS AUTOMATICOS
  */
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

    /*
      AGRUPAMENTO POR VENDEDOR

      Aqui calculamos:
      - atendimentos por vendedor
      - vendas por vendedor
    */
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

    const melhorResultado =
      vendedoresOrdenados[0]?.vendedorNome?.trim() || "Sem dados";

    const maiorVolumeVendas = vendedoresOrdenados[0]?.vendas ?? 0;

    /*
      PA

      Ainda nao ha base suficiente no MVP para calcular.
      Depois entra com ticket + quantidade / integracao PDV.
    */
    const pa = "--";

    return {
      totalAtendimentos,
      totalVendas,
      totalNaoVendas,
      totalTrocas,
      totalTrocasComDiferenca,
      melhorResultado,
      maiorVolumeVendas,
      pa,
    };
  }, [atendimentosLoja]);

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
                  Resumo operacional
                </p>

                <h2 className="mt-2 text-3xl font-bold">Resumo do dia</h2>

                <p className="mt-2 text-sm text-neutral-400">
                  Leitura rápida dos principais números da operação atual.
                </p>
              </div>
                    {/* Botão de sair no painel lateral */}
              <BackToOperationButton
                label="Voltar para operação"
                className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
              />
            </div>
          </section>

          {/* CARDS AUTOMATICOS DO TOPO */}
          <section className="grid gap-4 border-b border-neutral-800 p-6 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-400">Vendedor destaque do dia</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {resumo.melhorResultado}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Maior resultado em vendas na operação do dia
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-400">Maior volume de vendas</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {resumo.maiorVolumeVendas}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Quantidade de vendas do destaque do dia
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-400">PA</p>
              <p className="mt-2 text-2xl font-bold text-white">{resumo.pa}</p>
              <p className="mt-1 text-sm text-neutral-500">
                Será calculado quando entrar ticket e quantidade
              </p>
            </div>
          </section>

          {/* KPIs PRINCIPAIS */}
          <section className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Atendimentos</p>
              <p className="mt-3 text-4xl font-bold text-white">
                {resumo.totalAtendimentos}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Total registrado na loja
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Vendas</p>
              <p className="mt-3 text-4xl font-bold text-white">
                {resumo.totalVendas}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Atendimentos finalizados com venda
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Não vendas</p>
              <p className="mt-3 text-4xl font-bold text-white">
                {resumo.totalNaoVendas}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Clientes que não concluíram compra
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Trocas</p>
              <p className="mt-3 text-4xl font-bold text-white">
                {resumo.totalTrocas}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Trocas registradas no dia
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Trocas com diferença</p>
              <p className="mt-3 text-4xl font-bold text-white">
                {resumo.totalTrocasComDiferenca}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Trocas com ajuste de valor
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}