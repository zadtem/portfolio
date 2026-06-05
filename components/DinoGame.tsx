"use client";

import { useRef, useEffect, useCallback } from "react";

// ─── Configuration ─────────────────────────────────────────
const PX = 3;
const W = 600;
const H = 150;
const GROUND_Y = 120;
const DINO_X = 44;

// Physics (per millisecond)
const JUMP_VEL = -0.42;
const GRAVITY = 0.0016;
const BASE_SPEED = 0.22;
const SPEED_INC = 0.000008;
const SPAWN_MIN = 800;
const SPAWN_MAX = 2200;

// Colors
const DINO_CLR = "#f77916";
const WORLD_CLR = "#535353";
const SCORE_FONT = '700 12px "Manrope", sans-serif';
const MESSAGE_FONT = '400 13px "Faculty Glyphic", Georgia, serif';
const GAME_OVER_FONT = '400 14px "Faculty Glyphic", Georgia, serif';
const RESTART_FONT = '400 12px "Manrope", sans-serif';

// ─── Sprite Definitions ────────────────────────────────────
// '#' = filled, '.' = empty, 'X' = eye (white)
const S_STAND = [
  ".....######",
  ".....#.####",
  ".....######",
  ".....#####.",
  "..#..######",
  "..##.######",
  ".##########",
  "####.######",
  ".##########",
  "..########.",
  "...####....",
  "...##.##...",
  "...#...#...",
];
const S_RUN1 = [
  ".....######",
  ".....#.####",
  ".....######",
  ".....#####.",
  "..#..######",
  "..##.######",
  ".##########",
  "####.######",
  ".##########",
  "..########.",
  "...####....",
  "...##......",
  "......##...",
];
const S_RUN2 = [
  ".....######",
  ".....#.####",
  ".....######",
  ".....#####.",
  "..#..######",
  "..##.######",
  ".##########",
  "####.######",
  ".##########",
  "..########.",
  "...####....",
  "......##...",
  "...##......",
];
const S_DEAD = [
  ".....######",
  ".....#X####",
  ".....######",
  ".....#####.",
  "..#..######",
  "..##.######",
  ".##########",
  "####.######",
  ".##########",
  "..########.",
  "...####....",
  "...##.##...",
  "...#...#...",
];
const S_CACTUS_SM = [
  ".#.",
  ".#.",
  "##.",
  ".#.",
  ".#.",
  ".#.",
  ".#.",
  ".#.",
];
const S_CACTUS_LG = [
  "..#..",
  "..#..",
  "..#.#",
  "#.#.#",
  "#.#.#",
  "###.#",
  "..###",
  "..#..",
  "..#..",
  "..#..",
  "..#..",
];

const CACTUS_VARIANTS = [S_CACTUS_SM, S_CACTUS_LG];

// ─── Helpers ───────────────────────────────────────────────
function sW(s: string[]) {
  return Math.max(...s.map((r) => r.length)) * PX;
}
function sH(s: string[]) {
  return s.length * PX;
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: string[],
  x: number,
  y: number,
  color: string
) {
  for (let r = 0; r < sprite.length; r++) {
    for (let c = 0; c < sprite[r].length; c++) {
      const ch = sprite[r][c];
      if (ch === "#") {
        ctx.fillStyle = color;
        ctx.fillRect(x + c * PX, y + r * PX, PX, PX);
      } else if (ch === "X") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + c * PX, y + r * PX, PX, PX);
      }
    }
  }
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// ─── Game State ────────────────────────────────────────────
interface Cactus {
  x: number;
  variant: number;
}

interface State {
  phase: "idle" | "playing" | "dead";
  dinoY: number;
  vel: number;
  speed: number;
  score: number;
  frame: number;
  frameAccum: number;
  cacti: Cactus[];
  spawnTimer: number;
  groundOff: number;
}

function initState(): State {
  return {
    phase: "idle",
    dinoY: 0,
    vel: 0,
    speed: BASE_SPEED,
    score: 0,
    frame: 0,
    frameAccum: 0,
    cacti: [],
    spawnTimer: 1200,
    groundOff: 0,
  };
}

