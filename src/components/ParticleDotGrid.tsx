import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  density: number;
  hue: number; // Red (350) or Blue (215)
  activation: number; // 0 (ambient) to 1 (activated)
}

export const ParticleDotGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Tight physical displacement radius (38px), larger color activation radius (120px)
    let mouse = {
      x: -1000,
      y: -1000,
      radius: 38,
      colorRadius: 120,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const initParticles = () => {
      const width = (canvas.width = window.innerWidth);
      const height = (canvas.height = window.innerHeight);

      particles = [];
      const gap = 20;

      for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
          // Strictly one shade of Red (350) and one shade of Blue (215)
          const isRed = (Math.sin(x * 0.05) + Math.cos(y * 0.05)) > 0;
          const hue = isRed ? 350 : 215;

          particles.push({
            x,
            y,
            baseX: x,
            baseY: y,
            size: Math.random() * 0.6 + 0.5,
            density: Math.random() * 12 + 4,
            hue,
            activation: 0,
          });
        }
      }
    };

    initParticles();

    const handleResize = () => {
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.025;

      const isDark = document.documentElement.classList.contains('dark');
      ctx.shadowBlur = 0; // Solid crisp rendering without neon blur

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Ambient wave motion
        const waveX = Math.sin(time + p.baseY * 0.03) * 1.2;
        const waveY = Math.cos(time + p.baseX * 0.03) * 1.2;

        const targetX = p.baseX + waveX;
        const targetY = p.baseY + waveY;

        // Mouse distance calculations
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Tight Physical Push (38px radius)
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const directionX = forceDirectionX * force * p.density * 0.5;
          const directionY = forceDirectionY * force * p.density * 0.5;

          p.x -= directionX;
          p.y -= directionY;
        } else {
          p.x += (targetX - p.x) * 0.1;
          p.y += (targetY - p.y) * 0.1;
        }

        // Grid Dot Activation & Lingering Decay Physics
        if (distance < mouse.colorRadius) {
          const currentFactor = 1 - distance / mouse.colorRadius;
          p.activation = Math.max(p.activation, currentFactor);
        } else {
          p.activation = Math.max(0, p.activation - 0.015);
        }

        const act = p.activation;
        let opacity = isDark ? (0.14 + act * 0.86) : (0.18 + act * 0.82);
        let drawSize = p.size + act * 1.2;
        let fillStyle = '';

        if (act > 0.02) {
          // Solid, Crisp Matte Colors
          const saturation = 90;
          const lightness = isDark ? (50 + act * 15) : (45 + act * 10);
          fillStyle = `hsla(${p.hue}, ${saturation}%, ${lightness}%, ${opacity.toFixed(2)})`;
        } else {
          // Normal Ambient State
          if (isDark) {
            fillStyle = `hsla(${p.hue}, 35%, 75%, ${opacity.toFixed(2)})`;
          } else {
            fillStyle = `hsla(${p.hue}, 35%, 25%, ${opacity.toFixed(2)})`;
          }
        }

        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        // Crisp Solid Black Border Outline for active dots
        if (act > 0.05) {
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(0, 0, 0, ${(Math.min(1, act * 1.2)).toFixed(2)})`;
          ctx.stroke();
        }

      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
      style={{ opacity: 0.9 }}
    />
  );
};
