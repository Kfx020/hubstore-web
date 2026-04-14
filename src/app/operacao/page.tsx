"use client";

/*
  "use client" diz ao Next.js que esta página terá interação no navegador.
  Aqui precisamos disso porque usamos:
  - useState
  - clique em botões
  - abrir e fechar modal
*/

import { useState } from "react";

/*
  Componente do cabeçalho:
  mostra nome do sistema, cliente, loja, data e status
*/
import Header from "@/components/Header";

/*
  Componente do modal:
  abre quando clicamos em "Finalizar"
  e recebe os dados do fechamento do atendimento
*/
import FinalizarAtendimentoModal from "@/components/FinalizarAtendimentoModal";

export default function OperacaoPage() {
  /*
    ESTADOS PRINCIPAIS DA TELA

    useState guarda valores que podem mudar enquanto a tela está aberta.
    Quando um desses valores muda, a tela atualiza automaticamente.
  */

  // Lista de vendedores que estão aguardando atendimento
  const [fila, setFila] = useState(["Joana", "Léo", "Josineide"]);

  // Lista de vendedores que estão atendendo no momento
  const [emAtendimento, setEmAtendimento] = useState([
    "Giuvaneide",
    "Rafa",
  ]);

  // Lista de vendedores que estão fora da operação naquele momento
  const [foraDaRotatividade, setForaDaRotatividade] = useState([
    "Poliana",
    "Dimas",
    "Vitoria",
  ]);

  /*
    CONTROLE DO MODAL

    modalAberto:
    - true = modal aberto
    - false = modal fechado

    vendedorSelecionado:
    guarda o nome do vendedor que foi clicado para finalizar
  */
  const [modalAberto, setModalAberto] = useState(false);
  const [vendedorSelecionado, setVendedorSelecionado] = useState<string | null>(
    null
  );

  /*
    FUNÇÃO: iniciarProximo

    O que ela faz:
    - pega o primeiro vendedor da fila
    - remove ele da fila
    - adiciona ele em "Em atendimento"
  */
  function iniciarProximo() {
    // Se a fila estiver vazia, não faz nada
    if (fila.length === 0) return;

    // Pega o primeiro nome da fila
    const primeiroDaFila = fila[0];

    // Cria uma nova fila sem o primeiro nome
    const novaFila = fila.slice(1);

    // Atualiza a fila
    setFila(novaFila);

    // Coloca o vendedor em atendimento
    setEmAtendimento([...emAtendimento, primeiroDaFila]);
  }

  /*
    FUNÇÃO: tirarDaFila

    O que ela faz:
    - remove o vendedor da fila
    - manda ele para "Fora da rotatividade"
  */
  function tirarDaFila(nome: string) {
    // Cria uma nova fila sem o vendedor clicado
    const novaFila = fila.filter((item) => item !== nome);

    // Atualiza a fila
    setFila(novaFila);

    // Adiciona o vendedor em "Fora da rotatividade"
    setForaDaRotatividade([...foraDaRotatividade, nome]);
  }

  /*
    FUNÇÃO: ativarVendedor

    O que ela faz:
    - tira o vendedor de "Fora da rotatividade"
    - adiciona ele no fim da fila
  */
  function ativarVendedor(nome: string) {
    // Remove o vendedor da lista de fora da rotatividade
    const novaListaFora = foraDaRotatividade.filter((item) => item !== nome);

    // Atualiza a lista de fora da rotatividade
    setForaDaRotatividade(novaListaFora);

    // Coloca o vendedor no final da fila
    setFila([...fila, nome]);
  }

  /*
    FUNÇÃO: abrirModal

    O que ela faz:
    - guarda o vendedor clicado
    - abre o modal
  */
  function abrirModal(nome: string) {
    setVendedorSelecionado(nome);
    setModalAberto(true);
  }

  /*
    FUNÇÃO: fecharModal

    O que ela faz:
    - fecha o modal
    - limpa o vendedor selecionado
  */
  function fecharModal() {
    setModalAberto(false);
    setVendedorSelecionado(null);
  }

  /*
    FUNÇÃO: salvarFinalizacao

    O que ela faz:
    - recebe os dados preenchidos no modal
    - mostra esses dados no console do navegador
    - remove o vendedor da área "Em atendimento"
    - devolve o vendedor para o fim da fila
    - fecha o modal

    OBS:
    por enquanto isso é só demonstração de MVP
    depois esses dados vão para API e banco
  */
  function salvarFinalizacao(dados: {
    vendedor: string;
    resultado: "Venda" | "Não venda" | "Troca" | "Troca com diferença";
    setor: string;
    categorias: string[];
    motivo: string;
  }) {
    // Mostra no console os dados salvos na demonstração
    console.log("Demonstração do atendimento salvo:", dados);

    // Remove o vendedor da lista "Em atendimento"
    const novoEmAtendimento = emAtendimento.filter(
      (item) => item !== dados.vendedor
    );

    // Atualiza a lista de atendimento
    setEmAtendimento(novoEmAtendimento);

    // Coloca o vendedor no final da fila novamente
    setFila([...fila, dados.vendedor]);

    // Fecha o modal
    fecharModal();
  }

  return (
    <>
      {/* 
        BLOCO PRINCIPAL DA TELA

        Aqui começa toda a área visível da página /operacao
      */}
      <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 px-4 py-6 text-white md:px-6 md:py-8">
        <div className="mx-auto max-w-7xl">
          {/* 
            CONTAINER GERAL

            Esse bloco é a "caixa" grande do sistema
            que envolve cabeçalho, operação e rodapé
          */}
          <div className="overflow-hidden rounded-[28px] border border-neutral-800 bg-neutral-900/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            {/* Cabeçalho do sistema */}
            <Header
              produto="HUBStore"
              cliente="Hering"
              loja="Riomar"
              data="13/04/2026"
              status="Online"
            />

            {/* 
              ÁREA CENTRAL DA OPERAÇÃO

              Divide a tela em 2 colunas:
              - esquerda = Lista da vez
              - direita = Em atendimento
            */}
            <section className="grid gap-0 xl:grid-cols-[1.15fr_1fr]">
              {/* COLUNA ESQUERDA: LISTA DA VEZ */}
              <div className="border-b border-neutral-800 xl:border-b-0 xl:border-r">
                {/* Cabeçalho interno da fila */}
                <div className="flex items-center justify-between px-6 pt-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                      OPERAÇÃO
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">Lista da vez</h2>
                  </div>

                  {/* Botão que manda o primeiro da fila para atendimento */}
                  <button
                    onClick={iniciarProximo}
                    className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300"
                  >
                    Iniciar próximo
                  </button>
                </div>

                {/* Lista visual da fila */}
                <div className="p-6">
                  {fila.length === 0 ? (
                    /*
                      Se a fila estiver vazia,
                      mostra esta mensagem
                    */
                    <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/70 p-6 text-sm text-neutral-400">
                      Nenhum vendedor na fila.
                    </div>
                  ) : (
                    /*
                      Se existir fila,
                      percorremos todos os vendedores com map()
                    */
                    <div className="space-y-3">
                      {fila.map((nome, index) => (
                        <div
                          key={`${nome}-${index}`}
                          className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-4 shadow-lg shadow-black/20 transition hover:border-cyan-400/40"
                        >
                          {/* Lado esquerdo do card da fila */}
                          <div className="flex items-center gap-3">
                            {/* Número da posição na fila */}
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-bold text-cyan-300">
                              {index + 1}
                            </div>

                            {/* Nome do vendedor */}
                            <span className="font-medium">{nome}</span>
                          </div>

                          {/* Botão para remover da fila */}
                          <button
                            onClick={() => tirarDaFila(nome)}
                            className="rounded-xl border border-neutral-700 px-3 py-2 text-sm text-neutral-200 transition hover:bg-neutral-800"
                          >
                            Tirar da fila
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* COLUNA DIREITA: EM ATENDIMENTO */}
              <div className="border-b border-neutral-800 xl:border-b-0">
                {/* Cabeçalho interno do atendimento */}
                <div className="px-6 pt-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">
                    ATENDIMENTO EM TEMPO REAL
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">Em atendimento</h2>
                </div>

                {/* Lista visual de quem está atendendo */}
                <div className="p-6">
                  {emAtendimento.length === 0 ? (
                    /*
                      Se não houver ninguém atendendo,
                      mostra esta mensagem
                    */
                    <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/70 p-6 text-sm text-neutral-400">
                      Nenhum vendedor em atendimento.
                    </div>
                  ) : (
                    /*
                      Se houver vendedores atendendo,
                      percorremos com map()
                    */
                    <div className="space-y-3">
                      {emAtendimento.map((nome, index) => (
                        <div
                          key={`${nome}-${index}`}
                          className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-4 shadow-lg shadow-black/20 transition hover:border-emerald-400/40"
                        >
                          {/* Lado esquerdo do card de atendimento */}
                          <div className="flex items-center gap-3">
                            {/* Indicador verde de atendimento ativo */}
                            <div className="h-3 w-3 rounded-full bg-emerald-400" />

                            {/* Nome do vendedor */}
                            <span className="font-medium">{nome}</span>
                          </div>

                          {/* Botão para abrir o modal de finalização */}
                          <button
                            onClick={() => abrirModal(nome)}
                            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
                          >
                            Finalizar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* RODAPÉ DA TELA: FORA DA ROTATIVIDADE */}
            <footer className="border-t border-neutral-800 px-6 py-6">
              {/* Cabeçalho interno do rodapé */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-amber-400">
                    EQUIPE
                  </p>
                  <h2 className="mt-2 text-xl font-bold">
                    Fora da rotatividade
                  </h2>
                </div>

                {/* Informação rápida de uso */}
                <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-400">
                  Clique para entrar na operação
                </span>
              </div>

              {foraDaRotatividade.length === 0 ? (
                /*
                  Se todos já estiverem na operação,
                  mostra esta mensagem
                */
                <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/70 p-6 text-sm text-neutral-400">
                  Todos os vendedores já estão na operação.
                </div>
              ) : (
                /*
                  Se houver vendedores fora da operação,
                  mostra cada um como botão
                */
                <div className="flex flex-wrap gap-3">
                  {foraDaRotatividade.map((nome, index) => (
                    <button
                      key={`${nome}-${index}`}
                      onClick={() => ativarVendedor(nome)}
                      className="rounded-full border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm transition hover:border-amber-400/40 hover:bg-neutral-800"
                    >
                      {nome}
                    </button>
                  ))}
                </div>
              )}
            </footer>
          </div>
        </div>
      </main>

      {/* 
        MODAL DE FINALIZAÇÃO

        Fica fora do main para abrir por cima da tela.
        Ele só aparece quando modalAberto = true
      */}
      <FinalizarAtendimentoModal
        aberto={modalAberto}
        vendedor={vendedorSelecionado}
        onFechar={fecharModal}
        onSalvar={salvarFinalizacao}
      />
    </>
  );
}