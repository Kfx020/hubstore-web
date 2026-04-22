"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSSProperties } from "react";

type Origem = "fila" | "foraDaRotatividade" | "emAtendimento";

type DraggableSellerCardProps = {
  id: string;
  vendedorId: string;
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
  vendedorId,
  nome,
  origem,
  numero,
  mostrarBotao = false,
  textoBotao,
  onBotaoClick,
  variante = "fila",
}: DraggableSellerCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        vendedorId,
        nome,
        origem,
      },
    });

  const style: CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.72 : 1,
    touchAction: variante === "fora" ? "pan-x" : "none",
    cursor:
      variante === "fora"
        ? "default"
        : isDragging
        ? "grabbing"
        : "grab",
  };

  const cardClasses =
    variante === "fila"
      ? "flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-4 shadow-lg shadow-black/20 transition-all duration-200 hover:border-cyan-400/40 hover:-translate-y-[1px]"
      : variante === "atendimento"
      ? "flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-4 shadow-lg shadow-black/20 transition-all duration-200 hover:border-emerald-400/40 hover:-translate-y-[1px]"
      : "flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm transition-all duration-200 hover:border-amber-400/40 hover:bg-neutral-800";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(variante !== "fora" ? listeners : {})}
      {...(variante !== "fora" ? attributes : {})}
      className={`${cardClasses} ${
        isDragging ? "ring-2 ring-cyan-400/30 shadow-2xl shadow-cyan-950/20" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {variante === "fila" && typeof numero === "number" && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-bold text-cyan-300">
            {numero}
          </div>
        )}

        {variante === "atendimento" && (
          <div className="h-3 w-3 rounded-full bg-emerald-400" />
        )}

        {variante === "fora" && (
          <button
            type="button"
            {...listeners}
            {...attributes}
            onPointerDown={(event) => event.stopPropagation()}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-700 text-[10px] text-neutral-400 transition hover:bg-neutral-800 active:scale-95"
            style={{
              touchAction: "none",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            aria-label={`Arrastar ${nome}`}
          >
            ⋮⋮
          </button>
        )}

        <span className="font-medium whitespace-nowrap">{nome}</span>
      </div>

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