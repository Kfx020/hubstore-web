export type StatusVendedor =
  | "fila"
  | "emAtendimento"
  | "foraDaRotatividade";

export type ResultadoAtendimento =
  | "Venda"
  | "Nao venda"
  | "Troca"
  | "Troca com diferenca";

export type MotivoNaoVenda =
  | "Falta"
  | "Tamanho"
  | "Preco"
  | "Olhadinha"
  | "Outro";

export type DiaSemanaNumero = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type TipoLoja = "shopping" | "rua";

export type Cliente = {
  id: string;
  nome: string;
  ativo: boolean;
};

export type Marca = {
  id: string;
  nome: string;
  ativo: boolean;
};

export type Loja = {
  id: string;
  clienteId: string;
  marcaId: string;
  nome: string;
  nomeExibicao: string;
  tipoLoja: TipoLoja;
  valorMetaMes: number;
  mesReferencia: string; // YYYY-MM
  diasOperacaoSemana: DiaSemanaNumero[];
  ativo: boolean;
};

export type Vendedor = {
  id: string;
  lojaId: string;
  codigo?: string;
  nome: string;
  status: StatusVendedor;
  ativo: boolean;
};

export type Atendimento = {
  id: string;
  vendedorId: string;
  vendedorNome: string;
  lojaId: string;
  inicio: string;
  fim?: string;
  resultado?: ResultadoAtendimento;
  setor?: string;
  categorias: string[];
  motivo?: MotivoNaoVenda | "";
  detalheMotivo?: string;
  observacao?: string;
  valorVenda?: number;
};

export type ResumoDia = {
  atendimentos: number;
  vendas: number;
  naoVendas: number;
  trocas: number;
  trocasComDiferenca: number;
};

export type RankingItem = {
  posicao: number;
  vendedorId: string;
  vendedorNome: string;
  atendimentos: number;
  vendas: number;
};