"use client";

import { useRouter } from "next/navigation";

export default function BackToHomeButton() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <button
      onClick={handleBackToHome}
      className="
        text-sm
        md:text-base
        lg:text-lg
        px-3
        py-2
        md:px-4
        md:py-3
        bg-blue-500
        text-white
        rounded-md
        hover:bg-blue-600
        transition
      "
    >
      Back to Home
    </button>
  );
}
