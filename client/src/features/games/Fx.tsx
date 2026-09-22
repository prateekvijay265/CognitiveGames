// @ts-nocheck
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { RefObject } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  life: number;
  max: number;
  color: string;
  spark: boolean;
};

export type FxHandle = {
  burst: (x: number, y: number, o?: { count?: number; power?: number }) => void;
  confetti: (count?: number) => void;
  shake: (amount: number) => void;
};

const CHIPS = ["#e7dcc6", "#d8caae", "#c9b892", "#efe7d6", "#d99a2b"];
const SPARKS = ["#e0451f", "#d99a2b", "#f2c46b"];

export const Fx = forwardRef<
  FxHandle,
  { w: number; h: number; shakeEl: RefObject<HTMLDivElement | null> }
>(function Fx({ w, h, shakeEl }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parts = useRef<Particle[]>([]);
  const shakeA = useRef(0);
  const raf = useRef(0);
  const lastT = useRef(0);
  const dims = useRef({ w: 0, h: 0 });
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    dims.current = { w, h };
    const cv = canvasRef.current;
    if (!cv) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.max(1, Math.round(w * dpr));
    cv.height = Math.max(1, Math.round(h * dpr));
    cv.style.width = `${w}px`;
    cv.style.height = `${h}px`;
    const ctx = cv.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [w, h]);

  const step = (t: number) => {
    const dt = Math.min(0.05, (t - lastT.current) / 1000);
    lastT.current = t;
    const cv = canvasRef.current;
    const ctx = cv ? cv.getContext("2d") : null;
    if (ctx && cv) {
      ctx.clearRect(0, 0, dims.current.w, dims.current.h);
      const arr = parts.current;
      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i];
        p.life -= dt;
        if (p.life <= 0) {
          arr.splice(i, 1);
          continue;
        }
        p.vy += 1150 * dt;
        p.vx *= 0.992;
        p.vy *= 0.995;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        const a = Math.min(1, (p.life / p.max) * 1.7);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.spark) {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.w, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.strokeStyle = "rgba(26,21,18,.35)";
          ctx.lineWidth = 1;
          ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }
    }

    const el = shakeEl.current;
    if (el) {
      if (shakeA.current > 0.5) {
        const a = shakeA.current;
        el.style.transform = `translate3d(${((Math.random() * 2 - 1) * a).toFixed(2)}px, ${(
          (Math.random() * 2 - 1) *
          a
        ).toFixed(2)}px, 0)`;
        shakeA.current *= 0.86;
      } else if (shakeA.current !== 0) {
        shakeA.current = 0;
        el.style.transform = "translate3d(0,0,0)";
      }
    } else {
      shakeA.current = 0;
    }

    if (parts.current.length > 0 || shakeA.current > 0) {
      raf.current = requestAnimationFrame(step);
    } else {
      raf.current = 0;
    }
  };

  const start = () => {
    if (!raf.current) {
      lastT.current = performance.now();
      raf.current = requestAnimationFrame(step);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      burst(x, y, o) {
        const count = Math.round((o?.count ?? 14) * (reduce.current ? 0.4 : 1));
        const power = o?.power ?? 1;
        for (let i = 0; i < count; i++) {
          const spark = i % 4 === 0;
          const ang = Math.random() * Math.PI * 2;
          const sp = (70 + Math.random() * 300) * power;
          parts.current.push({
            x,
            y,
            vx: Math.cos(ang) * sp,
            vy: Math.sin(ang) * sp - 110,
            rot: Math.random() * Math.PI,
            vr: (Math.random() * 2 - 1) * 10,
            w: spark ? 2 + Math.random() * 2.5 : 5 + Math.random() * 7,
            h: spark ? 2 + Math.random() * 2.5 : 4 + Math.random() * 5,
            life: 0.55 + Math.random() * 0.65,
            max: 1.2,
            color: spark
              ? SPARKS[Math.floor(Math.random() * SPARKS.length)]
              : CHIPS[Math.floor(Math.random() * CHIPS.length)],
            spark,
          });
        }
        start();
      },
      confetti(count = 150) {
        const n = Math.round(count * (reduce.current ? 0.35 : 1));
        const { w: W, h: H } = dims.current;
        for (let i = 0; i < n; i++) {
          const spark = i % 5 === 0;
          parts.current.push({
            x: Math.random() * W,
            y: H * (0.15 + Math.random() * 0.4),
            vx: (Math.random() * 2 - 1) * 260,
            vy: -180 - Math.random() * 460,
            rot: Math.random() * Math.PI,
            vr: (Math.random() * 2 - 1) * 12,
            w: spark ? 3 + Math.random() * 3 : 6 + Math.random() * 8,
            h: spark ? 3 + Math.random() * 3 : 5 + Math.random() * 6,
            life: 1.1 + Math.random() * 1.1,
            max: 2.2,
            color: spark
              ? SPARKS[Math.floor(Math.random() * SPARKS.length)]
              : CHIPS[Math.floor(Math.random() * CHIPS.length)],
            spark,
          });
        }
        start();
      },
      shake(amount) {
        if (reduce.current) return;
        shakeA.current = Math.max(shakeA.current, amount);
        start();
      },
    }),
    [],
  );

  useEffect(() => {
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
      parts.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute left-0 top-0 z-50"
      aria-hidden="true"
    />
  );
});
