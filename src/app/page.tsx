import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
        <h1 className="text-4xl font-bold">HubStore</h1>
        <p className="mt-3 text-neutral-300">
          Sistema de operação e análise de atendimentos para lojas.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/operacao"
            className="rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-neutral-200"
          >
            Abrir operação
          </Link>
        </div>
      </div>
    </main>
  );
}