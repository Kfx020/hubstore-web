"use client";

import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import FinalizarAtendimentoModal from "@/components/FinalizarAtendimentoModal";
import DropZone from "@/components/DropZone";
import DraggableSellerCard from "@/components/DraggableSellerCard";

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

export default function OperacaoPage() {
  /*
    CONTROLE DE MONTAGEM NO CLIENTE

    Por que usei isso:
    o dnd-kit pode gerar atributos internos diferentes
    entre servidor e cliente, causando erro de hidratacao.

    Entao a parte do drag and drop so renderiza
    depois que a pagina realmente monta no navegador.
  */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /*
    ESTADOS PRINCIPAIS DA TELA

    Por que usei useState aqui:
    porque essas listas mudam em tempo real
    e a tela precisa atualizar na hora.
  */
  const [fila, setFila] = useState(["Joana", "Léo", "Josineide"]);
  const [emAtendimento, setEmAtendimento] = useState(["Giuvaneide", "Rafa"]);
  const [foraDaRotatividade, setForaDaRotatividade] = useState([
    "Poliana",
    "Dimas",
    "Vitoria",
  ]);

  /*
    CONTROLE DE HORARIO E HISTORICO

    inicioAtendimento:
    guarda a hora em que cada vendedor entrou em atendimento

    historicoAtendimentos:
    guarda os atendimentos finalizados do dia

    OBS:
    esses dados continuam sendo salvos por tras,
    sem precisar mostrar a hora embaixo do card.
  */
  const [inicioAtendimento, setInicioAtendimento] = useState<
    Record<string, string>
  >({});

  const [historicoAtendimentos, setHistoricoAtendimentos] = useState<
    HistoricoAtendimento[]
  >([]);

  /*
    CONTROLE DO DESTINO DA FINALIZACAO

    destinoFinalizacao:
    guarda para onde o vendedor deve ir
    depois que salvar o modal

    Pode ser:
    - fila
    - foraDaRotatividade
  */
  const [destinoFinalizacao, setDestinoFinalizacao] = useState<
    "fila" | "foraDaRotatividade"
  >("fila");

  /*
    SENSORES DO DRAG AND DROP

    Por que troquei:
    - o DndContext usa Pointer por padrao
    - no toque ele pode dar uma sensacao menos lisa
    - Mouse + Touch fica melhor nesse caso

    Escolhas:
    - Mouse com pequena distancia: evita disparo acidental
    - Touch sem delay: deixa o inicio mais imediato
    - tolerance no touch: da uma pequena folga para o dedo
  */
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  /*
    CONTROLE DO MODAL

    modalAberto:
    controla se o modal aparece

    vendedorSelecionado:
    guarda qual vendedor foi clicado em "Finalizar"
  */
  const [modalAberto, setModalAberto] = useState(false);
  const [vendedorSelecionado, setVendedorSelecionado] = useState<string | null>(
    null
  );

  /*
    FUNCAO AUXILIAR

    Retorna a hora atual formatada.
    Depois isso pode virar data/hora completa.
  */
  function horaAtual() {
    return new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /*
    BOTAO MANUAL: INICIAR PROXIMO

    Mantive esse botao porque ele continua util,
    mesmo com drag and drop.

    Agora, alem de mover para atendimento,
    tambem registra a hora de inicio.
  */
  function iniciarProximo() {
    if (fila.length === 0) return;

    const primeiroDaFila = fila[0];
    const novaFila = fila.slice(1);

    setFila(novaFila);
    setEmAtendimento([...emAtendimento, primeiroDaFila]);

    setInicioAtendimento((prev) => ({
      ...prev,
      [primeiroDaFila]: horaAtual(),
    }));
  }

  /*
    BOTAO MANUAL: TIRAR DA FILA

    Mantive essa acao tambem porque:
    - as vezes o usuario pode preferir clicar
    - serve como apoio ao arrastar
  */
  function tirarDaFila(nome: string) {
    const novaFila = fila.filter((item) => item !== nome);
    setFila(novaFila);
    setForaDaRotatividade([...foraDaRotatividade, nome]);
  }

  /*
    ABRIR MODAL DE FINALIZACAO
  */
  function abrirModal(nome: string, destino: "fila" | "foraDaRotatividade") {
    setVendedorSelecionado(nome);
    setDestinoFinalizacao(destino);
    setModalAberto(true);
  }

  /*
    FECHAR MODAL
  */
  function fecharModal() {
    setModalAberto(false);
    setVendedorSelecionado(null);
    setDestinoFinalizacao("fila");
  }

  /*
    SALVAR FINALIZACAO

    Regra atual:
    - monta um registro no historico
    - remove o vendedor de "Em atendimento"
    - devolve o vendedor para a fila
      OU manda para fora da rotatividade,
      dependendo do destino escolhido
  */
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

    console.log("Demonstracao do atendimento salvo:", registro);

    setHistoricoAtendimentos((prev) => [registro, ...prev]);

    const novoEmAtendimento = emAtendimento.filter(
      (item) => item !== dados.vendedor
    );

    setEmAtendimento(novoEmAtendimento);

    /*
      Aqui decidimos o destino final do vendedor
      depois que o atendimento for salvo.
    */
    if (destinoFinalizacao === "fila") {
      setFila((prev) => [...prev, dados.vendedor]);
    }

    if (destinoFinalizacao === "foraDaRotatividade") {
      setForaDaRotatividade((prev) => [...prev, dados.vendedor]);
    }

    /*
      Limpa o controle da hora de inicio
      porque esse atendimento ja terminou.
    */
    setInicioAtendimento((prev) => {
      const novoControle = { ...prev };
      delete novoControle[dados.vendedor];
      return novoControle;
    });

    fecharModal();
  }

  /*
    FUNCAO PRINCIPAL DO DRAG AND DROP

    active:
    item que foi arrastado

    over:
    area onde ele foi solto
  */
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const nome = active.data.current?.nome as string | undefined;
    const origem = active.data.current?.origem as
      | "fila"
      | "foraDaRotatividade"
      | "emAtendimento"
      | undefined;

    const destino = String(over.id);

    if (!nome || !origem) return;

    /*
      REGRA 1
      fila -> emAtendimento
    */
    if (origem === "fila" && destino === "emAtendimento") {
      setFila((prev) => prev.filter((item) => item !== nome));
      setEmAtendimento((prev) => [...prev, nome]);

      setInicioAtendimento((prev) => ({
        ...prev,
        [nome]: horaAtual(),
      }));

      return;
    }

    /*
      REGRA 2
      fila -> foraDaRotatividade
    */
    if (origem === "fila" && destino === "foraDaRotatividade") {
      setFila((prev) => prev.filter((item) => item !== nome));
      setForaDaRotatividade((prev) => [...prev, nome]);
      return;
    }

    /*
      REGRA 3
      foraDaRotatividade -> fila
    */
    if (origem === "foraDaRotatividade" && destino === "fila") {
      setForaDaRotatividade((prev) => prev.filter((item) => item !== nome));
      setFila((prev) => [...prev, nome]);
      return;
    }

    /*
      REGRA 4
      emAtendimento -> fila

      Arrastar para a lista da vez significa
      que o atendimento sera finalizado.
      O vendedor so volta para a fila quando salvar o modal.
    */
    if (origem === "emAtendimento" && destino === "fila") {
      abrirModal(nome, "fila");
      return;
    }

    /*
      REGRA 5
      emAtendimento -> foraDaRotatividade

      Arrastar para fora da rotatividade significa
      que o atendimento sera finalizado
      e o vendedor nao volta para a fila:
      ele vai para fora da rotatividade quando salvar.
    */
    if (origem === "emAtendimento" && destino === "foraDaRotatividade") {
      abrirModal(nome, "foraDaRotatividade");
      return;
    }
  }

  /*
    Enquanto a pagina ainda nao montou no cliente,
    mostramos uma estrutura simples.

    Isso evita o erro de hidratacao do dnd-kit.
  */
  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 px-4 py-6 text-white md:px-6 md:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[28px] border border-neutral-800 bg-neutral-900/95 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <p className="text-sm text-neutral-400">Carregando operacao...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 px-4 py-6 text-white md:px-6 md:py-8">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-[28px] border border-neutral-800 bg-neutral-900/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
              <Header
                produto="Vezify"
                cliente="Hering"
                loja="Riomar"
                data="13/04/2026"
                status="Online"
              />

              <section className="grid gap-0 xl:grid-cols-[1.15fr_1fr]">
                {/* COLUNA 1: LISTA DA VEZ */}
                <div className="border-b border-neutral-800 xl:border-b-0 xl:border-r">
                  <div className="flex items-center justify-between px-6 pt-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                        OPERACAO
                      </p>
                      <h2 className="mt-2 text-2xl font-bold">Lista da vez</h2>
                    </div>

                    <button
                      onClick={iniciarProximo}
                      className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300"
                    >
                      Iniciar proximo
                    </button>
                  </div>

                  <DropZone
                    id="fila"
                    titulo=""
                    subtitulo=""
                    corTitulo="text-cyan-400"
                  >
                    {fila.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/70 p-6 text-sm text-neutral-400">
                        Nenhum vendedor na fila.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {fila.map((nome, index) => (
                          <DraggableSellerCard
                            key={`fila-${nome}-${index}`}
                            id={`fila-${nome}`}
                            nome={nome}
                            origem="fila"
                            numero={index + 1}
                            mostrarBotao={true}
                            textoBotao="Tirar da fila"
                            onBotaoClick={() => tirarDaFila(nome)}
                            variante="fila"
                          />
                        ))}
                      </div>
                    )}
                  </DropZone>
                </div>

                {/* COLUNA 2: EM ATENDIMENTO */}
                <div className="border-b border-neutral-800 xl:border-b-0">
                  <DropZone
                    id="emAtendimento"
                    titulo="Em atendimento"
                    subtitulo="LOJA EM TEMPO REAL"
                    corTitulo="text-emerald-400"
                  >
                    {emAtendimento.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/70 p-6 text-sm text-neutral-400">
                        Nenhum vendedor em atendimento.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {emAtendimento.map((nome, index) => (
                          <DraggableSellerCard
                            key={`atendimento-${nome}-${index}`}
                            id={`atendimento-${nome}`}
                            nome={nome}
                            origem="emAtendimento"
                            mostrarBotao={true}
                            textoBotao="Finalizar"
                            onBotaoClick={() => abrirModal(nome, "fila")}
                            variante="atendimento"
                          />
                        ))}
                      </div>
                    )}
                  </DropZone>
                </div>
              </section>

              {/* RODAPE: FORA DA ROTATIVIDADE */}
              <footer className="border-t border-neutral-800 px-6 py-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
                      EQUIPE
                    </p>
                    <h2 className="mt-2 text-xl font-bold">
                      Fora da rotatividade
                    </h2>
                  </div>

                  <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-400">
                    Clique ou arraste para entrar na operacao
                  </span>
                </div>

                <DropZone
                  id="foraDaRotatividade"
                  titulo=""
                  subtitulo=""
                  corTitulo="text-amber-400"
                >
                  {foraDaRotatividade.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/70 p-6 text-sm text-neutral-400">
                      Todos os vendedores ja estao na operacao.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {foraDaRotatividade.map((nome, index) => (
                        <div key={`fora-${nome}-${index}`} className="w-fit">
                          <DraggableSellerCard
                            id={`fora-${nome}`}
                            nome={nome}
                            origem="foraDaRotatividade"
                            mostrarBotao={false}
                            variante="fora"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </DropZone>
              </footer>
            </div>
          </div>
        </main>
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
