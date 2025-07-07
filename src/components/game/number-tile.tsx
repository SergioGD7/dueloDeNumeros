"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from 'react';

interface NumberTileProps {
  number: number;
  isAvailable: boolean;
  isLastHit: boolean;
  isLastMiss: boolean;
}

export function NumberTile({ number, isAvailable, isLastHit, isLastMiss }: NumberTileProps) {
  const [showHitAnimation, setShowHitAnimation] = useState(false);
  const [showMissAnimation, setShowMissAnimation] = useState(false);

  useEffect(() => {
    if (isLastHit) {
      setShowHitAnimation(true);
      const timer = setTimeout(() => setShowHitAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLastHit]);
  
  useEffect(() => {
    if (isLastMiss) {
        setShowMissAnimation(true);
        const timer = setTimeout(() => setShowMissAnimation(false), 1000);
        return () => clearTimeout(timer);
    }
  }, [isLastMiss]);

  const tileStateClasses = isAvailable
    ? "bg-card text-card-foreground shadow-md border-b-4 border-primary/20 active:border-b-2 active:translate-y-0.5 hover:shadow-xl hover:-translate-y-1"
    : "opacity-0 pointer-events-none";

  return (
    <div
      className={cn(
        "flex items-center justify-center aspect-square rounded-lg text-2xl sm:text-3xl font-bold transition-all duration-500",
        showHitAnimation ? "animate-domino-fall" : tileStateClasses,
        showMissAnimation && "animate-shake ring-2 ring-destructive"
      )}
    >
      {number}
    </div>
  );
}
