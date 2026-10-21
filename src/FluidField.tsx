import { useEffect, useRef } from "react";

type FluidBlob = {
  x: number;
  y: number;
  radius: number;
  phase: number;
  drift: number;
  color: string;
  reach: number;
};

const palette: FluidBlob[] = [
  { x: 0.20, y: 0.34, radius: 0.28, phase: 0.2, drift: 0.72, color: "#f2bd45", reach: 0.11 },
  { x: 0.48, y: 0.64, radius: 0.34, phase: 1.9, drift: 0.53, color: "#f05a48", reach: 0.08 },
  { x: 0.76, y: 0.35, radius: 0.31, phase: 3.5, drift: 0.61, color: "#9474ff", reach: 0.12 },
  { x: 0.83, y: 0.78, radius: 0.24, phase: 4.8, drift: 0.82, color: "#f5eee4", reach: 0.06 },
  { x: 0.19, y: 0.82, radius: 0.23, phase: 5.7, drift: 0.67, color: "#e96c49", reach: 0.07 },
];

function rgb(hex: string) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16)).join(",");
}

function traceBlob(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  phase: number,
) {
  const points = 72;
  context.beginPath();
  for (let index = 0; index <= points; index += 1) {
    const angle = (index / points) * Math.PI * 2;
    const waveA = Math.sin(angle * 3 + time * 0.72 + phase) * 0.105;
    const waveB = Math.sin(angle * 5 - time * 0.53 + phase * 1.7) * 0.065;
    const waveC = Math.cos(angle * 2 + time * 0.37 + phase) * 0.045;
    const r = radius * (1 + waveA + waveB + waveC);
    const px = x + Math.cos(angle) * r * (1 + 0.13 * Math.sin(time * 0.21 + phase));
    const py = y + Math.sin(angle) * r * (0.76 + 0.12 * Math.cos(time * 0.24 + phase));
    if (index === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
}

export default function FluidField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0.5, y: 0.5, active: false };
    let width = 1;
    let height = 1;
    let frame = 0;
    let reducedMotion = motionQuery.matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(reducedMotion ? 0 : performance.now() / 1000);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "screen";

      for (const blob of palette) {
        const phase = blob.phase;
        const driftX = Math.sin(time * blob.drift + phase) * width * 0.085;
        const driftY = Math.cos(time * blob.drift * 0.77 + phase) * height * 0.115;
        const pointerPull = pointer.active && !reducedMotion ? blob.reach : 0;
        const x = blob.x * width + driftX + (pointer.x - 0.5) * width * pointerPull;
        const y = blob.y * height + driftY + (pointer.y - 0.5) * height * pointerPull;
        const radius = Math.min(width, height) * blob.radius * (1 + 0.06 * Math.sin(time * 0.38 + phase));
        const color = rgb(blob.color);

        context.save();
        traceBlob(context, x, y, radius * 1.2, time, phase);
        context.filter = `blur(${Math.max(22, radius * 0.18)}px)`;
        const glow = context.createRadialGradient(x, y, radius * 0.05, x, y, radius * 1.34);
        glow.addColorStop(0, `rgba(${color},0.32)`);
        glow.addColorStop(0.48, `rgba(${color},0.19)`);
        glow.addColorStop(1, `rgba(${color},0)`);
        context.fillStyle = glow;
        context.fill();
        context.restore();

        context.save();
        traceBlob(context, x, y, radius * 0.86, time, phase);
        const body = context.createRadialGradient(
          x - radius * 0.22, y - radius * 0.2, radius * 0.03,
          x, y, radius * 1.05,
        );
        body.addColorStop(0, `rgba(${color},0.22)`);
        body.addColorStop(0.58, `rgba(${color},0.11)`);
        body.addColorStop(1, `rgba(${color},0.015)`);
        context.fillStyle = body;
        context.fill();
        context.strokeStyle = `rgba(${color},0.12)`;
        context.lineWidth = 1.2;
        context.stroke();
        context.restore();
      }

      context.globalCompositeOperation = "source-over";
      // Tiny drifting motes give the moving color field a tactile, liquid surface.
      for (let index = 0; index < 22; index += 1) {
        const phase = index * 2.399;
        const x = ((index * 0.618 + Math.sin(time * 0.13 + phase) * 0.035) % 1) * width;
        const y = ((index * 0.379 + Math.cos(time * 0.11 + phase) * 0.06 + 1) % 1) * height;
        context.beginPath();
        context.arc(x, y, index % 4 === 0 ? 1.5 : 0.7, 0, Math.PI * 2);
        context.fillStyle = index % 3 === 0 ? "rgba(242,189,69,.30)" : "rgba(245,238,228,.18)";
        context.fill();
      }
    };

    const animate = (timestamp: number) => {
      draw(timestamp / 1000);
      if (!reducedMotion) frame = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      pointer.y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      pointer.active = true;
    };
    const onPointerLeave = () => { pointer.active = false; };
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      window.cancelAnimationFrame(frame);
      if (reducedMotion) draw(0);
      else frame = window.requestAnimationFrame(animate);
    };

    resize();
    if (!reducedMotion) frame = window.requestAnimationFrame(animate);
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize, { passive: true });
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      window.cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="fluid-canvas" aria-hidden="true" />;
}
