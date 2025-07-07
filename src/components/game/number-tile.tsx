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
  const [showHit, setShowHit] = useState(false);
  const [showMiss, setShowMiss] = useState(false);

  useEffect(() => {
    if (isLastHit) {
      setShowHit(true);
      const timer = setTimeout(() => setShowHit(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLastHit]);
  
  useEffect(() => {
    if (isLastMiss) {
        setShowMiss(true);
        const timer = setTimeout(() => setShowMiss(false), 1000);
        return () => clearTimeout(timer);
    }
  }, [isLastMiss]);


  return (
    <div
      className={cn(
        "flex items-center justify-center aspect-square rounded-lg text-2xl sm:text-3xl font-bold transition-all duration-500 transform-gpu",
        isAvailable
          ? "bg-card text-card-foreground shadow-md hover:scale-105"
          : "bg-muted text-muted-foreground line-through opacity-50",
        showHit && "animate-pulse ring-4 ring-green-500",
        showMiss && "animate-shake ring-4 ring-destructive"
      )}
    >
      {number}
    </div>
  );
}
