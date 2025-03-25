"use client";

import { useRouter } from "next/navigation";

const BackToHomeButton = () => {
  const router = useRouter();
  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <button
      onClick={handleBackToHome}
      className="text-md md:text-lg px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
    >
      Back to Home
    </button>
  );
};

export default BackToHomeButton;
