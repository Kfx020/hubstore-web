"use client";

import { useDroppable } from "@dnd-kit/core";

type DropZoneProps = {
  id: string;
  titulo: string;
  subtitulo: string;
  corTitulo: string;
  children: React.ReactNode;
};

export default function DropZone({
  id,
  titulo,
  subtitulo,
  corTitulo,
  children,
}: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full min-h-[420px] flex-1 flex-col rounded-2xl transition ${
        isOver ? "ring-2 ring-cyan-400/60" : ""
      }`}
    >
      {(titulo || subtitulo) && (
        <div className="px-6 pt-6">
          {subtitulo && (
            <p className={`text-xs uppercase tracking-[0.25em] ${corTitulo}`}>
              {subtitulo}
            </p>
          )}

          {titulo && <h2 className="mt-2 text-2xl font-bold">{titulo}</h2>}
        </div>
      )}

      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}