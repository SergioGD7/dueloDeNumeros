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
        "flex items-center justify-center aspect-square rounded-lg text-2xl sm:text-3xl font-bold transition-all duration-300 transform-gpu",
        isAvailable
          ? "bg-card text-card-foreground shadow-md border-b-4 border-primary/20 active:border-b-2 active:translate-y-0.5 hover:shadow-xl hover:-translate-y-1"
          : "bg-muted text-muted-foreground line-through opacity-50 shadow-inner",
        showHit && "animate-pulse ring-4 ring-green-500",
        showMiss && "animate-shake ring-4 ring-destructive"
      )}
    >
      {number}
    </div>
  );
}
