import React, { useEffect, useRef } from 'react';

interface GlowingBackgroundProps {
  isDark: boolean;
}

export const GlowingBackground: React.FC<GlowingBackgroundProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Particle dot grid definition
    const cols = Math.floor(width / 32) + 2;
    const rows = Math.floor(height / 32) + 2;
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      step += 0.018;

      const dotColor = isDark
        ? 'rgba(79, 110, 247, '
        : 'rgba(59, 90, 235, ';
      const glowColor = isDark
        ? 'rgba(99, 130, 255, '
        : 'rgba(69, 100, 245, ';

      const spacingX = width / cols;
      const spacingY = height / rows;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacingX;
          const baseY = j * spacingY;

          // Wave equation: combination of sine and cosine waves for organic flowing motion
          const wave1 = Math.sin(step + i * 0.18 + j * 0.12) * 14;
          const wave2 = Math.cos(step * 0.8 + (i + j) * 0.14) * 10;
          const y = baseY + wave1 + wave2;

          // Dynamic brightness based on wave crest
          const waveHeight = (wave1 + wave2 + 24) / 48; // [0, 1]
          const alpha = isDark
            ? Math.max(0.08, waveHeight * 0.45)
            : Math.max(0.05, waveHeight * 0.32);

          const radius = Math.max(1.2, waveHeight * 2.6);

          // Glowing aura on wave crests
          if (waveHeight > 0.65) {
            ctx.beginPath();
            ctx.arc(x, y, radius * 2.8, 0, Math.PI * 2);
            ctx.fillStyle = glowColor + (alpha * 0.25) + ')';
            ctx.fill();
          }

          // Core dot
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = dotColor + alpha + ')';
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: isDark ? 0.85 : 0.65,
      }}
    />
  );
};
