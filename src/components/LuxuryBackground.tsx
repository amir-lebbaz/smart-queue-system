'use client';

import React, { useEffect, useRef } from 'react';

/**
 * LuxuryBackground Component
 * Implements a high-end, GPU-accelerated animated background for the Arctic Harbor aesthetic:
 * 1. Dynamic Canvas Particle Constellation with connecting neural lines & cursor reaction
 * 2. High-contrast moving Aurora liquid waves (CSS keyframes)
 * 3. Sweeping tech laser beam & subtle perspective grid
 * 4. Drifting ambient micro-nodes
 */
export default function LuxuryBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse coordinates with smoothing
    const mouse = {
      x: width / 2,
      y: height / 3,
      targetX: width / 2,
      targetY: height / 3,
      radius: 180,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particle pool with Arctic Harbor palette
    const colors = [
      'rgba(232, 239, 243, 0.95)', // #E8EFF3 bright white
      'rgba(169, 189, 201, 0.88)', // #A9BDC9 crisp horizon
      'rgba(95, 127, 152, 0.8)',   // #5F7F98 misty blue
      'rgba(56, 189, 248, 0.95)',  // cyan-400 vivid tech glow
      'rgba(125, 211, 252, 0.9)',  // cyan-300
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
      color: string;
      pulseSpeed: number;
      pulseAngle: number;
    }

    const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
    const particles: Particle[] = [];

    for (let i = 0; i < Math.max(particleCount, 50); i++) {
      const radius = Math.random() * 2.5 + 1.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius,
        baseRadius: radius,
        color,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseAngle: Math.random() * Math.PI * 2,
      });
    }

    // Animation Loop
    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse tracking
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Draw interactive cursor glow
      if (mouse.active) {
        const cursorGradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius * 1.5
        );
        cursorGradient.addColorStop(0, 'rgba(56, 189, 248, 0.09)');
        cursorGradient.addColorStop(0.5, 'rgba(46, 79, 107, 0.05)');
        cursorGradient.addColorStop(1, 'rgba(8, 19, 31, 0)');
        ctx.fillStyle = cursorGradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Autonomous drift + subtle sine wave sway
        p.x += p.vx + Math.sin(time + p.pulseAngle) * 0.25;
        p.y += p.vy + Math.cos(time + p.pulseAngle) * 0.25;

        // Screen wrap
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Subtle mouse interaction (gentle repulsion)
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 1.2;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }

        // Pulse radius
        p.pulseAngle += p.pulseSpeed;
        p.radius = p.baseRadius + Math.sin(p.pulseAngle) * 0.6;

        // Draw particle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.fill();

        // Draw particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.radius, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = 'rgba(169, 189, 201, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Draw constellation connecting lines
      const maxDistance = 160;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.42;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(169, 189, 201, ${alpha})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-slateNavy-950 transition-colors duration-300">
      {/* 1. VISIBLE FLOWING AURORA LIQUID RIBBONS */}
      <div
        className="absolute -top-[25%] -left-[20%] w-[140%] h-[90%] opacity-40 blur-[75px] mix-blend-screen animate-aurora-sweep pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 40% 40%, rgba(var(--border-color-rgb), 0.7) 0%, rgba(var(--surface-bg-rgb), 0.5) 35%, transparent 70%)',
        }}
      />

      <div
        className="absolute top-[35%] -right-[25%] w-[120%] h-[95%] opacity-35 blur-[80px] mix-blend-screen animate-aurora-reverse pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 60% 50%, rgba(var(--text-muted-rgb), 0.6) 0%, rgba(var(--border-color-rgb), 0.45) 40%, transparent 75%)',
        }}
      />

      <div
        className="absolute -bottom-[20%] left-[10%] w-[110%] h-[75%] opacity-30 blur-[70px] mix-blend-screen animate-aurora-pulse pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(var(--text-muted-rgb), 0.4) 0%, rgba(var(--border-color-rgb), 0.4) 45%, transparent 70%)',
        }}
      />

      {/* 2. DYNAMIC CANVAS CONSTELLATION & LIVING NODES */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto opacity-70"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* 3. HIGH-TECH MOVING PERSPECTIVE SCANLINE */}
      <div className="absolute inset-0 bg-repeat opacity-[0.12] arctic-grid-pattern pointer-events-none" />

      {/* 4. SWEEPING LASER BEAM (Visible only in arctic theme) */}
      <div className="arctic-only-laser absolute inset-x-0 h-52 bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent animate-laser-scan pointer-events-none" />

      {/* 5. FLOATING GEOMETRIC ACCENTS */}
      <div className="absolute top-28 left-[8%] w-24 h-24 rounded-full border border-slateNavy-800/40 animate-spin-ultra-slow pointer-events-none flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border border-dashed border-slateNavy-600/30" />
      </div>
      <div className="absolute top-[48%] right-[6%] w-32 h-32 rounded-full border border-slateNavy-600/25 animate-spin-reverse-slow pointer-events-none flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border border-dotted border-slateNavy-400/20" />
      </div>

      {/* 6. VIGNETTE OVERLAY */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />
    </div>
  );
}
