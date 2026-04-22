import type {
  Atendimento,
  Cliente,
  DiaSemanaNumero,
  Loja,
  Marca,
  Vendedor,
} from "./types";

const diasShopping: DiaSemanaNumero[] = [0, 1, 2, 3, 4, 5, 6];
const diasRua: DiaSemanaNumero[] = [1, 2, 3, 4, 5, 6];

export const clientesIniciais: Cliente[] = [
  {
    id: "cliente-andrea-pessoa-de-mello",
    nome: "Andrea Pessoa de Mello",
    ativo: true,
  },
];

export const marcasIniciais: Marca[] = [
  {
    id: "marca-hering",
    nome: "Hering",
    ativo: true,
  },
];

export const lojasIniciais: Loja[] = [
  {
    id: "loja-riomar",
    clienteId: "cliente-andrea-pessoa-de-mello",
    marcaId: "marca-hering",
    nome: "Riomar",
    nomeExibicao: "Hering Riomar",
    tipoLoja: "shopping",
    valorMetaMes: 120000,
    mesReferencia: "2026-04",
    diasOperacaoSemana: diasShopping,
    ativo: true,
  },
  {
    id: "loja-recife",
    clienteId: "cliente-andrea-pessoa-de-mello",
    marcaId: "marca-hering",
    nome: "Recife",
    nomeExibicao: "Hering Recife",
    tipoLoja: "shopping",
    valorMetaMes: 110000,
    mesReferencia: "2026-04",
    diasOperacaoSemana: diasShopping,
    ativo: true,
  },
  {
    id: "loja-guararapes",
    clienteId: "cliente-andrea-pessoa-de-mello",
    marcaId: "marca-hering",
    nome: "Guararapes",
    nomeExibicao: "Hering Guararapes",
    tipoLoja: "shopping",
    valorMetaMes: 115000,
    mesReferencia: "2026-04",
    diasOperacaoSemana: diasShopping,
    ativo: true,
  },
  {
    id: "loja-tacaruna",
    clienteId: "cliente-andrea-pessoa-de-mello",
    marcaId: "marca-hering",
    nome: "Tacaruna",
    nomeExibicao: "Hering Tacaruna",
    tipoLoja: "shopping",
    valorMetaMes: 108000,
    mesReferencia: "2026-04",
    diasOperacaoSemana: diasShopping,
    ativo: true,
  },
  {
    id: "loja-plaza",
    clienteId: "cliente-andrea-pessoa-de-mello",
    marcaId: "marca-hering",
    nome: "Plaza",
    nomeExibicao: "Hering Plaza",
    tipoLoja: "shopping",
    valorMetaMes: 102000,
    mesReferencia: "2026-04",
    diasOperacaoSemana: diasShopping,
    ativo: true,
  },
  {
    id: "loja-conselheiro",
    clienteId: "cliente-andrea-pessoa-de-mello",
    marcaId: "marca-hering",
    nome: "Conselheiro",
    nomeExibicao: "Hering Conselheiro",
    tipoLoja: "rua",
    valorMetaMes: 90000,
    mesReferencia: "2026-04",
    diasOperacaoSemana: diasRua,
    ativo: true,
  },
  {
    id: "loja-rua-da-hora",
    clienteId: "cliente-andrea-pessoa-de-mello",
    marcaId: "marca-hering",
    nome: "Rua da Hora",
    nomeExibicao: "Hering Rua da Hora",
    tipoLoja: "rua",
    valorMetaMes: 95000,
    mesReferencia: "2026-04",
    diasOperacaoSemana: diasRua,
    ativo: true,
  },
];

export const lojaAtualId = "loja-riomar";

export const lojaAtual =
  lojasIniciais.find((loja) => loja.id === lojaAtualId) ?? lojasIniciais[0];

export const clienteAtual =
  clientesIniciais.find((cliente) => cliente.id === lojaAtual.clienteId) ??
  clientesIniciais[0];

export const marcaAtual =
  marcasIniciais.find((marca) => marca.id === lojaAtual.marcaId) ??
  marcasIniciais[0];

