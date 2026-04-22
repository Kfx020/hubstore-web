import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AppStateProvider } from "@/context/AppStateContext";

type PainelLayoutProps = {
  children: React.ReactNode;
};

export default async function PainelLayout({
  children,
}: PainelLayoutProps) {
  /*
    Lê a cookie no servidor.
    Se não estiver autenticado, volta para /login.
  */
  const cookieStore = await cookies();
  const autenticado = cookieStore.get("vezify_auth")?.value === "true";

  if (!autenticado) {
    redirect("/login");
  }

  /*
    Aqui envolvemos o painel com o provider.
    Isso faz as páginas internas usarem a mesma base de dados.
  */
  return <AppStateProvider>{children}</AppStateProvider>;
}