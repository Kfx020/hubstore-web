"use client";

import { useMemo } from "react";

import BackToOperationButton from "@/components/BackToOperationButton";
import Header from "@/components/Header";
import { useAppState } from "@/context/AppStateContext";
import { calcularResumoMetasLoja, formatarMoeda } from "@/lib/calculations";

export default function MetasPage() {
  const { lojaAtual, clienteAtual, marcaAtual, dataOperacao, vendedores } =
    useAppState();

  const vendedoresAtivosLoja = useMemo(() => {
    return vendedores.filter(
      (vendedor) => vendedor.lojaId === lojaAtual.id && vendedor.ativo
    );
  }, [vendedores, lojaAtual.id]);

  const metas = useMemo(() => {
    return calcularResumoMetasLoja(lojaAtual, vendedoresAtivosLoja);
  }, [lojaAtual, vendedoresAtivosLoja]);

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
                  Metas da operacao
                </p>

                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Metas</h2>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Visao inicial da meta da loja e da distribuicao por vendedor.
                </p>
              </div>

              <BackToOperationButton
                label="Voltar para operacao"
                className="w-full rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 sm:w-auto"
              />
            </div>
          </section>

          <section className="grid gap-4 border-b border-neutral-800 p-4 sm:p-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Meta mensal da loja</p>
              <p className="mt-3 break-words text-2xl font-bold text-white sm:text-3xl">
                {formatarMoeda(metas.metaMensalLoja)}
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Dias operacionais no mes</p>
              <p className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                {metas.diasOperacionaisMes}
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5 md:col-span-2 xl:col-span-1">
              <p className="text-sm text-neutral-400">Meta diaria da loja</p>
              <p className="mt-3 break-words text-2xl font-bold text-white sm:text-3xl">
                {formatarMoeda(metas.metaDiariaLoja)}
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Vendedores ativos</p>
              <p className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                {metas.quantidadeVendedores}
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Meta mensal por vendedor</p>
              <p className="mt-3 break-words text-2xl font-bold text-white sm:text-3xl">
                {formatarMoeda(metas.metaMensalPorVendedor)}
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-400">Meta diaria por vendedor</p>
              <p className="mt-3 break-words text-2xl font-bold text-white sm:text-3xl">
                {formatarMoeda(metas.metaDiariaPorVendedor)}
              </p>
            </div>
          </section>

          <section className="p-4 sm:p-6">
            <h3 className="text-xl font-bold text-white">
              Distribuicao por vendedor
            </h3>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {vendedoresAtivosLoja.map((vendedor) => (
                <div
                  key={vendedor.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-white">
                        {vendedor.nome}
                      </p>
                      <p className="text-sm text-neutral-400">
                        Codigo: {vendedor.codigo || "--"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 px-4 py-3 sm:min-w-[180px] sm:text-right">
                      <p className="text-sm text-neutral-400">Meta diaria</p>
                      <p className="mt-1 break-words text-lg font-bold text-white">
                        {formatarMoeda(metas.metaDiariaPorVendedor)}
                      </p>
                    </div>
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
