"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/*
  PROPS DO CABECALHO

  produto:
  nome do sistema

  cliente:
  nome do cliente atual

  loja:
  loja em operacao

  data:
  data base que voce quer mostrar

  status:
  status atual do sistema
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
  /*
    HORA ATUAL DO SISTEMA

    Por que usei useState:
    porque a hora muda em tempo real na tela

    Por que usei useEffect:
    para atualizar automaticamente a cada segundo
  */
  const [horaAtual, setHoraAtual] = useState("");

  useEffect(() => {
    function atualizarHora() {
      const hora = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setHoraAtual(hora);
    }

    /*
      Atualiza assim que o componente carregar
      para nao esperar 1 segundo na primeira exibicao
    */
    atualizarHora();

    /*
      setInterval faz o relogio andar sozinho
    */
    const intervalo = setInterval(atualizarHora, 1000);

    /*
      Limpamos o intervalo quando o componente sair da tela
      para evitar consumo desnecessario
    */
    return () => clearInterval(intervalo);
  }, []);

  return (
    <header className="border-b border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 px-6 py-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* 
          BLOCO ESQUERDO

          Aqui deixei a identidade da operacao:
          - nome do sistema
          - descricao curta
          - cliente
          - loja
          - data e hora lado a lado
        */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            {produto}
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            Painel operacional de atendimento da loja
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {/* Cliente */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                Cliente
              </p>
              <p className="mt-1 text-sm font-medium text-white">{cliente}</p>
            </div>

            {/* Loja */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                Loja
              </p>
              <p className="mt-1 text-sm font-medium text-white">{loja}</p>
            </div>

            {/* Data */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                Data
              </p>
              <p className="mt-1 text-sm font-medium text-white">{data}</p>
            </div>

            {/* Hora atual */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                Hora atual
              </p>
              <p className="mt-1 text-sm font-medium text-cyan-300">
                {horaAtual || "--:--:--"}
              </p>
            </div>
          </div>
        </div>

        {/* 
          BLOCO DIREITO

          Aqui deixei:
          - status
          - atalhos de navegacao

          Escolhi separar do bloco esquerdo
          para o topo respirar mais e ficar mais organizado.
        */}
        <div className="flex min-w-[220px] flex-col gap-3 lg:items-end">
          {/* Status do sistema */}
          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
            Status: {status}
          </div>

          {/* Botoes de navegacao */}
          <div className="flex flex-wrap gap-2 lg:justify-end">
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