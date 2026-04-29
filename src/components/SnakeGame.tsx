import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw, Play } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';
const GAME_SPEED = 100;

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  onHighScoreChange: (highScore: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, onHighScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<string>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  
  const lastDirectionRef = useRef<string>(INITIAL_DIRECTION);

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  useEffect(() => {
    onHighScoreChange(highScore);
  }, [highScore, onHighScoreChange]);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsActive(true);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellWidth = canvas.width / GRID_SIZE;
    const cellHeight = canvas.height / GRID_SIZE;

    // Clear board
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellWidth, 0);
      ctx.lineTo(i * cellWidth, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellHeight);
      ctx.lineTo(canvas.width, i * cellHeight);
      ctx.stroke();
    }

    // Draw Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#00ff41';
      ctx.shadowBlur = index === 0 ? 12 : 8;
      ctx.shadowColor = '#00ff41';
      
      const padding = index === 0 ? 0 : 1;
      ctx.fillRect(
        segment.x * cellWidth + padding,
        segment.y * cellHeight + padding,
        cellWidth - padding * 2,
        cellHeight - padding * 2
      );
    });

    // Draw Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellWidth + cellWidth / 2,
      food.y * cellHeight + cellHeight / 2,
      cellWidth / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food]);

  const moveSnake = useCallback(() => {
    if (isGameOver || !isActive) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        setIsActive(false);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsActive(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      lastDirectionRef.current = direction;
      return newSnake;
    });
  }, [direction, food, isGameOver, isActive, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const lastDir = lastDirectionRef.current;

      if ((key === 'ArrowUp' || key === 'w') && lastDir !== 'DOWN') setDirection('UP');
      if ((key === 'ArrowDown' || key === 's') && lastDir !== 'UP') setDirection('DOWN');
      if ((key === 'ArrowLeft' || key === 'a') && lastDir !== 'RIGHT') setDirection('LEFT');
      if ((key === 'ArrowRight' || key === 'd') && lastDir !== 'LEFT') setDirection('RIGHT');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  return (
    <div id="snake-game-container" className="flex flex-col items-center justify-center w-full h-full max-w-[500px] mx-auto overflow-hidden">
      <div className="relative group w-full aspect-square max-w-[420px]">
        <canvas
          ref={canvasRef}
          id="game-canvas"
          width={400}
          height={400}
          className="w-full h-full bg-[#080808] border-2 border-matrix-green matrix-glow cursor-none"
        />
        
        <AnimatePresence>
          {!isActive && !isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <h2 className="text-3xl font-black text-matrix-green mb-8 uppercase tracking-[8px]">Ready_System</h2>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-10 py-3 bg-white text-black font-black hover:bg-matrix-green transition-all uppercase tracking-widest text-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                Initialize
              </button>
              <p className="mt-6 text-[10px] text-white/30 uppercase tracking-[4px] font-mono">Input: WASD or Arrows</p>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
            >
              <h2 className="text-4xl font-black text-neon-pink mb-2 uppercase tracking-[4px]">System_Failure</h2>
              <p className="text-xl font-mono text-white/60 mb-10 tracking-widest">Score: {score.toString().padStart(6, '0')}</p>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-10 py-3 border-2 border-matrix-green text-matrix-green font-black hover:bg-matrix-green hover:text-black transition-all uppercase tracking-widest text-sm"
              >
                <RefreshCcw className="w-4 h-4" />
                Reboot_Sequence
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
