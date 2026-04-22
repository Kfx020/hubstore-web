import type { Loja, Vendedor } from "./types";

type MetaLojaCalculada = {
  valorMetaMes: number;
  valorMetaSemana: number;
  valorMetaDia: number;
};

type MetaVendedorCalculada = {
  vendedorId: string;
  vendedorNome: string;
  valorMetaMes: number;
  valorMetaSemana: number;
  valorMetaDia: number;
};

function arredondarMoeda(valor: number) {
  return Math.round(valor * 100) / 100;
}

function criarDataLocal(ano: number, mesIndex: number, dia: number) {
  return new Date(ano, mesIndex, dia, 12, 0, 0, 0);
}

function obterAnoEMes(mesReferencia: string) {
  const [anoTexto, mesTexto] = mesReferencia.split("-");
  const ano = Number(anoTexto);
  const mes = Number(mesTexto);

  return {
    ano,
    mesIndex: mes - 1,
  };
}

function obterChaveSemana(data: Date) {
  const dataUtc = new Date(
    Date.UTC(data.getFullYear(), data.getMonth(), data.getDate())
  );

  const diaSemana = dataUtc.getUTCDay() || 7;
  dataUtc.setUTCDate(dataUtc.getUTCDate() + 4 - diaSemana);

  const inicioAno = new Date(Date.UTC(dataUtc.getUTCFullYear(), 0, 1));
  const numeroSemana = Math.ceil(
    ((dataUtc.getTime() - inicioAno.getTime()) / 86400000 + 1) / 7
  );

  return `${dataUtc.getUTCFullYear()}-${numeroSemana}`;
}

/*
  Conta quantos dias a loja opera no mês.

  Regra:
  - usa mesReferencia da loja
  - usa diasOperacaoSemana da loja
  - conta só os dias realmente operacionais
*/
export function contarDiasOperacionaisNoMes(loja: Loja) {
  const { ano, mesIndex } = obterAnoEMes(loja.mesReferencia);
  const ultimoDiaDoMes = new Date(ano, mesIndex + 1, 0).getDate();

  let total = 0;

  for (let dia = 1; dia <= ultimoDiaDoMes; dia += 1) {
    const data = criarDataLocal(ano, mesIndex, dia);
    const diaSemana = data.getDay();

    if (loja.diasOperacaoSemana.includes(diaSemana as 0 | 1 | 2 | 3 | 4 | 5 | 6)) {
      total += 1;
    }
  }

  return total;
}

/*
  Conta quantas semanas operacionais existem no mês.

  Regra:
  - considera só as semanas que possuem pelo menos 1 dia operacional
*/
export function contarSemanasOperacionaisNoMes(loja: Loja) {
  const { ano, mesIndex } = obterAnoEMes(loja.mesReferencia);
  const ultimoDiaDoMes = new Date(ano, mesIndex + 1, 0).getDate();

  const semanas = new Set<string>();

  for (let dia = 1; dia <= ultimoDiaDoMes; dia += 1) {
    const data = criarDataLocal(ano, mesIndex, dia);
    const diaSemana = data.getDay();

    if (loja.diasOperacaoSemana.includes(diaSemana as 0 | 1 | 2 | 3 | 4 | 5 | 6)) {
      semanas.add(obterChaveSemana(data));
    }
  }

  return semanas.size;
}

/*
  Calcula a meta da loja.

  Regra:
  - meta do mês vem da loja
  - meta da semana = meta do mês / semanas operacionais
  - meta do dia = meta do mês / dias operacionais
*/
export function calcularMetaLoja(loja: Loja): MetaLojaCalculada {
  const diasOperacionais = contarDiasOperacionaisNoMes(loja);
  const semanasOperacionais = contarSemanasOperacionaisNoMes(loja);

  const valorMetaMes = arredondarMoeda(loja.valorMetaMes);
  const valorMetaSemana =
    semanasOperacionais > 0
      ? arredondarMoeda(valorMetaMes / semanasOperacionais)
      : 0;
  const valorMetaDia =
    diasOperacionais > 0 ? arredondarMoeda(valorMetaMes / diasOperacionais) : 0;

  return {
    valorMetaMes,
    valorMetaSemana,
    valorMetaDia,
  };
}

/*
  Calcula as metas dos vendedores ativos da loja.

  Regra:
  - filtra só vendedores da loja
  - considera só vendedores ativos
  - divide a meta da loja igualmente entre eles
*/
export function calcularMetasVendedoresDaLoja(
  loja: Loja,
  vendedores: Vendedor[]
): MetaVendedorCalculada[] {
  const vendedoresAtivos = vendedores.filter(
    (vendedor) => vendedor.lojaId === loja.id && vendedor.ativo
  );

  if (vendedoresAtivos.length === 0) {
    return [];
  }

  const metaLoja = calcularMetaLoja(loja);

  return vendedoresAtivos.map((vendedor) => ({
    vendedorId: vendedor.id,
    vendedorNome: vendedor.nome,
    valorMetaMes: arredondarMoeda(metaLoja.valorMetaMes / vendedoresAtivos.length),
    valorMetaSemana: arredondarMoeda(
      metaLoja.valorMetaSemana / vendedoresAtivos.length
    ),
    valorMetaDia: arredondarMoeda(metaLoja.valorMetaDia / vendedoresAtivos.length),
  }));
}

export function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}