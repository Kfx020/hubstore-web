"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DraggableSellerCard from "@/components/DraggableSellerCard";
import DropZone from "@/components/DropZone";
import FinalizarAtendimentoModal from "@/components/FinalizarAtendimentoModal";
import Header from "@/components/Header";
import { useAppState } from "@/context/AppStateContext";
import type { Atendimento } from "@/lib/types";

type HistoricoAtendimento = {
  vendedor: string;
  inicio: string;
  fim: string;
  resultado: "Venda" | "Não venda" | "Troca" | "Troca com diferença";
  setor: string;
  categorias: string[];
  motivo: string;
  detalheMotivo: string;
};

type OrigemDrag = "fila" | "foraDaRotatividade" | "emAtendimento";

type ItemArrastando = {
  vendedorId: string;
  nome: string;
  origem: OrigemDrag;
};

type FaixaRotatividadeProps = {
  id: string;
  children: React.ReactNode;
};

function FaixaRotatividade({ id, children }: FaixaRotatividadeProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border border-neutral-800 bg-neutral-950/60 p-2 transition ${
        isOver ? "ring-2 ring-amber-400/50" : ""
      }`}
    >
      {children}
    </div>
  );
}

export default function OperacaoPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);
useEffect(() => {
  if (!mounted) return;

  /*
    Empurra um estado para o historico.
    Assim, quando o usuario fizer o gesto de voltar
    ou clicar no voltar do navegador, conseguimos interceptar.
  */
  window.history.pushState({ vezifyOperacaoGuard: true }, "", window.location.href);

  function handlePopState() {
    const confirmar = window.confirm("Deseja realmente sair do painel?");

    if (confirmar) {
      document.cookie =
        "vezify_auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

      router.replace("/login");
      return;
    }

    /*
      Se cancelar, recoloca o estado no historico
      e continua na operacao.
    */
    window.history.pushState(
      { vezifyOperacaoGuard: true },
      "",
      window.location.href
    );
  }

  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, [mounted, router]);
  const { lojaAtual, vendedores, setVendedores, setAtendimentos } =
    useAppState();

  const fila = vendedores.filter((vendedor) => vendedor.status === "fila");
  const emAtendimento = vendedores.filter(
    (vendedor) => vendedor.status === "emAtendimento"
  );
  const foraDaRotatividade = vendedores.filter(
    (vendedor) => vendedor.status === "foraDaRotatividade"
  );

  const [inicioAtendimento, setInicioAtendimento] = useState<
    Record<string, string>
  >({});

  const [, setHistoricoAtendimentos] = useState<HistoricoAtendimento[]>([]);

  const [destinoFinalizacao, setDestinoFinalizacao] = useState<
    "fila" | "foraDaRotatividade"
  >("fila");

  const [modalAberto, setModalAberto] = useState(false);
  const [vendedorSelecionado, setVendedorSelecionado] = useState<string | null>(
    null
  );

  const [itemArrastando, setItemArrastando] =
    useState<ItemArrastando | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 12,
      },
    }),
    useSensor(KeyboardSensor)
  );

  function horaAtual() {
    return new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function atualizarStatusVendedor(
    vendedorId: string,
    novoStatus: "fila" | "emAtendimento" | "foraDaRotatividade"
  ) {
    setVendedores((prev) =>
      prev.map((vendedor) =>
        vendedor.id === vendedorId
          ? { ...vendedor, status: novoStatus }
          : vendedor
      )
    );
  }

  function abrirModal(nome: string, destino: "fila" | "foraDaRotatividade") {
    setVendedorSelecionado(nome);
    setDestinoFinalizacao(destino);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setVendedorSelecionado(null);
    setDestinoFinalizacao("fila");
  }

  function handleDragStart(event: DragStartEvent) {
    const vendedorId = event.active.data.current?.vendedorId as
      | string
      | undefined;
    const nome = event.active.data.current?.nome as string | undefined;
    const origem = event.active.data.current?.origem as
      | OrigemDrag
      | undefined;

    if (!vendedorId || !nome || !origem) {
      setItemArrastando(null);
      return;
    }

    setItemArrastando({
      vendedorId,
      nome,
      origem,
    });
  }

  function salvarFinalizacao(dados: {
    vendedor: string;
    resultado: "Venda" | "Não venda" | "Troca" | "Troca com diferença";
    setor: string;
    categorias: string[];
    motivo: string;
    detalheMotivo: string;
  }) {
    const horaInicio = inicioAtendimento[dados.vendedor] || "--:--";
    const horaFim = horaAtual();

    const registro: HistoricoAtendimento = {
      vendedor: dados.vendedor,
      inicio: horaInicio,
      fim: horaFim,
      resultado: dados.resultado,
      setor: dados.setor,
      categorias: dados.categorias,
      motivo: dados.motivo,
      detalheMotivo: dados.detalheMotivo,
    };

    setHistoricoAtendimentos((prev) => [registro, ...prev]);

    const vendedor = vendedores.find((item) => item.nome === dados.vendedor);
    if (!vendedor) return;

    const novoAtendimento: Atendimento = {
      id: `atendimento-${Date.now()}`,
      vendedorId: vendedor.id,
      vendedorNome: vendedor.nome,
      lojaId: lojaAtual.id,
      inicio: horaInicio,
      fim: horaFim,
      resultado:
        dados.resultado === "Não venda"
          ? "Nao venda"
          : dados.resultado === "Troca com diferença"
          ? "Troca com diferenca"
          : dados.resultado,
      setor: dados.setor,
      categorias: dados.categorias,
      motivo:
        dados.motivo === "Falta" ||
        dados.motivo === "Tamanho" ||
        dados.motivo === "Preco" ||
        dados.motivo === "Olhadinha" ||
        dados.motivo === "Outro"
          ? dados.motivo
          : "",
      detalheMotivo: dados.detalheMotivo,
      observacao: "",
    };

    setAtendimentos((prev) => [novoAtendimento, ...prev]);

    if (destinoFinalizacao === "fila") {
      atualizarStatusVendedor(vendedor.id, "fila");
    }

    if (destinoFinalizacao === "foraDaRotatividade") {
      atualizarStatusVendedor(vendedor.id, "foraDaRotatividade");
    }

    setInicioAtendimento((prev) => {
      const novoControle = { ...prev };
      delete novoControle[dados.vendedor];
      return novoControle;
    });

    fecharModal();
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setItemArrastando(null);

    if (!over) return;

    const vendedorId = active.data.current?.vendedorId as string | undefined;
    const nome = active.data.current?.nome as string | undefined;
    const origem = active.data.current?.origem as OrigemDrag | undefined;

    const destino = String(over.id);

    if (!vendedorId || !nome || !origem) return;

    if (origem === "fila" && destino === "emAtendimento") {
      atualizarStatusVendedor(vendedorId, "emAtendimento");

      setInicioAtendimento((prev) => ({
        ...prev,
        [nome]: horaAtual(),
      }));

      return;
    }

    if (origem === "fila" && destino === "foraDaRotatividade") {
      atualizarStatusVendedor(vendedorId, "foraDaRotatividade");
      return;
    }

    if (origem === "foraDaRotatividade" && destino === "fila") {
      atualizarStatusVendedor(vendedorId, "fila");
      return;
    }

    if (origem === "emAtendimento" && destino === "fila") {
      abrirModal(nome, "fila");
      return;
    }

    if (origem === "emAtendimento" && destino === "foraDaRotatividade") {
      abrirModal(nome, "foraDaRotatividade");
      return;
    }
  }

  if (!mounted) {
    return (
      <main className="h-[100dvh] overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 px-2 py-2 text-white sm:px-4 sm:py-4">
        <div className="mx-auto h-full max-w-7xl">
          <div className="flex h-full items-center justify-center overflow-hidden rounded-[24px] border border-neutral-800 bg-neutral-900/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <p className="text-sm text-neutral-400">Carregando operação...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setItemArrastando(null)}
      >
        <main className="h-[100dvh] overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 px-2 py-2 text-white sm:px-4 sm:py-4">
          <div className="mx-auto h-full max-w-7xl">
            <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-neutral-800 bg-neutral-900/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:rounded-[28px]">
              <Header
                produto="Vezify"
                cliente="Hering"
                loja={lojaAtual.nome}
                data="13/04/2026"
                status="Online"
              />

              <div className="flex min-h-0 flex-1 flex-col">
                <section className="grid min-h-0 flex-1 grid-cols-2 border-b border-neutral-800">
                  {/* LISTA DA VEZ */}
                  <div className="flex min-h-0 flex-col border-r border-neutral-800">
                    <div className="px-3 pb-2 pt-3 sm:px-4 sm:pt-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400 sm:text-xs">
                        OPERAÇÃO
                      </p>
                      <h2 className="mt-1 text-lg font-bold sm:mt-2 sm:text-2xl">
                        Lista da vez
                      </h2>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 sm:px-4 sm:pb-4">
                      <DropZone
                        id="fila"
                        titulo=""
                        subtitulo=""
                        corTitulo="text-cyan-400"
                      >
                        {fila.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/70 p-4 text-xs text-neutral-400 sm:p-5 sm:text-sm">
                            Nenhum vendedor na fila.
                          </div>
                        ) : (
                          <div className="space-y-2 sm:space-y-3">
                            {fila.map((vendedor, index) => (
                              <DraggableSellerCard
                                key={`fila-${vendedor.id}`}
                                id={`fila-${vendedor.id}`}
                                vendedorId={vendedor.id}
                                nome={vendedor.nome}
                                origem="fila"
                                numero={index + 1}
                                mostrarBotao={true}
                                textoBotao="Tirar"
                                onBotaoClick={() =>
                                  atualizarStatusVendedor(
                                    vendedor.id,
                                    "foraDaRotatividade"
                                  )
                                }
                                variante="fila"
                              />
                            ))}
                          </div>
                        )}
                      </DropZone>
                    </div>
                  </div>

                  {/* EM ATENDIMENTO */}
                  <div className="flex min-h-0 flex-col">
                    <div className="px-3 pb-2 pt-3 sm:px-4 sm:pt-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 sm:text-xs">
                        LOJA EM TEMPO REAL
                      </p>
                      <h2 className="mt-1 text-lg font-bold sm:mt-2 sm:text-2xl">
                        Em atendimento
                      </h2>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 sm:px-4 sm:pb-4">
                      <DropZone
                        id="emAtendimento"
                        titulo=""
                        subtitulo=""
                        corTitulo="text-emerald-400"
                      >
                        {emAtendimento.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/70 p-4 text-xs text-neutral-400 sm:p-5 sm:text-sm">
                            Nenhum vendedor em atendimento.
                          </div>
                        ) : (
                          <div className="space-y-2 sm:space-y-3">
                            {emAtendimento.map((vendedor, index) => (
                              <DraggableSellerCard
                                key={`atendimento-${vendedor.id}-${index}`}
                                id={`atendimento-${vendedor.id}`}
                                vendedorId={vendedor.id}
                                nome={vendedor.nome}
                                origem="emAtendimento"
                                mostrarBotao={true}
                                textoBotao="Finalizar"
                                onBotaoClick={() =>
                                  abrirModal(vendedor.nome, "fila")
                                }
                                variante="atendimento"
                              />
                            ))}
                          </div>
                        )}
                      </DropZone>
                    </div>
                  </div>
                </section>

                {/* FORA DA ROTATIVIDADE */}
                <footer className="mt-auto shrink-0 border-t border-neutral-800 px-3 py-2 sm:px-4 sm:py-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400 sm:text-xs">
                        EQUIPE
                      </p>
                      <h2 className="mt-1 text-base font-bold sm:text-lg">
                        Fora da rotatividade
                      </h2>
                    </div>

                    <span className="hidden rounded-full border border-neutral-700 px-2 py-1 text-center text-[10px] text-neutral-400 md:inline-flex">
                      Arraste para a lista
                    </span>
                  </div>

                  {foraDaRotatividade.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/70 p-3 text-xs text-neutral-400 sm:p-4 sm:text-sm">
                      Todos os vendedores já estão na operação.
                    </div>
                  ) : (
                    <FaixaRotatividade id="foraDaRotatividade">
                      <div className="-mx-1 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x">
                        <div className="flex w-max min-w-full gap-2 px-1">
                          {foraDaRotatividade.map((vendedor) => (
                            <div
                              key={`fora-${vendedor.id}`}
                              className="shrink-0"
                            >
                              <DraggableSellerCard
                                id={`fora-${vendedor.id}`}
                                vendedorId={vendedor.id}
                                nome={vendedor.nome}
                                origem="foraDaRotatividade"
                                mostrarBotao={false}
                                variante="fora"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </FaixaRotatividade>
                  )}
                </footer>
              </div>
            </div>
          </div>
        </main>

        <DragOverlay zIndex={9999}>
          {itemArrastando ? (
            <div className="pointer-events-none">
              <DraggableSellerCard
                id={`overlay-${itemArrastando.vendedorId}`}
                vendedorId={itemArrastando.vendedorId}
                nome={itemArrastando.nome}
                origem={itemArrastando.origem}
                variante={
                  itemArrastando.origem === "fila"
                    ? "fila"
                    : itemArrastando.origem === "emAtendimento"
                    ? "atendimento"
                    : "fora"
                }
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <FinalizarAtendimentoModal
        aberto={modalAberto}
        vendedor={vendedorSelecionado}
        onFechar={fecharModal}
        onSalvar={salvarFinalizacao}
      />
    </>
  );
}