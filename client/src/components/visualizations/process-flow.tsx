import React from 'react';
import { motion } from 'framer-motion';
import { APP_NAME } from '@/utils/app-config';

export default function ProcessFlow() {
  // Definición de variantes para la animación
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  return (
    <div className="relative w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
      {/* Fondo con efecto de cuadrícula de blockchain */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-violet-900/5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.15) 1px, transparent 0)`,
          backgroundSize: `24px 24px`
        }}></div>
      </div>
      
      {/* Contenedor de la visualización de flujo */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="w-full max-w-5xl p-4">
          <div className="relative flex flex-col md:flex-row items-center justify-between">
            {/* Wallet del usuario */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center mb-12 md:mb-0"
            >
              <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-blue-500/20 to-blue-700/30 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                <svg className="w-16 h-16 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 10C3 8.11438 3 7.17157 3.58579 6.58579C4.17157 6 5.11438 6 7 6H17C18.8856 6 19.8284 6 20.4142 6.58579C21 7.17157 21 8.11438 21 10H3Z" fill="currentColor" fillOpacity="0.2"/>
                  <path d="M7 15H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M7 18H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M18 15.5C18 16.3284 17.3284 17 16.5 17C15.6716 17 15 16.3284 15 15.5C15 14.6716 15.6716 14 16.5 14C17.3284 14 18 14.6716 18 15.5Z" fill="currentColor" fillOpacity="0.2"/>
                </svg>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-lg mb-1">Wallet de Usuario</h4>
                <p className="text-sm text-muted-foreground w-24 md:w-40">Conexión segura de fondos</p>
              </div>
              
              {/* Línea de conexión - Solo visible en mobile */}
              <div className="h-10 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-600 my-2 md:hidden"></div>
            </motion.div>
            
            {/* Línea de conexión horizontal - Solo visible en desktop */}
            <div className="hidden md:block h-0.5 flex-1 mx-1 bg-gradient-to-r from-blue-500 to-indigo-600 self-start mt-16 max-w-20"></div>
            
            {/* NFT Position */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center mb-12 md:mb-0"
            >
              <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-indigo-500/20 to-indigo-700/30 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                <svg className="w-16 h-16 text-indigo-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 9C3 7.11438 3 6.17157 3.58579 5.58579C4.17157 5 5.11438 5 7 5H17C18.8856 5 19.8284 5 20.4142 5.58579C21 6.17157 21 7.11438 21 9H3Z" fill="currentColor" fillOpacity="0.2"/>
                  <path d="M12 12C10.3833 12 9.08333 10.5 9.5 9C9.91667 7.5 11.3833 7 12 7C12.6167 7 14.0833 7.5 14.5 9C14.9167 10.5 13.6167 12 12 12Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 19C6 15.5 12 15.5 12 19" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 19C12 15.5 18 15.5 18 19" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-lg mb-1">NFT de Posición</h4>
                <p className="text-sm text-muted-foreground w-24 md:w-40">Certificado digital de propiedad</p>
              </div>
              
              {/* Línea de conexión - Solo visible en mobile */}
              <div className="h-10 w-0.5 bg-gradient-to-b from-indigo-600 to-violet-600 my-2 md:hidden"></div>
            </motion.div>
            
            {/* Línea de conexión horizontal - Solo visible en desktop */}
            <div className="hidden md:block h-0.5 flex-1 mx-1 bg-gradient-to-r from-indigo-600 to-violet-600 self-start mt-16 max-w-20"></div>
            
            {/* Algoritmo {APP_NAME} */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center mb-12 md:mb-0"
            >
              <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-violet-500/20 to-violet-700/30 rounded-xl flex items-center justify-center mb-4 border border-violet-500/20 shadow-lg shadow-violet-500/10">
                <svg className="w-16 h-16 text-violet-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11L12 8L15 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 16.6C14.3 16.8 14.7 17 15 17C16.1 17 17 16.1 17 15C17 13.9 16.1 13 15 13C14.7 13 14.3 13.2 14 13.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 13.4C10.7 13.2 10.3 13 10 13C8.9 13 8 13.9 8 15C8 16.1 8.9 17 10 17C10.3 17 10.7 16.8 11 16.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" fillOpacity="0.2"/>
                </svg>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-lg mb-1">Algoritmo {APP_NAME}</h4>
                <p className="text-sm text-muted-foreground w-28 md:w-40">Optimización y rebalanceo automatizado</p>
              </div>
              
              {/* Línea de conexión - Solo visible en mobile */}
              <div className="h-10 w-0.5 bg-gradient-to-b from-violet-600 to-fuchsia-500 my-2 md:hidden"></div>
            </motion.div>
            
            {/* Línea de conexión horizontal - Solo visible en desktop */}
            <div className="hidden md:block h-0.5 flex-1 mx-1 bg-gradient-to-r from-violet-600 to-fuchsia-500 self-start mt-16 max-w-20"></div>
            
            {/* Pools de Liquidez */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-700/30 rounded-xl flex items-center justify-center mb-4 border border-fuchsia-500/20 shadow-lg shadow-fuchsia-500/10 relative">
                <svg className="w-16 h-16 text-fuchsia-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12L20 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12L4 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" fill="currentColor" fillOpacity="0.1"/>
                </svg>
                
                {/* Mini-pools que representan múltiples pools */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500/70 to-blue-700/70 rounded-md flex items-center justify-center border border-blue-300/30">
                  <div className="w-3 h-3 rounded-sm border border-blue-300/50"></div>
                </div>
                <div className="absolute top-0 -left-3 w-6 h-6 bg-gradient-to-br from-indigo-500/70 to-indigo-700/70 rounded-md flex items-center justify-center border border-indigo-300/30">
                  <div className="w-3 h-3 rounded-sm border border-indigo-300/50"></div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-violet-500/70 to-violet-700/70 rounded-md flex items-center justify-center border border-violet-300/30">
                  <div className="w-3 h-3 rounded-sm border border-violet-300/50"></div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-lg mb-1">Pools de Liquidez</h4>
                <p className="text-sm text-muted-foreground w-28 md:w-40">Múltiples pools para diversificar riesgo</p>
              </div>
            </motion.div>
          </div>
          
          {/* Flechas de conexión animadas */}
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 hidden md:block">
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="h-0.5 bg-gradient-to-r from-blue-500 via-indigo-600 to-fuchsia-500"
            ></motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}