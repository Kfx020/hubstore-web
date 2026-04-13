"use client";

import { useState } from "react";
import Header from "@/components/Header";
import QueueList from "@/components/QueueList";
import FinalizarAtendimentoModal from "@/components/FinalizarAtendimentoModal";

export default function OperacaoPage() {
  // Lista de vendedores aguardando atendimento
  const [fila, setFila] = useState(["Joana", "Léo", "Josineide"]);

  // Lista de vendedores atendendo no momento
  const [emAtendimento, setEmAtendimento] = useState([
    "Giuvaneide",
    "Rafa",
  ]);

  // Lista de vendedores fora da operação naquele momento
  const [foraDaRotatividade, setForaDaRotatividade] = useState([
    "Poliana",
    "Dimas",
    "Vitoria",
  ]);

  // Controle do modal de finalização
  const [modalAberto, setModalAberto] = useState(false);
  const [vendedorSelecionado, setVendedorSelecionado] = useState<string | null>(
    null
  );

  // Move o primeiro da fila para "Em atendimento"
  function iniciarProximo() {
    if (fila.length === 0) return;

    const primeiroDaFila = fila[0];
    const novaFila = fila.slice(1);

    setFila(novaFila);
    setEmAtendimento([...emAtendimento, primeiroDaFila]);
  }

  // Remove o vendedor da fila e manda para fora da rotatividade
  function tirarDaFila(nome: string) {
    const novaFila = fila.filter((item) => item !== nome);
    setFila(novaFila);
    setForaDaRotatividade([...foraDaRotatividade, nome]);
  }

  // Coloca vendedor de volta na operação
  function ativarVendedor(nome: string) {
    const novaListaFora = foraDaRotatividade.filter((item) => item !== nome);
    setForaDaRotatividade(novaListaFora);
    setFila([...fila, nome]);
  }

  // Abre o modal para finalizar atendimento
  function abrirModal(nome: string) {
    setVendedorSelecionado(nome);
    setModalAberto(true);
  }

  // Fecha o modal
  function fecharModal() {
    setModalAberto(false);
    setVendedorSelecionado(null);
  }

  // Salva a finalização e devolve o vendedor ao fim da fila
  function salvarFinalizacao(dados: {
    vendedor: string;
    resultado: "Venda" | "Não venda" | "Troca" | "Troca com diferença";
    setor: string;
    categorias: string[];
    motivo: string;
  }) {
    console.log("Demonstração do atendimento salvo:", dados);

    const novoEmAtendimento = emAtendimento.filter(
      (item) => item !== dados.vendedor
    );

    setEmAtendimento(novoEmAtendimento);
    setFila([...fila, dados.vendedor]);

    fecharModal();
  }

  return (
    <>
      <main className="min-h-screen bg-neutral-950 text-white px-6 py-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
          {/* Cabeçalho importado da pasta components */}
          <Header
            produto="HUBStore"
            cliente="Hering"
            loja="Riomar"
            data="13/04/2026"
            status="Online"
          />

          <section className="grid gap-0 md:grid-cols-2">
            {/* Bloco da fila */}
            <div className="border-b border-neutral-800 md:border-b-0 md:border-r">
              <div className="flex items-center justify-between p-6 pb-0">
                <h2 className="text-xl font-semibold">Lista da vez</h2>

                <button
                  onClick={iniciarProximo}
                  className="rounded-lg border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-800"
                >
                  Iniciar próximo
                </button>
              </div>

              <div className="p-6 pt-6">
                {/* Componente da fila */}
                <QueueList fila={fila} onRemoverDafila={tirarDaFila} />
              </div>
            </div>

            {/* Bloco dos vendedores em atendimento */}
            <div className="min-h-[420px] border-b border-neutral-800 p-6">
              <h2 className="mb-6 text-xl font-semibold">Em atendimento</h2>

              {emAtendimento.length === 0 ? (
                <p className="text-sm text-neutral-400">
                  Nenhum vendedor em atendimento.
                </p>
              ) : (
                <div className="space-y-3">
                  {emAtendimento.map((nome, index) => (
                    <div
                      key={`${nome}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
                    >
                      <span className="font-medium">{nome}</span>

                      <button
                        onClick={() => abrirModal(nome)}
                        className="rounded-lg border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-800"
                      >
                        Finalizar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Rodapé com vendedores fora da operação */}
          <footer className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-green-400">
              Fora da rotatividade
            </h2>

            {foraDaRotatividade.length === 0 ? (
              <p className="text-sm text-neutral-400">
                Todos os vendedores já estão na operação.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {foraDaRotatividade.map((nome, index) => (
                  <button
                    key={`${nome}-${index}`}
                    onClick={() => ativarVendedor(nome)}
                    className="rounded-full border border-neutral-700 bg-neutral-950 px-4 py-2 hover:bg-neutral-800"
                  >
                    {nome}
                  </button>
                ))}
              </div>
            )}

            <p className="mt-4 text-sm text-neutral-500">
              Clique no vendedor para colocá-lo na operação do dia.
            </p>
          </footer>
        </div>
      </main>

      {/* Modal de finalização */}
      <FinalizarAtendimentoModal
        aberto={modalAberto}
        vendedor={vendedorSelecionado}
        onFechar={fecharModal}
        onSalvar={salvarFinalizacao}
      />
    </>
  );
}