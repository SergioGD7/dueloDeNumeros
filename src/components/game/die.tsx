"use client";

import { cn } from "@/lib/utils";

const DieFace = ({ value }: { value: number }) => {
  const pips = [];
  const pipPositions: { [key: number]: string[] } = {
    1: ["center"],
    2: ["top-left", "bottom-right"],
    3: ["top-left", "center", "bottom-right"],
    4: ["top-left", "top-right", "bottom-left", "bottom-right"],
    5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
    6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
  };

  const positions = pipPositions[value] || [];

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    let positionClass = "";
    switch(pos) {
        case "center": positionClass = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"; break;
        case "top-left": positionClass = "top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2"; break;
        case "top-right": positionClass = "top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2"; break;
        case "middle-left": positionClass = "top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2"; break;
        case "middle-right": positionClass = "top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2"; break;
        case "bottom-left": positionClass = "bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2"; break;
        case "bottom-right": positionClass = "bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2"; break;
    }
    pips.push(
      <div
        key={i}
        className={cn(
          "absolute w-1/4 h-1/4 bg-primary rounded-full shadow-inner",
          positionClass
        )}
      />
    );
  }

  return <div className="relative w-full h-full">{pips}</div>;
};

interface DieProps {
  value: 1 | 2 | 3 | 4 | 5 | 6;
  isRolling?: boolean;
}

export function Die({ value, isRolling }: DieProps) {
  return (
    <div
      className={cn(
        "w-20 h-20 sm:w-24 sm:h-24 bg-card rounded-2xl shadow-2xl flex items-center justify-center p-2 transition-all duration-300 border-2 border-primary/10",
        "transform-gpu hover:-translate-y-2",
        isRolling && "animate-tumble"
      )}
    >
      <DieFace value={value} />
    </div>
  );
}
