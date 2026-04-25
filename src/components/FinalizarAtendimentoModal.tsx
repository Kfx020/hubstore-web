"use client";

import { useState } from "react";

type ResultadoAtendimento =
  | "Venda"
  | "Não venda"
  | "Troca"
  | "Troca com diferença";

type FinalizarAtendimentoModalProps = {
  aberto: boolean;
  vendedor: string | null;
  onFechar: () => void;
  onSalvar: (dados: {
    vendedor: string;
    resultado: ResultadoAtendimento;
    setor: string;
    categorias: string[];
    motivo: string;
    detalheMotivo: string;
  }) => void;
};

const setores = [
  "Feminino",
  "Masculino",
  "Variado",
  "Intimo",
  "Kids",
  "Acessorios",
  "Outro",
];

const categoriasDisponiveis = [
  "Blusa",
  "Camisa",
  "Camiseta",
  "Calca",
  "Vestido",
  "Saia",
  "Jaqueta",
  "Bermuda",
  "Short",
  "Calca Jeans",
  "Jaqueta Jeans",
  "Bermuda Jeans",
  "Short Jeans",
  "Acessorio",
  "Outro",
];

const motivosNaoVenda = [
  "Falta",
  "Tamanho",
  "Preco",
  "Olhadinha",
  "Outro",
];

function motivoExigeDescricao(motivo: string) {
  return motivo === "Outro";
}

function obterPlaceholderDescricao(motivo: string) {
  if (motivo === "Falta") {
    return "Ex.: Cliente procurava camiseta basica preta no tamanho M";
  }

  if (motivo === "Tamanho") {
    return "Ex.: Cliente queria a peca no tamanho G";
  }

  if (motivo === "Preco") {
    return "Ex.: Cliente considerou o valor acima do esperado";
  }

  if (motivo === "Olhadinha") {
    return "Ex.: Cliente entrou apenas para olhar";
  }

  return "Descreva o motivo informado pelo cliente";
}

export default function FinalizarAtendimentoModal({
  aberto,
  vendedor,
  onFechar,
  onSalvar,
}: FinalizarAtendimentoModalProps) {
  const [resultado, setResultado] =
    useState<ResultadoAtendimento>("Venda");
  const [setor, setSetor] = useState("Feminino");
  const [categorias, setCategorias] = useState<string[]>([]);
  const [motivo, setMotivo] = useState("Falta");
  const [detalheMotivo, setDetalheMotivo] = useState("");
  const [erro, setErro] = useState("");

  if (!aberto || !vendedor) return null;

  function alternarCategoria(categoria: string) {
    const jaExiste = categorias.includes(categoria);

    if (jaExiste) {
      setCategorias(categorias.filter((item) => item !== categoria));
      setErro("");
      return;
    }

    if (categorias.length >= 3) {
      setErro("Voce pode selecionar no maximo 3 categorias.");
      return;
    }

    setCategorias([...categorias, categoria]);
    setErro("");
  }

  function salvar() {
    if (!vendedor) return;

    if (categorias.length === 0) {
      setErro("Selecione pelo menos 1 categoria.");
      return;
    }

    if (
      resultado === "Não venda" &&
      motivoExigeDescricao(motivo) &&
      detalheMotivo.trim() === ""
    ) {
      setErro("Descricao do motivo e obrigatoria quando o motivo for Outro.");
      return;
    }

    onSalvar({
      vendedor,
      resultado,
      setor,
      categorias,
      motivo: resultado === "Não venda" ? motivo : "",
      detalheMotivo: resultado === "Não venda" ? detalheMotivo.trim() : "",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        <div className="border-b border-neutral-800 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Finalizar atendimento
              </h2>

              <p className="mt-2 text-sm text-neutral-300">
                Vendedor: {vendedor}
              </p>
            </div>

            <button
              onClick={onFechar}
              className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-white hover:bg-neutral-800"
            >
              Fechar
            </button>
          </div>
        </div>

        <div className="space-y-6 px-4 py-5 text-white sm:px-6">
          <div>
            <p className="mb-3 text-sm font-medium text-neutral-300">
              Resultado
            </p>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  "Venda",
                  "Não venda",
                  "Troca",
                  "Troca com diferença",
                ] as ResultadoAtendimento[]
              ).map((item) => (
                <button
                  key={item}
                  onClick={() => setResultado(item)}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    resultado === item
                      ? "border-white bg-white text-black"
                      : "border-neutral-700 bg-neutral-950 text-white hover:bg-neutral-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-neutral-300">Setor</p>

            <div className="flex flex-wrap gap-2">
              {setores.map((item) => (
                <button
                  key={item}
                  onClick={() => setSetor(item)}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    setor === item
                      ? "border-white bg-white text-black"
                      : "border-neutral-700 bg-neutral-950 text-white hover:bg-neutral-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-neutral-300">
                Categorias
              </p>

              <span className="text-xs text-neutral-400">Maximo: 3</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categoriasDisponiveis.map((item) => {
                const selecionada = categorias.includes(item);

                return (
                  <button
                    key={item}
                    onClick={() => alternarCategoria(item)}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      selecionada
                        ? "border-white bg-white text-black"
                        : "border-neutral-700 bg-neutral-950 text-white hover:bg-neutral-800"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {resultado === "Não venda" && (
            <div>
              <p className="mb-3 text-sm font-medium text-neutral-300">
                Motivo da nao venda
              </p>

              <div className="flex flex-wrap gap-2">
                {motivosNaoVenda.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setMotivo(item);
                      setErro("");
                    }}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      motivo === item
                        ? "border-white bg-white text-black"
                        : "border-neutral-700 bg-neutral-950 text-white hover:bg-neutral-800"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-neutral-300">
                  Descricao do motivo
                </p>

                <p className="mb-3 text-xs text-neutral-500">
                  {motivoExigeDescricao(motivo)
                    ? "Campo obrigatorio para o motivo Outro"
                    : "Campo opcional para complementar o motivo"}
                </p>

                <input
                  type="text"
                  value={detalheMotivo}
                  onChange={(event) => {
                    setDetalheMotivo(event.target.value);
                    setErro("");
                  }}
                  placeholder={obterPlaceholderDescricao(motivo)}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-3 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-white"
                />
              </div>
            </div>
          )}

          {erro && <p className="text-sm font-medium text-red-400">{erro}</p>}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-neutral-800 px-4 py-4 sm:flex-row sm:justify-end sm:px-6 sm:py-5">
          <button
            onClick={onFechar}
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-white hover:bg-neutral-800"
          >
            Cancelar
          </button>

          <button
            onClick={salvar}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200"
          >
            Salvar atendimento
          </button>
        </div>
      </div>
    </div>
  );
}
