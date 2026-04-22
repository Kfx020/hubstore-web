"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const router = useRouter();
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

    atualizarHora();

    const intervalo = setInterval(atualizarHora, 1000);

    return () => clearInterval(intervalo);
  }, []);

  function handleSair() {
    const confirmarSaida = window.confirm("Deseja realmente sair?");

    if (!confirmarSaida) {
      return;
    }

    document.cookie =
      "vezify_auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

    router.push("/login");
  }

  return (
    <header className="border-b border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 px-3 py-3 sm:px-4 sm:py-4">
      <div className="flex flex-col gap-2">
        {/* LINHA 1 */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {produto}
            </h1>
            <p className="text-[11px] text-neutral-400 sm:text-xs">
              Painel operacional
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-300 sm:text-xs">
              Status: {status}
            </div>

            <button
              onClick={handleSair}
              className="rounded-full border border-neutral-700 bg-neutral-950/70 px-3 py-1.5 text-[11px] font-medium text-neutral-300 transition hover:bg-neutral-800 sm:text-xs"
            >
              Sair
            </button>
          </div>
        </div>

        {/* LINHA 2 */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-300 sm:text-xs">
          <span className="rounded-full border border-neutral-700 bg-neutral-950/70 px-2.5 py-1">
            {cliente}
          </span>

          <span className="rounded-full border border-neutral-700 bg-neutral-950/70 px-2.5 py-1">
            {loja}
          </span>

          <span className="rounded-full border border-neutral-700 bg-neutral-950/70 px-2.5 py-1">
            {data}
          </span>

          <span className="rounded-full border border-neutral-700 bg-neutral-950/70 px-2.5 py-1 text-cyan-300">
            {horaAtual || "--:--:--"}
          </span>
        </div>

        {/* LINHA 3 */}
        <div className="flex justify-end gap-2">
          <Link
            href="/resumo"
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-center text-[11px] font-medium text-white transition hover:bg-neutral-800 sm:text-xs"
          >
            Resumo
          </Link>

          <Link
            href="/ranking"
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-center text-[11px] font-medium text-white transition hover:bg-neutral-800 sm:text-xs"
          >
            Ranking
          </Link>

          <Link
            href="/metas"
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-center text-[11px] font-medium text-white transition hover:bg-neutral-800 sm:text-xs"
          >
            Metas
          </Link>
        </div>
      </div>
    </header>
  );
}