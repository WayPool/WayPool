import { useEffect, useRef } from "react";

interface BlockchainSceneProps {
  className?: string;
}

export function BlockchainScene({ className = "" }: BlockchainSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Obtener colores del tema actual
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue("--primary").trim() || "0, 100, 200";
    const backgroundColor = document.documentElement.classList.contains("dark") 
      ? "10, 10, 20" 
      : "245, 245, 255";
    
    // Asegurar que el canvas tenga el tamaño correcto
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        const scale = window.devicePixelRatio || 1;
        canvas.width = width * scale;
        canvas.height = height * scale;
        ctx.scale(scale, scale);
      }
    };
    
    // Clase para los bloques
    class Block {
      x: number;
      y: number;
      size: number;
      angle: number;
      speed: number;
      color: string;
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = 20 + Math.random() * 15;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 0.2 + Math.random() * 0.3;
        this.color = `rgba(${primaryColor}, ${0.2 + Math.random() * 0.3})`;
      }
      
      update() {
        this.angle += this.speed * 0.01;
        this.x += Math.cos(this.angle) * 0.2;
        this.y += Math.sin(this.angle) * 0.2;
        
        // Mantener dentro del canvas
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Dibujar hexágono (representando un bloque)
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = this.size * Math.cos(angle);
          const y = this.size * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Dibujar borde
        ctx.strokeStyle = `rgba(${primaryColor}, 0.6)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Dibujar detalle interno
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const angle = (Math.PI / 3) * i * 2;
          const x = this.size * 0.6 * Math.cos(angle);
          const y = this.size * 0.6 * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(${primaryColor}, 0.4)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        ctx.restore();
      }
    }
    
    // Clase para las conexiones
    class Connection {
      source: Block;
      target: Block;
      opacity: number;
      
      constructor(source: Block, target: Block) {
        this.source = source;
        this.target = target;
        this.opacity = 0.1 + Math.random() * 0.2;
      }
      
      draw() {
        if (!ctx) return;
        
        const dx = this.target.x - this.source.x;
        const dy = this.target.y - this.source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Solo dibujar si están lo suficientemente cerca
        if (distance < 150) {
          const opacity = this.opacity * (1 - distance / 150);
          ctx.beginPath();
          ctx.moveTo(this.source.x, this.source.y);
          ctx.lineTo(this.target.x, this.target.y);
          ctx.strokeStyle = `rgba(${primaryColor}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    
    // Inicializar bloques
    const createBlocks = () => {
      const numBlocks = Math.min(20, Math.floor(canvas.width * canvas.height / 20000));
      const blocks: Block[] = [];
      
      for (let i = 0; i < numBlocks; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        blocks.push(new Block(x, y));
      }
      
      return blocks;
    };
    
    // Inicializar conexiones
    const createConnections = (blocks: Block[]) => {
      const connections: Connection[] = [];
      
      for (let i = 0; i < blocks.length; i++) {
        for (let j = i + 1; j < blocks.length; j++) {
          connections.push(new Connection(blocks[i], blocks[j]));
        }
      }
      
      return connections;
    };
    
    // Escuchar cambios de tamaño
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    // Crear bloques y conexiones
    const blocks = createBlocks();
    const connections = createConnections(blocks);
    
    // Loop de animación
    let animationId: number;
    const animate = () => {
      if (!ctx) return;
      
      // Limpiar canvas
      ctx.fillStyle = `rgba(${backgroundColor}, 0.05)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Actualizar y dibujar conexiones
      for (const connection of connections) {
        connection.draw();
      }
      
      // Actualizar y dibujar bloques
      for (const block of blocks) {
        block.update();
        block.draw();
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Limpieza
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}