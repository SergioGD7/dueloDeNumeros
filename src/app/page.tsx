"use client";

import React, { useState, useEffect, useCallback } from 'react';
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

const translations = {
  en: {
    title: "Number Dropdown Duel",
    initialMessage: "Player 1, roll the dice to start!",
    rollMessage: (player: number, sum: number) => `Player ${player} rolled a ${sum}.`,
    hitMessage: (player: number) => `It's a hit! Player ${player}, roll again.`,
    missMessage: (player: number, sum: number, nextPlayer: number) => `Player ${player} rolled a ${sum}. Miss! Passing turn to Player ${nextPlayer}.`,
    nextTurnMessage: (player: number) => `Player ${player}'s turn. Roll the dice!`,
    winMessage: (player: number) => `Player ${player} cleared the board!`,
    rollButton: "Roll Dice",
    resetButton: "Reset",
    gameOver: "Game Over!",
    congratulations: (winner: number) => <>Congratulations, <span className="font-bold text-primary">Player {winner}</span> is the winner!</>,
    playAgain: "Play Again",
  },
  es: {
    title: "Duelo de Números",
    initialMessage: "¡Jugador 1, lanza los dados para empezar!",
    rollMessage: (player: number, sum: number) => `El Jugador ${player} sacó un ${sum}.`,
    hitMessage: (player: number) => `¡Acertaste! Jugador ${player}, lanza de nuevo.`,
    missMessage: (player: number, sum: number, nextPlayer: number) => `El Jugador ${player} sacó un ${sum}. ¡Fallaste! Turno para el Jugador ${nextPlayer}.`,
    nextTurnMessage: (player: number) => `Turno del Jugador ${player}. ¡Lanza los dados!`,
    winMessage: (player: number) => `¡El Jugador ${player} ha despejado el tablero!`,
    rollButton: "Lanzar Dados",
    resetButton: "Reiniciar",
    gameOver: "¡Fin del Juego!",
    congratulations: (winner: number) => <>¡Felicidades, el <span className="font-bold text-primary">Jugador {winner}</span> es el ganador!</>,
    playAgain: "Jugar de Nuevo",
  }
};


export default function Home() {
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState("Player 1, roll the dice to start!");
  const [lastRoll, setLastRoll] = useState<{ value: number; hit: boolean } | null>(null);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'es') {
        setLang('es');
    }
  }, []);

  const t = translations[lang as keyof typeof translations] || translations.en;

  useEffect(() => {
    setMessage(t.initialMessage);
  }, [t.initialMessage]);

  const handleRollDice = useCallback(() => {
    if (isRolling || winner) return;

    setIsRolling(true);
    setLastRoll(null);

    setTimeout(() => {
      const die1 = Math.floor(Math.random() * 6) + 1 as (1|2|3|4|5|6);
      const die2 = Math.floor(Math.random() * 6) + 1 as (1|2|3|4|5|6);
      const sum = die1 + die2;

      setDice([die1, die2]);
      setIsRolling(false);
      setMessage(t.rollMessage(currentPlayer, sum));

      setTimeout(() => {
        const targetNumber = board.find((n) => n.number === sum);

        if (targetNumber?.isAvailable) {
          setLastRoll({ value: sum, hit: true });
          setBoard((prevBoard) =>
            prevBoard.map((n) =>
              n.number === sum ? { ...n, isAvailable: false } : n
            )
          );
          setMessage(t.hitMessage(currentPlayer));
        } else {
          const nextPlayer = currentPlayer === 1 ? 2 : 1;
          setMessage(t.missMessage(currentPlayer, sum, nextPlayer));
          setLastRoll({ value: sum, hit: false });
          
          setTimeout(() => {
            setCurrentPlayer(nextPlayer);
            setMessage(t.nextTurnMessage(nextPlayer));
          }, 2000);
        }
      }, 750);
    }, 1000);
  }, [board, currentPlayer, isRolling, winner, t]);

  const handleResetGame = useCallback(() => {
    const newBoard = Array.from({ length: 11 }, (_, i) => ({
      number: i + 2,
      isAvailable: true,
    }));
    setBoard(newBoard);
    setCurrentPlayer(1);
    setDice([1, 1]);
    setWinner(null);
    setIsRolling(false);
    setMessage(t.initialMessage);
    setLastRoll(null);
  }, [t]);

  useEffect(() => {
    const remainingCount = board.filter((n) => n.isAvailable).length;
    if (remainingCount === 0 && !winner) {
      setWinner(currentPlayer);
      setMessage(t.winMessage(currentPlayer));
    }
  }, [board, currentPlayer, winner, t]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 font-body">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary font-headline tracking-tight">
          {t.title}
        </h1>

        <div className="my-6 h-14 flex items-center justify-center p-3 rounded-lg bg-accent/20 transition-colors duration-300">
          <p className="text-base sm:text-lg font-semibold text-primary/80">{message}</p>
        </div>
        
        <div className="p-2 sm:p-4 bg-primary/5 rounded-xl mb-8">
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            {numbersByRow.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-2 sm:gap-3">
                {row.map(numValue => {
                  const numData = board.find(n => n.number === numValue);
                  if (!numData) return null;
                  return (
                    <div key={numData.number} className="w-12 sm:w-16 md:w-20">
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

        <div className="flex justify-center gap-4 sm:gap-8 my-6 sm:my-8 [perspective:1000px]">
          <Die value={dice[0]} isRolling={isRolling} />
          <Die value={dice[1]} isRolling={isRolling} />
        </div>

        <div className="mt-6 sm:mt-8 flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
          <Button
            onClick={handleRollDice}
            disabled={isRolling || winner !== null}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base sm:text-lg px-6 py-5 sm:px-8 sm:py-6 rounded-full shadow-lg transform hover:scale-105 transition-transform"
          >
            <Dices className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
            {t.rollButton}
          </Button>
           <Button
            onClick={handleResetGame}
            disabled={isRolling}
            size="lg"
            variant="outline"
            className="font-bold text-base sm:text-lg px-6 py-5 sm:px-8 sm:py-6 rounded-full shadow-lg transform hover:scale-105 transition-transform"
          >
            <RotateCw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            {t.resetButton}
          </Button>
        </div>
      </div>
      <WinnerDialog 
        winner={winner} 
        onReset={handleResetGame} 
        gameOverText={t.gameOver}
        congratulationsNode={winner ? t.congratulations(winner) : null}
        playAgainText={t.playAgain}
      />
    </main>
  );
}
