"use client";

import { useRouter } from "next/navigation";

type ExitToLoginButtonProps = {
  label?: string;
  className?: string;
};

export default function ExitToLoginButton({
  label = "Sair do painel",
  className = "",
}: ExitToLoginButtonProps) {
  const router = useRouter();

  function handleExit() {
    const confirmar = window.confirm("Deseja realmente sair?");

    if (!confirmar) {
      return;
    }

    document.cookie =
      "vezify_auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

    router.replace("/login");
  }

  return (
    <button onClick={handleExit} className={className}>
      {label}
    </button>
  );
}