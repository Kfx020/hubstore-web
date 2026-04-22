"use client";

import { useMemo } from "react";

import Header from "@/components/Header";
import BackToOperationButton from "@/components/BackToOperationButton";
import { useAppState } from "@/context/AppStateContext";

export default function MetasPage() {
  const { lojaAtual, vendedores } = useAppState();

  const vendedoresAtivosLoja = useMemo(() => {
    return vendedores.filter(
      (vendedor) => vendedor.lojaId === lojaAtual.id && vendedor.ativo
    );
  }, [vendedores, lojaAtual.id]);

  const metas = useMemo(() => {
    const metaMensalLoja = lojaAtual.valorMetaMes;

    const diasOperacionaisMes = lojaAtual.diasOperacaoSemana.length * 4;

    const metaDiariaLoja =
      diasOperacionaisMes > 0 ? metaMensalLoja / diasOperacionaisMes : 0;

    const quantidadeVendedores = vendedoresAtivosLoja.length;

    const metaMensalPorVendedor =
      quantidadeVendedores > 0
        ? metaMensalLoja / quantidadeVendedores
        : 0;

    const metaDiariaPorVendedor =
      quantidadeVendedores > 0
        ? metaDiariaLoja / quantidadeVendedores
        : 0;

    return {
      metaMensalLoja,
      diasOperacionaisMes,
      metaDiariaLoja,
      quantidadeVendedores,
      metaMensalPorVendedor,
      metaDiariaPorVendedor,
    };
  }, [lojaAtual, vendedoresAtivosLoja]);

  function formatarMoeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
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
                  Metas da operação
                </p>

                <h2 className="mt-2 text-3xl font-bold">Metas</h2>

                <p className="mt-2 text-sm text-neutral-400">
                  Visão inicial da meta da loja e da distribuição por vendedor.
                </p>
              </div>

             <BackToOperationButton
                label="Voltar para operação"
                className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            />
            </div>
          </section>

          <section className="grid gap-4 border-b border-neutral-800 p-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Meta mensal da loja</p>
              <p className="mt-3 text-3xl font-bold text-white">
                {formatarMoeda(metas.metaMensalLoja)}
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Dias operacionais no mês</p>
              <p className="mt-3 text-3xl font-bold text-white">
                {metas.diasOperacionaisMes}
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Meta diária da loja</p>
              <p className="mt-3 text-3xl font-bold text-white">
                {formatarMoeda(metas.metaDiariaLoja)}
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Vendedores ativos</p>
              <p className="mt-3 text-3xl font-bold text-white">
                {metas.quantidadeVendedores}
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Meta mensal por vendedor</p>
              <p className="mt-3 text-3xl font-bold text-white">
                {formatarMoeda(metas.metaMensalPorVendedor)}
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Meta diária por vendedor</p>
              <p className="mt-3 text-3xl font-bold text-white">
                {formatarMoeda(metas.metaDiariaPorVendedor)}
              </p>
            </div>
          </section>

          <section className="p-6">
            <h3 className="text-xl font-bold text-white">
              Distribuição por vendedor
            </h3>

            <div className="mt-4 space-y-3">
              {vendedoresAtivosLoja.map((vendedor) => (
                <div
                  key={vendedor.id}
                  className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-4"
                >
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {vendedor.nome}
                    </p>
                    <p className="text-sm text-neutral-400">
                      Código: {vendedor.codigo || "--"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-neutral-400">Meta diária</p>
                    <p className="text-lg font-bold text-white">
                      {formatarMoeda(metas.metaDiariaPorVendedor)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}