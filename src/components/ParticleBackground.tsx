import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
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
      const count = Math.min(200, Math.floor((window.innerWidth * window.innerHeight) / 8000));
      
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.15,
          speedY: (Math.random() - 0.5) * 0.15,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
      starsRef.current = stars;
    };

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      // Draw star with glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      gradient.addColorStop(0, `hsla(200, 80%, 85%, ${opacity})`);
      gradient.addColorStop(0.3, `hsla(200, 70%, 70%, ${opacity * 0.5})`);
      gradient.addColorStop(1, `hsla(200, 60%, 60%, 0)`);
      
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Core of the star
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(200, 100%, 95%, ${opacity})`;
      ctx.fill();
    };

    const animate = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nebula effect in background
      const nebulaGradient1 = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.3, 0,
        canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.4
      );
      nebulaGradient1.addColorStop(0, 'hsla(270, 60%, 40%, 0.08)');
      nebulaGradient1.addColorStop(1, 'hsla(270, 60%, 20%, 0)');
      ctx.fillStyle = nebulaGradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nebulaGradient2 = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.7, 0,
        canvas.width * 0.8, canvas.height * 0.7, canvas.width * 0.5
      );
      nebulaGradient2.addColorStop(0, 'hsla(200, 70%, 50%, 0.06)');
      nebulaGradient2.addColorStop(1, 'hsla(200, 60%, 30%, 0)');
      ctx.fillStyle = nebulaGradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        // Move stars
        star.x += star.speedX;
        star.y += star.speedY;

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Twinkle effect
        const twinkle = Math.sin(timeRef.current * star.twinkleSpeed * 100 + star.twinklePhase);
        const currentOpacity = star.opacity * (0.6 + 0.4 * twinkle);

        drawStar(ctx, star.x, star.y, star.size, currentOpacity);
      });

      // Draw shooting stars occasionally
      if (Math.random() < 0.002) {
        const shootingX = Math.random() * canvas.width;
        const shootingY = Math.random() * canvas.height * 0.5;
        
        ctx.beginPath();
        ctx.moveTo(shootingX, shootingY);
        ctx.lineTo(shootingX + 80, shootingY + 40);
        const shootGradient = ctx.createLinearGradient(shootingX, shootingY, shootingX + 80, shootingY + 40);
        shootGradient.addColorStop(0, 'hsla(200, 100%, 90%, 0.8)');
        shootGradient.addColorStop(1, 'hsla(200, 100%, 90%, 0)');
        ctx.strokeStyle = shootGradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createStars();
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
