import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const nodes: Node[] = [];
    // Reduce density on smaller mobile screens for performance and layout breathing room
    const isMobile = width < 768;
    const nodeCount = isMobile ? 30 : 75;
    const connectionDistance = isMobile ? 80 : 120;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15, // Extremely slow drift
        vy: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 1.5 + 0.5
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Check active theme state from html class
      const isLight = document.documentElement.classList.contains('light');
      
      // Pause heavy computation if invisible (in light mode) to improve mobile performance
      if (isLight) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const dotColor = 'rgba(245, 245, 245, 0.05)';
      const lineColor = (a: number) => `rgba(245, 245, 245, ${a})`;
      const pulseColor = 'rgba(79, 140, 255, 0.1)';

      // Draw faint connections
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        
        // Update position
        nodeA.x += nodeA.vx;
        nodeA.y += nodeA.vy;

        // Bounce off bounds slightly
        if (nodeA.x < 0 || nodeA.x > width) nodeA.vx *= -1;
        if (nodeA.y < 0 || nodeA.y > height) nodeA.vy *= -1;

        // Failsafe bounds check
        if (nodeA.x < 0) nodeA.x = 0;
        if (nodeA.x > width) nodeA.x = width;
        if (nodeA.y < 0) nodeA.y = 0;
        if (nodeA.y > height) nodeA.y = height;

        // Draw node dot
        ctx.beginPath();
        ctx.arc(nodeA.x, nodeA.y, nodeA.radius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            // Draw connection line
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            
            // Map alpha to distance (closer = brighter, max opacity very low to remain subtle)
            const alpha = (1 - dist / connectionDistance) * 0.04;
            
            // Faint network line color
            ctx.strokeStyle = lineColor(alpha);
            
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Accent pulses (very rare connecting pulses)
            if (dist < 40 && Math.random() < 0.0001) {
              ctx.beginPath();
              ctx.moveTo(nodeA.x, nodeA.y);
              ctx.lineTo(nodeB.x, nodeB.y);
              ctx.strokeStyle = pulseColor;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      // Rescale coordinates for nodes
      nodes.forEach((node) => {
        if (node.x > width) node.x = Math.random() * width;
        if (node.y > height) node.y = Math.random() * height;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};
