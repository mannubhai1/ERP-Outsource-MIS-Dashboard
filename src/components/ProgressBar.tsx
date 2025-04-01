"use client";
import { useEffect, useState } from "react";

interface ProgressBarProps {
  sheetName: string;
  progress: number; // externally calculated progress percentage
  index?: number; // for color mapping
  size?: string; // text size, e.g. "2xl", "xl"
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  sheetName,
  progress: targetProgress,
  index,
  size,
}) => {
  const [progress, setProgress] = useState(0);

  // Array of colors for mapping by index
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-purple-500",
  ];

  // Determine color based on the passed index
  let progressBarColor = "bg-blue-500"; // default
  if (index !== undefined) {
    for (let i = 0; i < colors.length; i++) {
      if (i === index) {
        progressBarColor = colors[i];
        break;
      }
    }
  }

  // Animate from current progress to the targetProgress using requestAnimationFrame
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 1000; // animation duration in ms
    const initial = progress;
    const delta = targetProgress - initial;

    function animate(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const fraction = Math.min(elapsed / duration, 1);
      const newProgress = initial + delta * fraction;
      setProgress(newProgress);
      if (fraction < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [targetProgress]);

  return (
    <div className="w-full mb-6">
      <h3
        className={`text-${
          size ? size : "2xl"
        } font-semibold text-gray-700 mb-2`}
      >
        {sheetName}
      </h3>
      <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-400">
        <div
          className={`${progressBarColor} h-full transition-all`}
          style={{ width: `${progress}%` }}
        ></div>
        <div className="absolute inset-0 flex justify-center items-center text-black font-bold text-sm w-full">
          {progress.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
