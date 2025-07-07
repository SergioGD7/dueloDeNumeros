"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Dices, RotateCw } from "lucide-react";
import { Die } from "@/components/game/die";
import { NumberTile } from "@/components/game/number-tile";
import { WinnerDialog } from "@/components/game/winner-dialog";

const initialBoard = Array.from({ length: 11 }, (_, i) => ({
  number: i + 2,
  isAvailable: true,
}));

const numbersByRow = [
  [2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12],
];

export default function Home() {
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState("Player 1, roll the dice to start!");
  const [lastRoll, setLastRoll] = useState<{ value: number; hit: boolean } | null>(null);

  const handleRollDice = useCallback(() => {
    if (isRolling || winner) return;

    setIsRolling(true);
    setLastRoll(null);

    const rollTimeout = setTimeout(() => {
      const die1 = Math.floor(Math.random() * 6) + 1 as (1|2|3|4|5|6);
      const die2 = Math.floor(Math.random() * 6) + 1 as (1|2|3|4|5|6);
      const sum = die1 + die2;

      setDice([die1, die2]);
      setIsRolling(false);

      const targetNumber = board.find((n) => n.number === sum);

      if (targetNumber?.isAvailable) {
        setBoard((prevBoard) =>
          prevBoard.map((n) =>
            n.number === sum ? { ...n, isAvailable: false } : n
          )
        );
        setMessage(`Player ${currentPlayer} rolled a ${sum}. It's a hit! Roll again.`);
        setLastRoll({ value: sum, hit: true });
      } else {
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        setMessage(`Player ${currentPlayer} rolled a ${sum}. Miss! Passing turn to Player ${nextPlayer}.`);
        setLastRoll({ value: sum, hit: false });
        
        const turnTimeout = setTimeout(() => {
          setCurrentPlayer(nextPlayer);
          setMessage(`Player ${nextPlayer}'s turn. Roll the dice!`);
        }, 2000);
        return () => clearTimeout(turnTimeout);
      }
    }, 1000);

    return () => clearTimeout(rollTimeout);
  }, [board, currentPlayer, isRolling, winner]);

  const handleResetGame = useCallback(() => {
    // Reset with a fresh copy of the initial state
    const newBoard = Array.from({ length: 11 }, (_, i) => ({
      number: i + 2,
      isAvailable: true,
    }));
    setBoard(newBoard);
    setCurrentPlayer(1);
    setDice([1, 1]);
    setWinner(null);
    setIsRolling(false);
    setMessage("Player 1, roll the dice to start!");
    setLastRoll(null);
  }, []);

  useEffect(() => {
    const remainingCount = board.filter((n) => n.isAvailable).length;
    if (remainingCount === 0 && !winner) {
      setWinner(currentPlayer);
      setMessage(`Player ${currentPlayer} cleared the board!`);
    }
  }, [board, currentPlayer, winner]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 font-body">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-primary font-headline tracking-tight">
          Number Dropdown Duel
        </h1>

        <div className="my-6 h-14 flex items-center justify-center p-3 rounded-lg bg-accent/20 transition-colors duration-300">
          <p className="text-lg font-semibold text-primary/80">{message}</p>
        </div>
        
        <div className="p-4 bg-primary/5 rounded-xl mb-8">
          <div className="flex flex-col items-center gap-3">
            {numbersByRow.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-3">
                {row.map(numValue => {
                  const numData = board.find(n => n.number === numValue);
                  if (!numData) return null;
                  return (
                    <div key={numData.number} className="w-16 sm:w-20">
                      <NumberTile
                        number={numData.number}
                        isAvailable={numData.isAvailable}
                        isLastHit={lastRoll?.hit === true && lastRoll.value === numData.number}
                        isLastMiss={lastRoll?.hit === false && lastRoll.value === numData.number}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 sm:gap-8 my-8 [perspective:1000px]">
          <Die value={dice[0]} isRolling={isRolling} />
          <Die value={dice[1]} isRolling={isRolling} />
        </div>

        <div className="mt-8 flex justify-center items-center gap-4">
          <Button
            onClick={handleRollDice}
            disabled={isRolling || winner !== null}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg transform hover:scale-105 transition-transform"
          >
            <Dices className="mr-2 h-6 w-6" />
            Roll Dice
          </Button>
           <Button
            onClick={handleResetGame}
            disabled={isRolling}
            size="lg"
            variant="outline"
            className="font-bold text-lg px-8 py-6 rounded-full shadow-lg transform hover:scale-105 transition-transform"
          >
            <RotateCw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>
      </div>
      <WinnerDialog winner={winner} onReset={handleResetGame} />
    </main>
  );
}