export const vendedoresIniciais: Vendedor[] = [
  {
    id: "v1",
    lojaId: "loja-riomar",
    codigo: "EDU",
    nome: "Eduarda",
    status: "foraDaRotatividade",
    ativo: true,
  },
  {
    id: "v2",
    lojaId: "loja-riomar",
    codigo: "DAN",
    nome: "Daniela",
    status: "foraDaRotatividade",
    ativo: true,
  },
  {
    id: "v3",
    lojaId: "loja-riomar",
    codigo: "DIM",
    nome: "Dimas Henrique",
    status: "foraDaRotatividade",
    ativo: true,
  },
  {
    id: "v4",
    lojaId: "loja-riomar",
    codigo: "ADM",
    nome: "Admari",
    status: "foraDaRotatividade",
    ativo: true,
  },
  {
    id: "v5",
    lojaId: "loja-riomar",
    codigo: "ALI",
    nome: "Aline",
    status: "foraDaRotatividade",
    ativo: true,
  },
  {
    id: "v6",
    lojaId: "loja-riomar",
    codigo: "GIL",
    nome: "Gilvaneide",
    status: "foraDaRotatividade",
    ativo: true,
  },
  {
    id: "v7",
    lojaId: "loja-riomar",
    codigo: "RAF",
    nome: "Rafa",
    status: "foraDaRotatividade",
    ativo: true,
  },
  {
    id: "v8",
    lojaId: "loja-riomar",
    codigo: "JOA",
    nome: "Joana Andrade",
    status: "foraDaRotatividade",
    ativo: true,
  },

  {
    id: "v9",
    lojaId: "loja-recife",
    codigo: "ROS",
    nome: "Rosineide Felix",
    status: "fila",
    ativo: true,
  },
  {
    id: "v10",
    lojaId: "loja-recife",
    codigo: "LAI",
    nome: "Lais",
    status: "fila",
    ativo: true,
  },
  {
    id: "v11",
    lojaId: "loja-guararapes",
    codigo: "CAM",
    nome: "Camila Fernanda",
    status: "fila",
    ativo: true,
  },
  {
    id: "v12",
    lojaId: "loja-guararapes",
    codigo: "MOA",
    nome: "Moana Ferreira",
    status: "fila",
    ativo: true,
  },
  {
    id: "v13",
    lojaId: "loja-conselheiro",
    codigo: "VER",
    nome: "Veronica",
    status: "fila",
    ativo: true,
  },
  {
    id: "v14",
    lojaId: "loja-conselheiro",
    codigo: "ANT",
    nome: "Anthony",
    status: "foraDaRotatividade",
    ativo: true,
  },
  {
    id: "v15",
    lojaId: "loja-rua-da-hora",
    codigo: "ANA",
    nome: "Ana Paula",
    status: "fila",
    ativo: true,
  },
  {
    id: "v16",
    lojaId: "loja-rua-da-hora",
    codigo: "CAR",
    nome: "Carlos Henrique",
    status: "foraDaRotatividade",
    ativo: true,
  },
];

export const vendedoresLojaAtual = vendedoresIniciais.filter(
  (vendedor) => vendedor.lojaId === lojaAtual.id && vendedor.ativo
);

export const atendimentosIniciais: Atendimento[] = [
  {
    id: "a1",
    vendedorId: "v1",
    vendedorNome: "Eduarda",
    lojaId: "loja-riomar",
    inicio: "09:00",
    fim: "09:12",
    resultado: "Venda",
    setor: "Feminino",
    categorias: ["Blusa"],
    motivo: "",
    detalheMotivo: "",
    observacao: "Venda concluida normalmente",
  },
  {
    id: "a2",
    vendedorId: "v2",
    vendedorNome: "Daniela",
    lojaId: "loja-riomar",
    inicio: "09:15",
    fim: "09:22",
    resultado: "Nao venda",
    setor: "Masculino",
    categorias: ["Camisa"],
    motivo: "Tamanho",
    detalheMotivo: "Cliente queria tamanho G",
    observacao: "",
  },
  {
    id: "a3",
    vendedorId: "v3",
    vendedorNome: "Dimas Henrique",
    lojaId: "loja-riomar",
    inicio: "09:30",
    fim: "09:40",
    resultado: "Troca",
    setor: "Feminino",
    categorias: ["Vestido"],
    motivo: "",
    detalheMotivo: "",
    observacao: "",
  },
  {
    id: "a4",
    vendedorId: "v1",
    vendedorNome: "Eduarda",
    lojaId: "loja-riomar",
    inicio: "10:05",
    fim: "10:18",
    resultado: "Venda",
    setor: "Jeans",
    categorias: ["Calca Jeans"],
    motivo: "",
    detalheMotivo: "",
    observacao: "",
  },
];

export function buscarLojaPorId(lojaId: string) {
  return lojasIniciais.find((loja) => loja.id === lojaId) ?? null;
}

export function buscarClientePorId(clienteId: string) {
  return clientesIniciais.find((cliente) => cliente.id === clienteId) ?? null;
}

export function buscarMarcaPorId(marcaId: string) {
  return marcasIniciais.find((marca) => marca.id === marcaId) ?? null;
}

export function buscarVendedoresAtivosDaLoja(lojaId: string) {
  return vendedoresIniciais.filter(
    (vendedor) => vendedor.lojaId === lojaId && vendedor.ativo
  );
}

export function lojaAbreNoDomingo(lojaId: string) {
  const loja = buscarLojaPorId(lojaId);

  if (!loja) return false;

  return loja.diasOperacaoSemana.includes(0);
}