// ─── Component ─────────────────────────────────────────────
export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef<State>(initState());
  const raf = useRef(0);
  const lastTime = useRef<number | null>(null);

  const startGame = useCallback(() => {
    const s = state.current;
    s.phase = "playing";
    s.dinoY = 0;
    s.vel = 0;
    s.speed = BASE_SPEED;
    s.score = 0;
    s.frame = 0;
    s.frameAccum = 0;
    s.cacti = [];
    s.spawnTimer = 1200;
    s.groundOff = 0;
    lastTime.current = null;
  }, []);

  const doJump = useCallback(() => {
    const s = state.current;
    if (s.phase === "idle" || s.phase === "dead") {
      startGame();
      return;
    }
    if (s.dinoY === 0 && s.vel === 0) {
      s.vel = JUMP_VEL;
    }
  }, [startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        doJump();
      }
    };
    const onClick = () => doJump();
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      doJump();
    };

    window.addEventListener("keydown", onKey);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchstart", onTouch, { passive: false });

    function loop(ts: number) {
      if (!ctx) return;
      const s = state.current;

      if (lastTime.current === null) {
        lastTime.current = ts;
        raf.current = requestAnimationFrame(loop);
        return;
      }

      const dt = Math.min(ts - lastTime.current, 33);
      lastTime.current = ts;

      // ── Update ──
      if (s.phase === "playing") {
        s.vel += GRAVITY * dt;
        s.dinoY += s.vel * dt;
        if (s.dinoY >= 0) {
          s.dinoY = 0;
          s.vel = 0;
        }

        s.frameAccum += dt;
        if (s.frameAccum > 100) {
          s.frame = 1 - s.frame;
          s.frameAccum = 0;
        }

        s.speed += SPEED_INC * dt;
        s.groundOff += s.speed * dt;

        for (const c of s.cacti) {
          c.x -= s.speed * dt;
        }
        s.cacti = s.cacti.filter((c) => c.x > -40);

        s.spawnTimer -= dt;
        if (s.spawnTimer <= 0) {
          s.cacti.push({
            x: W + rand(0, 50),
            variant: Math.random() > 0.5 ? 1 : 0,
          });
          s.spawnTimer = rand(SPAWN_MIN, SPAWN_MAX) / (s.speed / BASE_SPEED);
        }

        // Collision
        const jumping = s.dinoY < -2;
        const dSprite = jumping
          ? S_STAND
          : s.frame === 0
            ? S_RUN1
            : S_RUN2;
        const dW = sW(dSprite);
        const dH = sH(dSprite);
        const dTop = GROUND_Y - dH + s.dinoY;

        for (const c of s.cacti) {
          const cs = CACTUS_VARIANTS[c.variant];
          const cW = sW(cs);
          const cH = sH(cs);
          if (
            DINO_X + 6 < c.x + cW - 3 &&
            DINO_X + dW - 3 > c.x + 3 &&
            dTop + 6 < GROUND_Y &&
            dTop + dH > GROUND_Y - cH + 3
          ) {
            s.phase = "dead";
            break;
          }
        }

        s.score += dt * 0.01;
      }

      // ── Draw ──
      ctx.clearRect(0, 0, W, H);

      // Ground line
      ctx.strokeStyle = WORLD_CLR;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 0.5);
      ctx.lineTo(W, GROUND_Y + 0.5);
      ctx.stroke();

      // Ground texture
      ctx.fillStyle = "rgba(83,83,83,0.3)";
      for (let i = 0; i < 40; i++) {
        const gx =
          (((i * 17.3 - s.groundOff * 0.8) % (W + 30)) + W + 30) %
            (W + 30) -
          15;
        const gy = GROUND_Y + 3 + (i % 3) * 4;
        const w = i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1;
        ctx.fillRect(gx, gy, w, 1);
      }

      // Cacti
      for (const c of s.cacti) {
        const cs = CACTUS_VARIANTS[c.variant];
        drawSprite(ctx, cs, c.x, GROUND_Y - sH(cs), WORLD_CLR);
      }

      // Dino
      let dinoSprite: string[];
      if (s.phase === "dead") {
        dinoSprite = S_DEAD;
      } else if (s.phase === "idle") {
        dinoSprite = S_STAND;
      } else {
        const jumping = s.dinoY < -2;
        dinoSprite = jumping
          ? S_STAND
          : s.frame === 0
            ? S_RUN1
            : S_RUN2;
      }
      drawSprite(
        ctx,
        dinoSprite,
        DINO_X,
        GROUND_Y - sH(dinoSprite) + s.dinoY,
        DINO_CLR
      );

      // Score
      if (s.phase !== "idle") {
        ctx.fillStyle = WORLD_CLR;
        ctx.font = SCORE_FONT;
        ctx.textAlign = "right";
        ctx.fillText(
          String(Math.floor(s.score)).padStart(5, "0"),
          W - 12,
          18
        );
      }

      // Messages
      ctx.textAlign = "center";
      if (s.phase === "idle") {
        ctx.fillStyle = WORLD_CLR;
        ctx.font = MESSAGE_FONT;
        ctx.fillText("Press Space or Tap to Start", W / 2, 30);
      } else if (s.phase === "dead") {
        ctx.fillStyle = WORLD_CLR;
        ctx.font = GAME_OVER_FONT;
        ctx.fillText("G A M E  O V E R", W / 2, 40);
        ctx.font = RESTART_FONT;
        ctx.fillText("Tap or press Space to restart", W / 2, 58);
      }

      raf.current = requestAnimationFrame(loop);
    }

    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchstart", onTouch);
    };
  }, [doJump]);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{
        width: "100%",
        maxWidth: `${W}px`,
        height: "auto",
        imageRendering: "pixelated",
        cursor: "pointer",
      }}
      tabIndex={0}
    />
  );
}
