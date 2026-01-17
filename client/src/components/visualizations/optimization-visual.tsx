import React from 'react';
import { motion } from 'framer-motion';

export default function OptimizationVisual() {
  // Animación para simular el rebalanceo algorítmico
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="relative w-full h-[280px] md:h-[320px] rounded-xl overflow-hidden bg-gradient-to-b from-blue-900/5 to-violet-900/5 border border-primary/10">
      {/* Fondo con patrón de cuadrícula */}
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.1) 1px, transparent 0)`,
        backgroundSize: `24px 24px`
      }}></div>
      
      {/* Líneas de conexión */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
          {/* Líneas dinámicas conectando los pools */}
          <motion.path 
            d="M200,40 C140,100 100,180 60,220" 
            stroke="url(#gradient1)" 
            strokeWidth="1.5" 
            fill="none" 
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <motion.path 
            d="M200,40 C260,100 300,180 340,220" 
            stroke="url(#gradient2)" 
            strokeWidth="1.5" 
            fill="none" 
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <motion.path 
            d="M200,40 C190,120 210,160 200,220" 
            stroke="url(#gradient3)" 
            strokeWidth="1.5" 
            fill="none" 
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          
          <motion.path 
            d="M60,220 C100,200 140,195 200,190" 
            stroke="url(#gradient1)" 
            strokeWidth="1" 
            fill="none" 
            strokeDasharray="4,4"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
          />
          <motion.path 
            d="M340,220 C300,200 260,195 200,190" 
            stroke="url(#gradient2)" 
            strokeWidth="1" 
            fill="none" 
            strokeDasharray="4,4"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.7 }}
          />
          
          {/* Definición de gradientes para las líneas */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6384e8" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bd7aff" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Nodo central - Algoritmo */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
        className="absolute top-[40px] left-1/2 transform -translate-x-1/2"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-600/80 to-violet-700/80 rounded-full border border-indigo-300/30 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
            <path d="M12 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16 12H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="text-center mt-2 font-semibold text-sm text-indigo-600 dark:text-indigo-300">Algoritmo WayBank</div>
      </motion.div>
      
      {/* Nodos inferiores - Pools */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute bottom-[40px] left-[15%] transform -translate-x-1/2"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/60 to-blue-700/60 rounded-lg border border-blue-300/30 shadow-lg shadow-blue-500/20 flex items-center justify-center">
          <div className="text-white font-bold text-sm">ETH/USDC</div>
        </div>
        <div className="text-center mt-1 font-medium text-xs text-blue-600 dark:text-blue-300">35% Asignado</div>
      </motion.div>
      
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500/60 to-violet-700/60 rounded-lg border border-violet-300/30 shadow-lg shadow-violet-500/20 flex items-center justify-center">
          <div className="text-white font-bold text-sm">BTC/ETH</div>
        </div>
        <div className="text-center mt-1 font-medium text-xs text-violet-600 dark:text-violet-300">25% Asignado</div>
      </motion.div>
      
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute bottom-[40px] left-[85%] transform -translate-x-1/2"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/60 to-indigo-700/60 rounded-lg border border-indigo-300/30 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
          <div className="text-white font-bold text-sm">ETH/USDT</div>
        </div>
        <div className="text-center mt-1 font-medium text-xs text-indigo-600 dark:text-indigo-300">20% Asignado</div>
      </motion.div>
      
      {/* Partículas de flujo (tokens) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-2 h-2 rounded-full bg-blue-500"
          initial={{ x: "50%", y: "15%" }}
          animate={{ x: "15%", y: "75%" }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "loop", 
            repeatDelay: 1,
            delay: 0.5
          }}
        />
        
        <motion.div 
          className="absolute w-2 h-2 rounded-full bg-violet-500"
          initial={{ x: "50%", y: "15%" }}
          animate={{ x: "50%", y: "75%" }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "loop", 
            repeatDelay: 0.8,
            delay: 0.2
          }}
        />
        
        <motion.div 
          className="absolute w-2 h-2 rounded-full bg-indigo-500"
          initial={{ x: "50%", y: "15%" }}
          animate={{ x: "85%", y: "75%" }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "loop", 
            repeatDelay: 1.2,
            delay: 0.7
          }}
        />
        
        <motion.div 
          className="absolute w-2 h-2 rounded-full bg-blue-400"
          initial={{ x: "15%", y: "75%" }}
          animate={{ x: "50%", y: "62%" }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatType: "loop", 
            repeatDelay: 2,
            delay: 3
          }}
        />
        
        <motion.div 
          className="absolute w-2 h-2 rounded-full bg-indigo-400"
          initial={{ x: "85%", y: "75%" }}
          animate={{ x: "50%", y: "62%" }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatType: "loop", 
            repeatDelay: 2.5,
            delay: 3.5
          }}
        />
      </div>
    </div>
  );
}