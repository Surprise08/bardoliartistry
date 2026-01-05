import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  driftX: number;
  driftY: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
  trail: { x: number; y: number; opacity: number }[];
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      const stars: Star[] = [];
      const count = Math.min(500, Math.floor((window.innerWidth * window.innerHeight) / 2500));
      
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 3 + 1,
          size: Math.random() * 1.5 + 0.2,
          baseOpacity: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.15,
          driftY: (Math.random() - 0.5) * 0.1,
        });
      }
      starsRef.current = stars;
    };

    const createShootingStar = (): ShootingStar => {
      const startX = Math.random() * canvas.width * 0.8;
      const startY = Math.random() * canvas.height * 0.3;
      return {
        x: startX,
        y: startY,
        length: Math.random() * 80 + 60,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        opacity: 1,
        active: true,
        trail: [],
      };
    };

    const initShootingStars = () => {
      shootingStarsRef.current = [];
    };

    const drawStar = (
      ctx: CanvasRenderingContext2D, 
      x: number, 
      y: number, 
      size: number, 
      opacity: number,
      isTiffany: boolean = false
    ) => {
      if (isTiffany) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 5);
        gradient.addColorStop(0, `hsla(174, 72%, 70%, ${opacity})`);
        gradient.addColorStop(0.4, `hsla(174, 72%, 56%, ${opacity * 0.4})`);
        gradient.addColorStop(1, `hsla(174, 72%, 56%, 0)`);
        
        ctx.beginPath();
        ctx.arc(x, y, size * 5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      // Star core with glow
      const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
      coreGradient.addColorStop(0, isTiffany 
        ? `hsla(174, 50%, 95%, ${opacity})` 
        : `hsla(0, 0%, 100%, ${opacity})`);
      coreGradient.addColorStop(0.5, isTiffany 
        ? `hsla(174, 50%, 80%, ${opacity * 0.5})` 
        : `hsla(0, 0%, 90%, ${opacity * 0.3})`);
      coreGradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Sharp bright center
      ctx.beginPath();
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = isTiffany 
        ? `hsla(174, 50%, 98%, ${opacity})` 
        : `hsla(0, 0%, 100%, ${opacity})`;
      ctx.fill();
      
      // Cross flare for larger stars
      if (size > 0.8) {
        ctx.strokeStyle = `hsla(0, 0%, 100%, ${opacity * 0.2})`;
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.moveTo(x - size * 3, y);
        ctx.lineTo(x + size * 3, y);
        ctx.moveTo(x, y - size * 3);
        ctx.lineTo(x, y + size * 3);
        ctx.stroke();
      }
    };

    const drawShootingStar = (ctx: CanvasRenderingContext2D, star: ShootingStar) => {
      if (!star.active) return;

      // Draw trail
      star.trail.forEach((point, i) => {
        const trailOpacity = point.opacity * (1 - i / star.trail.length);
        const trailSize = (1 - i / star.trail.length) * 2;
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(0, 0%, 100%, ${trailOpacity * 0.5})`;
        ctx.fill();
      });

      // Draw head with glow
      const headGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 8);
      headGradient.addColorStop(0, `hsla(174, 60%, 90%, ${star.opacity})`);
      headGradient.addColorStop(0.3, `hsla(174, 60%, 70%, ${star.opacity * 0.6})`);
      headGradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = headGradient;
      ctx.fill();

      // Bright core
      ctx.beginPath();
      ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(0, 0%, 100%, ${star.opacity})`;
      ctx.fill();
    };

    const animate = () => {
      timeRef.current += 0.016;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update stars with slow drift
      starsRef.current.forEach((star, index) => {
        // Slow continuous drift
        star.x += star.driftX;
        star.y += star.driftY;
        
        // Wrap around screen edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Twinkle effect
        const twinkle = Math.sin(timeRef.current * star.twinkleSpeed * 100 + star.twinklePhase);
        const currentOpacity = star.baseOpacity * (0.4 + 0.6 * Math.abs(twinkle));
        
        const sizeWithDepth = star.size * (0.5 + star.z * 0.3);
        const isTiffany = index % 40 === 0;
        
        drawStar(ctx, star.x, star.y, sizeWithDepth, currentOpacity, isTiffany);
      });

      // Spawn new shooting stars randomly
      if (Math.random() < 0.008 && shootingStarsRef.current.filter(s => s.active).length < 3) {
        shootingStarsRef.current.push(createShootingStar());
      }

      // Update and draw shooting stars
      shootingStarsRef.current.forEach((star) => {
        if (!star.active) return;

        // Add current position to trail
        star.trail.unshift({ x: star.x, y: star.y, opacity: star.opacity });
        if (star.trail.length > 20) star.trail.pop();

        // Move shooting star
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;

        // Fade out
        star.opacity -= 0.008;

        // Deactivate if off screen or faded
        if (star.x > canvas.width || star.y > canvas.height || star.opacity <= 0) {
          star.active = false;
        }

        drawShootingStar(ctx, star);
      });

      // Clean up inactive shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter(s => s.active);

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createStars();
    initShootingStars();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createStars();
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default ParticleBackground;
