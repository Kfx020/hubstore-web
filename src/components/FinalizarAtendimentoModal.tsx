"use client";

/*
  IMPORTS

  useEffect:
  usado para resetar os campos sempre que o modal abrir

  useState:
  usado para guardar os valores escolhidos no modal
*/
import { useEffect, useState } from "react";

/*
  TIPOS DE RESULTADO POSSÍVEIS NO MODAL
*/
type ResultadoAtendimento =
  | "Venda"
  | "Não venda"
  | "Troca"
  | "Troca com diferença";

/*
  TIPAGEM DAS PROPS DO MODAL

  aberto:
  controla se o modal aparece ou não

  vendedor:
  nome do vendedor que está sendo finalizado

  onFechar:
  função para fechar o modal

  onSalvar:
  função chamada quando o usuário salva o atendimento
*/
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
  }) => void;
};

/*
  LISTAS FIXAS DO MVP

  Essas listas são exibidas como botões de seleção no modal.
  Mais na frente elas podem vir da API ou do banco.
*/
const setores = [
  "Feminino",
  "Masculino",
  "Variado",
  "Íntimo",
  "Kids",
  "Acessórios",
  "Outro",
];

const categoriasDisponiveis = [
  "Blusa",
  "Camisa",
  "Camiseta",
  "Calça",
  "Vestido",
  "Saia",
  "Jaqueta",
  "Bermuda",
  "Short",
  "Calça Jeans",
  "Jaqueta Jeans",
  "Bermuda Jeans",
  "Short Jeans",
  "Acessório",
  "Outro",
];

const motivosNaoVenda = [
  "Falta",
  "Tamanho",
  "Preço",
  "Olhadinha",
  "Outro",
];

/*
  COMPONENTE DO MODAL
*/
export default function FinalizarAtendimentoModal({
  aberto,
  vendedor,
  onFechar,
  onSalvar,
}: FinalizarAtendimentoModalProps) {
  /*
    ESTADOS INTERNOS DO MODAL

    resultado:
    guarda o resultado principal escolhido

    setor:
    guarda o setor selecionado

    categorias:
    guarda as categorias selecionadas

    motivo:
    guarda o motivo da não venda, quando necessário

    erro:
    mostra mensagem de validação
  */
  const [resultado, setResultado] =
    useState<ResultadoAtendimento>("Venda");
  const [setor, setSetor] = useState("Feminino");
  const [categorias, setCategorias] = useState<string[]>([]);
  const [motivo, setMotivo] = useState("Falta");
  const [erro, setErro] = useState("");

  /*
    useEffect DE RESET

    Sempre que o modal abrir, resetamos os campos
    para ele começar limpo na próxima finalização.
  */
  useEffect(() => {
    if (aberto) {
      setResultado("Venda");
      setSetor("Feminino");
      setCategorias([]);
      setMotivo("Falta");
      setErro("");
    }
  }, [aberto]);

  /*
    REGRA DE EXIBIÇÃO

    Se o modal não estiver aberto
    ou se não houver vendedor selecionado,
    não renderiza nada.
  */
  if (!aberto || !vendedor) return null;

  /*
    FUNÇÃO: alternarCategoria

    O que ela faz:
    - adiciona categoria se ainda não foi selecionada
    - remove categoria se já foi selecionada
    - bloqueia se tentar passar de 3 categorias
  */
  function alternarCategoria(categoria: string) {
    const jaExiste = categorias.includes(categoria);

    if (jaExiste) {
      setCategorias(categorias.filter((item) => item !== categoria));
      setErro("");
      return;
    }

    if (categorias.length >= 3) {
      setErro("Você pode selecionar no máximo 3 categorias.");
      return;
    }

    setCategorias([...categorias, categoria]);
    setErro("");
  }

  /*
    FUNÇÃO: salvar

    O que ela faz:
    - valida se existe pelo menos 1 categoria
    - chama a função onSalvar
    - manda para a página os dados preenchidos
  */
  function salvar() {
    if (!vendedor) return;

    if (categorias.length === 0) {
      setErro("Selecione pelo menos 1 categoria.");
      return;
    }

    onSalvar({
      vendedor,
      resultado,
      setor,
      categorias,
      motivo: resultado === "Não venda" ? motivo : "",
    });
  }

  return (
    /*
      CAMADA ESCURA DE FUNDO

      Essa camada cobre a tela inteira
      e ajuda a destacar o modal
    */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      {/* Caixa principal do modal */}
      <div className="w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Cabeçalho do modal */}
        <div className="border-b border-neutral-800 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Finalizar atendimento
              </h2>

              <p className="mt-2 text-sm text-neutral-300">
                Vendedor: {vendedor}
              </p>
            </div>

            {/* Botão de fechar */}
            <button
              onClick={onFechar}
              className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-white hover:bg-neutral-800"
            >
              Fechar
            </button>
          </div>
        </div>

        {/* Corpo do modal */}
        <div className="space-y-6 px-6 py-5 text-white">
          {/* BLOCO: resultado */}
          <div>
            <p className="mb-3 text-sm font-medium text-neutral-300">
              Resultado
            </p>

            <div className="flex flex-wrap gap-2">
              {(["Venda", "Não venda", "Troca", "Troca com diferença"] as ResultadoAtendimento[]).map(
                (item) => (
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
                )
              )}
            </div>
          </div>

          {/* BLOCO: setor */}
          <div>
            <p className="mb-3 text-sm font-medium text-neutral-300">
              Setor
            </p>

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

          {/* BLOCO: categorias */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-neutral-300">
                Categorias
              </p>

              <span className="text-xs text-neutral-400">
                Máximo: 3
              </span>
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

          {/* BLOCO: motivo da não venda
              Só aparece quando o resultado for "Não venda" */}
          {resultado === "Não venda" && (
            <div>
              <p className="mb-3 text-sm font-medium text-neutral-300">
                Motivo da não venda
              </p>

              <div className="flex flex-wrap gap-2">
                {motivosNaoVenda.map((item) => (
                  <button
                    key={item}
                    onClick={() => setMotivo(item)}
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
            </div>
          )}

          {/* BLOCO: erro de validação */}
          {erro && (
            <p className="text-sm font-medium text-red-400">{erro}</p>
          )}
        </div>

        {/* Rodapé do modal com ações */}
        <div className="flex items-center justify-end gap-3 border-t border-neutral-800 px-6 py-5">
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