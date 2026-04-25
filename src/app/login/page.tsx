"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (email.trim() === "" || senha.trim() === "") {
      setErro("Preencha email e senha para continuar.");
      return;
    }

    if (!email.includes("@")) {
      setErro("Digite um email valido.");
      return;
    }

    setErro("");

    const expiraEm = new Date();
    expiraEm.setDate(expiraEm.getDate() + 1);

    document.cookie = `vezify_auth=true; expires=${expiraEm.toUTCString()}; path=/`;

    router.push("/operacao");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 px-4 py-6 text-white sm:px-5 md:px-6 md:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center lg:min-h-[85vh]">
        <div className="grid w-full overflow-hidden rounded-[24px] border border-neutral-800 bg-neutral-900/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)] md:rounded-[28px] lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <section className="flex flex-col justify-between border-b border-neutral-800 p-6 sm:p-8 lg:min-h-[620px] lg:border-b-0 lg:border-r lg:p-10">
            <div>
              <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-cyan-300">
                Vezify
              </span>

              <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Gestao de atendimento com visao operacional real.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-400 sm:text-base sm:leading-7">
                Entre no painel para acompanhar fila, atendimento, resumo do
                dia e desempenho da equipe da loja.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-1">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
                <p className="text-sm font-medium text-white">
                  Operacao da loja
                </p>
                <p className="mt-1 text-sm text-neutral-400">
                  Controle de fila, atendimento e rotacao da equipe.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
                <p className="text-sm font-medium text-white">Resumo do dia</p>
                <p className="mt-1 text-sm text-neutral-400">
                  Leitura rapida dos numeros operacionais da loja.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4 sm:col-span-2 lg:col-span-1">
                <p className="text-sm font-medium text-white">Ranking</p>
                <p className="mt-1 text-sm text-neutral-400">
                  Acompanhamento visual de desempenho da equipe.
                </p>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8 lg:flex lg:items-center lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                  Acesso ao sistema
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">Entrar</h2>
                <p className="mt-2 text-sm text-neutral-400">
                  Use seu email e senha para acessar o painel do Vezify.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-neutral-300"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setErro("");
                    }}
                    placeholder="seuemail@empresa.com"
                    className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition placeholder:text-neutral-500 focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="senha"
                    className="mb-2 block text-sm font-medium text-neutral-300"
                  >
                    Senha
                  </label>

                  <div className="relative">
                    <input
                      id="senha"
                      type={mostrarSenha ? "text" : "password"}
                      value={senha}
                      onChange={(event) => {
                        setSenha(event.target.value);
                        setErro("");
                      }}
                      placeholder="Digite sua senha"
                      className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 pr-14 text-white outline-none transition placeholder:text-neutral-500 focus:border-cyan-400"
                    />

                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
                    >
                      {mostrarSenha ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-5 w-5"
                        >
                          <path d="M3 3l18 18" />
                          <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
                          <path d="M9.88 5.09A9.77 9.77 0 0112 4c5 0 9.27 3.11 11 8-1.03 2.91-3.12 5.14-5.73 6.32" />
                          <path d="M6.61 6.61C4.62 8.03 3.03 9.87 2 12c.75 1.99 1.96 3.69 3.48 4.96" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-5 w-5"
                        >
                          <path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8-10-8-10-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {erro && <p className="text-sm font-medium text-red-400">{erro}</p>}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-black transition hover:bg-cyan-300"
                  >
                    Entrar
                  </button>
                </div>
              </form>

              <p className="mt-6 text-sm leading-6 text-neutral-500">
                Nesta etapa, o login ja salva uma sessao local do MVP. Depois a
                gente liga com autenticacao real.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
