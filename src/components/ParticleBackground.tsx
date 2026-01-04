import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

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
      // Create many small detailed stars
      const count = Math.min(400, Math.floor((window.innerWidth * window.innerHeight) / 3000));
      
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 3 + 1, // Depth for parallax (1-4)
          size: Math.random() * 1.2 + 0.3, // Small stars 0.3-1.5px
          baseOpacity: Math.random() * 0.6 + 0.3,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
      starsRef.current = stars;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX - window.innerWidth / 2) / window.innerWidth,
        y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
      };
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
        // Rare tiffany-colored star with subtle glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
        gradient.addColorStop(0, `hsla(174, 72%, 70%, ${opacity})`);
        gradient.addColorStop(0.5, `hsla(174, 72%, 56%, ${opacity * 0.3})`);
        gradient.addColorStop(1, `hsla(174, 72%, 56%, 0)`);
        
        ctx.beginPath();
        ctx.arc(x, y, size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      // White star core
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = isTiffany 
        ? `hsla(174, 50%, 90%, ${opacity})` 
        : `hsla(0, 0%, 100%, ${opacity})`;
      ctx.fill();
      
      // Subtle cross flare for larger stars
      if (size > 0.8) {
        ctx.strokeStyle = `hsla(0, 0%, 100%, ${opacity * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x - size * 2, y);
        ctx.lineTo(x + size * 2, y);
        ctx.moveTo(x, y - size * 2);
        ctx.lineTo(x, y + size * 2);
        ctx.stroke();
      }
    };

    const animate = () => {
      timeRef.current += 0.016;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Parallax offset based on mouse
      const parallaxX = mouseRef.current.x * 20;
      const parallaxY = mouseRef.current.y * 20;

      starsRef.current.forEach((star, index) => {
        // Parallax effect - deeper stars move less
        const depthFactor = star.z / 4;
        const offsetX = parallaxX * depthFactor;
        const offsetY = parallaxY * depthFactor;
        
        let drawX = star.x + offsetX;
        let drawY = star.y + offsetY;
        
        // Wrap around screen edges
        if (drawX < 0) drawX += canvas.width;
        if (drawX > canvas.width) drawX -= canvas.width;
        if (drawY < 0) drawY += canvas.height;
        if (drawY > canvas.height) drawY -= canvas.height;

        // Twinkle effect
        const twinkle = Math.sin(timeRef.current * star.twinkleSpeed * 100 + star.twinklePhase);
        const currentOpacity = star.baseOpacity * (0.5 + 0.5 * twinkle);
        
        // Size varies with depth (closer = bigger)
        const sizeWithDepth = star.size * (0.5 + star.z * 0.25);

        // Only ~3% of stars get tiffany color (very rare accent)
        const isTiffany = index % 35 === 0;
        
        drawStar(ctx, drawX, drawY, sizeWithDepth, currentOpacity, isTiffany);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createStars();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createStars();
    });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
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
