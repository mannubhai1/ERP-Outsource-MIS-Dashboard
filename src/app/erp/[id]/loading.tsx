"use client";
export default function Loading() {
  const group1 = ["R", "A", "S", "H", "M", "I"];
  const group2 = ["G", "R", "O", "U", "P"];

  return (
    <div className="w-full h-screen flex justify-center items-center overflow-hidden">
      <div className="relative w-full max-w-xl mx-8 text-center">
        <div className="flex flex-col justify-evenly mb-8 text-4xl md:text-5xl lg:text-6xl tracking-[10px]">
          <div className="space-x-1">
            {group1.map((char, idx) => (
              <span
                key={`g1-${idx}`}
                className="inline-block font-extrabold text-red-500 opacity-0 animate-[moveLetters_2.4s_infinite_ease-in-out]"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {char}
              </span>
            ))}
          </div>
          <div className="space-x-1">
            {group2.map((char, idx) => (
              <span
                key={`g2-${idx}`}
                className="inline-block text-black opacity-0 animate-[moveLetters_2.4s_infinite_ease-in-out]"
                style={{ animationDelay: `${(group1.length + idx) * 0.05}s` }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black rounded-lg animate-[movingLine_2.4s_infinite_ease-in-out]"></div>
      </div>
    </div>
  );
}

// components/Loader.tsx
