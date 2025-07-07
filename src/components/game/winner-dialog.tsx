"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PartyPopper, RotateCw } from "lucide-react";

interface WinnerDialogProps {
  winner: 1 | 2 | null;
  onReset: () => void;
  gameOverText: string;
  congratulationsNode: React.ReactNode;
  playAgainText: string;
}

export function WinnerDialog({ winner, onReset, gameOverText, congratulationsNode, playAgainText }: WinnerDialogProps) {
  return (
    <AlertDialog open={winner !== null}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-col items-center justify-center gap-4 text-2xl font-headline">
            <PartyPopper className="text-accent h-16 w-16" />
            {gameOverText}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg pt-2 text-foreground">
            {congratulationsNode}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-4">
          <AlertDialogAction 
            onClick={onReset} 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base py-3"
          >
            <RotateCw className="mr-2 h-5 w-5" />
            {playAgainText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
