"use client";

import { createContext, useContext, useMemo, useState } from "react";

import type { Atendimento, Cliente, Loja, Marca, Vendedor } from "@/lib/types";
import {
  atendimentosIniciais,
  clienteAtual,
  lojaAtual,
  marcaAtual,
  vendedoresLojaAtual,
} from "@/lib/mock-data";

type AppStateContextType = {
  lojaAtual: Loja;
  clienteAtual: Cliente;
  marcaAtual: Marca;
  dataOperacao: string;
  vendedores: Vendedor[];
  atendimentos: Atendimento[];

  setVendedores: React.Dispatch<React.SetStateAction<Vendedor[]>>;
  setAtendimentos: React.Dispatch<React.SetStateAction<Atendimento[]>>;
};

const AppStateContext = createContext<AppStateContextType | null>(null);

type AppStateProviderProps = {
  children: React.ReactNode;
};

function formatarDataOperacao(data: Date) {
  return data.toLocaleDateString("pt-BR");
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  /*
    vendedores:
    lista da loja atual

    atendimentos:
    historico/base dos atendimentos
  */
  const [vendedores, setVendedores] = useState<Vendedor[]>(vendedoresLojaAtual);
  const [atendimentos, setAtendimentos] =
    useState<Atendimento[]>(atendimentosIniciais);
  const [dataOperacao] = useState(() => formatarDataOperacao(new Date()));

  /*
    useMemo:
    evita recriar o objeto do contexto sem necessidade
  */
  const value = useMemo(
    () => ({
      lojaAtual,
      clienteAtual,
      marcaAtual,
      dataOperacao,
      vendedores,
      atendimentos,
      setVendedores,
      setAtendimentos,
    }),
    [vendedores, atendimentos, dataOperacao]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState precisa ser usado dentro de AppStateProvider");
  }

  return context;
}
