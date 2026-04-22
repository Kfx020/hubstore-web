"use client";

import { useRouter } from "next/navigation";

type BackToOperationButtonProps = {
  label?: string;
  className?: string;
};

export default function BackToOperationButton({
  label = "Voltar para operação",
  className = "",
}: BackToOperationButtonProps) {
  const router = useRouter();

  function handleBack() {
    router.push("/operacao");
  }

  return (
    <button onClick={handleBack} className={className}>
      {label}
    </button>
  );
}