'use client';

import React, { useEffect, useRef } from 'react';

/**
 * CalmMistCanvas — "Calm Breath" Living Procedural Ambient Canvas
 * Palette: Pale Snow (#d5dbe2), Clouded Steel (#b3bfcb), Icy Blue (#778ca4)
 * Engineered for 60fps butter-smooth execution, DPR capped at 1.5,
 * full prefers-reduced-motion support, zero GPU overhead.
 */
export default function CalmMistCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    let currentTheme: 'arctic' | 'frozen' =
      (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'frozen')
        ? 'frozen'
        : 'arctic';

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: 'arctic' | 'frozen' }>;
      if (customEvent.detail?.theme) {
        currentTheme = customEvent.detail.theme;
      } else if (typeof document !== 'undefined') {
        currentTheme = document.documentElement.getAttribute('data-theme') === 'frozen' ? 'frozen' : 'arctic';
      }
    };

    window.addEventListener('themechange', handleThemeChange);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left) / width;
      targetMouseY = (e.clientY - rect.top) / height;
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    resize();

    // Render loop: multi-layered slow harmonic sine mist
    const render = () => {
      time += 0.0035; // gentle, unhurried breath rate

      // Soft lerp mouse for tranquil interaction
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      if (currentTheme === 'frozen') {
        // --- FROZEN WHISPER (LIGHT THEME) ---
        const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
        baseGrad.addColorStop(0, '#f7f9fb');
        baseGrad.addColorStop(0.55, '#eef1f4');
        baseGrad.addColorStop(1, '#d5dbe2');
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, width, height);

        // Layer 1: Soft Clouded Steel wave
        const gradWave1 = ctx.createRadialGradient(
          width * (0.3 + mouseX * 0.15),
          height * (0.25 + mouseY * 0.1),
          width * 0.08,
          width * (0.35 + Math.sin(time) * 0.08),
          height * (0.3 + Math.cos(time * 0.8) * 0.06),
          width * 0.65
        );
        gradWave1.addColorStop(0, 'rgba(179, 191, 203, 0.45)'); // #b3bfcb
        gradWave1.addColorStop(0.5, 'rgba(213, 219, 226, 0.25)'); // #d5dbe2
        gradWave1.addColorStop(1, 'rgba(247, 249, 251, 0)');

        ctx.fillStyle = gradWave1;
        ctx.beginPath();
        ctx.arc(
          width * (0.35 + Math.sin(time) * 0.08),
          height * (0.3 + Math.cos(time * 0.8) * 0.06),
          width * 0.65,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Layer 2: Icy Blue tranquil focal whisper (#778ca4)
        const gradWave2 = ctx.createRadialGradient(
          width * (0.7 - mouseX * 0.12),
          height * (0.4 + mouseY * 0.12),
          width * 0.05,
          width * (0.65 + Math.cos(time * 0.7) * 0.09),
          height * (0.45 + Math.sin(time * 0.9) * 0.07),
          width * 0.55
        );
        gradWave2.addColorStop(0, 'rgba(119, 140, 164, 0.22)'); // #778ca4
        gradWave2.addColorStop(0.6, 'rgba(179, 191, 203, 0.12)'); // #b3bfcb
        gradWave2.addColorStop(1, 'rgba(247, 249, 251, 0)');

        ctx.fillStyle = gradWave2;
        ctx.beginPath();
        ctx.arc(
          width * (0.65 + Math.cos(time * 0.7) * 0.09),
          height * (0.45 + Math.sin(time * 0.9) * 0.07),
          width * 0.55,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Layer 3: Organic Mist Flow Horizon
        ctx.beginPath();
        const waveYBase = height * 0.78;
        ctx.moveTo(0, height);
        ctx.lineTo(0, waveYBase);

        for (let x = 0; x <= width; x += 30) {
          const nx = x / width;
          const wave =
            Math.sin(nx * 4.2 + time * 1.4) * 22 +
            Math.cos(nx * 2.8 - time * 0.9) * 16 +
            Math.sin(nx * 6.5 + time * 0.6) * 8;
          ctx.lineTo(x, waveYBase + wave);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const fogGrad = ctx.createLinearGradient(0, waveYBase - 40, 0, height);
        fogGrad.addColorStop(0, 'rgba(213, 219, 226, 0)');
        fogGrad.addColorStop(0.4, 'rgba(213, 219, 226, 0.45)');
        fogGrad.addColorStop(1, 'rgba(179, 191, 203, 0.35)');
        ctx.fillStyle = fogGrad;
        ctx.fill();
      } else {
        // --- ARCTIC HARBOR (DARK THEME - MIDNIGHT LUXURY) ---
        const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
        baseGrad.addColorStop(0, '#06141B');
        baseGrad.addColorStop(0.55, '#0c1c27');
        baseGrad.addColorStop(1, '#11212D');
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, width, height);

        // Layer 1: Midnight Slate Aurora Wave
        const gradWave1 = ctx.createRadialGradient(
          width * (0.3 + mouseX * 0.15),
          height * (0.25 + mouseY * 0.1),
          width * 0.08,
          width * (0.35 + Math.sin(time) * 0.08),
          height * (0.3 + Math.cos(time * 0.8) * 0.06),
          width * 0.65
        );
        gradWave1.addColorStop(0, 'rgba(37, 55, 69, 0.55)'); // #253745
        gradWave1.addColorStop(0.5, 'rgba(17, 33, 45, 0.35)'); // #11212D
        gradWave1.addColorStop(1, 'rgba(6, 20, 27, 0)');

        ctx.fillStyle = gradWave1;
        ctx.beginPath();
        ctx.arc(
          width * (0.35 + Math.sin(time) * 0.08),
          height * (0.3 + Math.cos(time * 0.8) * 0.06),
          width * 0.65,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Layer 2: Misty Horizon Blue Accent Wave
        const gradWave2 = ctx.createRadialGradient(
          width * (0.7 - mouseX * 0.12),
          height * (0.4 + mouseY * 0.12),
          width * 0.05,
          width * (0.65 + Math.cos(time * 0.7) * 0.09),
          height * (0.45 + Math.sin(time * 0.9) * 0.07),
          width * 0.55
        );
        gradWave2.addColorStop(0, 'rgba(74, 92, 106, 0.35)'); // #4A5C6A
        gradWave2.addColorStop(0.6, 'rgba(37, 55, 69, 0.2)'); // #253745
        gradWave2.addColorStop(1, 'rgba(6, 20, 27, 0)');

        ctx.fillStyle = gradWave2;
        ctx.beginPath();
        ctx.arc(
          width * (0.65 + Math.cos(time * 0.7) * 0.09),
          height * (0.45 + Math.sin(time * 0.9) * 0.07),
          width * 0.55,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Layer 3: Organic Midnight Horizon Fog
        ctx.beginPath();
        const waveYBase = height * 0.78;
        ctx.moveTo(0, height);
        ctx.lineTo(0, waveYBase);

        for (let x = 0; x <= width; x += 30) {
          const nx = x / width;
          const wave =
            Math.sin(nx * 4.2 + time * 1.4) * 22 +
            Math.cos(nx * 2.8 - time * 0.9) * 16 +
            Math.sin(nx * 6.5 + time * 0.6) * 8;
          ctx.lineTo(x, waveYBase + wave);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const fogGrad = ctx.createLinearGradient(0, waveYBase - 40, 0, height);
        fogGrad.addColorStop(0, 'rgba(17, 33, 45, 0)');
        fogGrad.addColorStop(0.4, 'rgba(17, 33, 45, 0.55)');
        fogGrad.addColorStop(1, 'rgba(6, 20, 27, 0.75)');
        ctx.fillStyle = fogGrad;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-hidden="true"
      />
      {/* Subtle film grain texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
