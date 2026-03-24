import React, { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setNextDirection({ x: 0, y: -1 });
    setFood(generateFood([{ x: 10, y: 10 }]));
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y !== 1) setNextDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y !== -1) setNextDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x !== 1) setNextDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x !== -1) setNextDirection({ x: 1, y: 0 });
          break;
        case ' ':
        case 'Escape':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + nextDirection.x,
          y: head.y + nextDirection.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            onScoreChange(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        setDirection(nextDirection);
        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [snake, nextDirection, food, gameOver, isPaused, score, generateFood, onScoreChange]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000'; // Pure black
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid (harsh lines)
    ctx.strokeStyle = '#00ffff';
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Draw food (Magenta Block)
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    
    // Draw glitch artifact on food randomly
    if (Math.random() > 0.8) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(food.x * CELL_SIZE + 2, food.y * CELL_SIZE + 2, CELL_SIZE - 4, 2);
    }

    // Draw snake (Cyan Blocks)
    snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = '#ffffff'; // Head
      } else {
        ctx.fillStyle = '#00ffff'; // Body
      }
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
    });

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center justify-center p-2 bg-black border-4 border-cyan-glitch hard-shadow">
      <div className="absolute -top-4 right-4 bg-black px-2 text-cyan-glitch font-pixel text-sm border border-cyan-glitch">
        [ PID: 0x8F3A ]
      </div>
      
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="border-2 border-magenta-glitch bg-black mt-4"
      />

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 border-4 border-magenta-glitch m-2">
          <h2 
            className="text-4xl font-pixel text-white mb-4 glitch uppercase text-center"
            data-text="FATAL ERROR"
          >
            FATAL ERROR
          </h2>
          <p className="text-cyan-glitch font-terminal text-2xl mb-8 bg-magenta-glitch/20 px-4 py-1 border border-cyan-glitch">
            &gt; DATA_CORRUPTION: {score}
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-black border-2 border-cyan-glitch text-cyan-glitch font-pixel text-xl hover:bg-cyan-glitch hover:text-black transition-none uppercase"
          >
            [ REBOOT ]
          </button>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 border-4 border-cyan-glitch m-2">
          <h2 
            className="text-3xl font-pixel text-white mb-8 glitch uppercase text-center"
            data-text="PROCESS SUSPENDED"
          >
            PROCESS SUSPENDED
          </h2>
          <button
            onClick={() => setIsPaused(false)}
            className="px-6 py-2 bg-black border-2 border-magenta-glitch text-magenta-glitch font-pixel text-xl hover:bg-magenta-glitch hover:text-black transition-none uppercase"
          >
            [ RESUME ]
          </button>
        </div>
      )}
    </div>
  );
}
