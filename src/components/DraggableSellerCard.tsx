"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSSProperties } from "react";

/*
  ORIGEM DO VENDEDOR

  Agora temos 3 origens:
  - fila
  - foraDaRotatividade
  - emAtendimento
*/
type Origem = "fila" | "foraDaRotatividade" | "emAtendimento";

/*
  PROPS DO CARD
*/
type DraggableSellerCardProps = {
  id: string;
  nome: string;
  origem: Origem;
  numero?: number;
  mostrarBotao?: boolean;
  textoBotao?: string;
  onBotaoClick?: () => void;
  variante?: "fila" | "fora" | "atendimento";
};

export default function DraggableSellerCard({
  id,
  nome,
  origem,
  numero,
  mostrarBotao = false,
  textoBotao,
  onBotaoClick,
  variante = "fila",
}: DraggableSellerCardProps) {
  /*
    useDraggable transforma o card inteiro em item arrastavel.
  */
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        nome,
        origem,
      },
    });

  /*
    style controla o movimento visual do card enquanto ele e arrastado.
  */
  const style: CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.65 : 1,
    touchAction: "none",
  };

  /*
    Variantes visuais:
    - fila = card maior com numero
    - atendimento = card com indicador verde
    - fora = card menor
  */
  const cardClasses =
    variante === "fila"
      ? "flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-4 shadow-lg shadow-black/20 transition hover:border-cyan-400/40"
      : variante === "atendimento"
      ? "flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-4 shadow-lg shadow-black/20 transition hover:border-emerald-400/40"
      : "rounded-full border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm transition hover:border-amber-400/40 hover:bg-neutral-800";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cardClasses}
    >
      <div className="flex items-center gap-3">
        {/* Numero da posicao na fila */}
        {variante === "fila" && typeof numero === "number" && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-bold text-cyan-300">
            {numero}
          </div>
        )}

        {/* Indicador visual de atendimento */}
        {variante === "atendimento" && (
          <div className="h-3 w-3 rounded-full bg-emerald-400" />
        )}

        <span className="font-medium">{nome}</span>
      </div>

      {/* 
        Botao lateral opcional

        stopPropagation impede que o clique no botao
        seja entendido como inicio do arrasto
      */}
      {mostrarBotao && textoBotao && onBotaoClick && (
        <button
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onBotaoClick}
          className="rounded-xl border border-neutral-700 px-3 py-2 text-sm text-neutral-200 transition hover:bg-neutral-800"
        >
          {textoBotao}
        </button>
      )}
    </div>
  );
}