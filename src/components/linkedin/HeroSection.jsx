import React from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { trackCTA } from "@/lib/tracker";

export default function HeroSection() {
  const scrollToForm = () => {
    trackCTA("hero_cta_primary", "hero");
    document.getElementById('onboarding-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#8B3A62] via-[#6B2D52] to-[#4A1F3D] text-white">
            {/* Animated Gradient Orbs */}
            <div className="absolute inset-0">
                <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-96 h-96 bg-[#C4405B] rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

                <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-0 right-0 w-96 h-96 bg-[#A8C940] rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

                <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 40, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#6DB4C8] rounded-full mix-blend-multiply filter blur-3xl opacity-25" />

            </div>
            
            {/* Abstract Geometric Shapes */}
            <div className="absolute inset-0 opacity-10">
                <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-32 h-32 border-4 border-white rounded-lg" />

                <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-24 h-24 border-4 border-white rounded-full" />

                <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-10 w-16 h-16 bg-white opacity-20 rounded-lg" />

            </div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-32">
                <div className="flex items-center justify-center">
                    {/* Center Content */}
                    <div className="text-center max-w-4xl">
                        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>

                            <h1 className="text-slate-50 mb-4 px-2 text-2xl font-extrabold tracking-tight leading-tight sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">Desvende seu Potencial no Mercado Farmacêutico




              </h1>
                        </motion.div>

                        <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }} className="text-white/95 mb-6 sm:mb-8 md:mb-10 mx-auto text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium leading-relaxed max-w-3xl px-4">Transforme seu perfil comum em uma ferramenta magnética de atração de oportunidades no mercado farmacêutico



            </motion.p>
                        
                        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 md:mb-10 px-4">

                            <Button
                size="lg"
                onClick={scrollToForm}
                className="bg-white text-[#C4405B] hover:bg-[#A8C940] hover:text-white hover:scale-105 text-sm sm:text-base md:text-lg lg:text-xl px-6 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8 shadow-2xl hover:shadow-3xl transition-all duration-300 font-bold rounded-xl group w-full sm:w-auto">

                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 group-hover:rotate-12 transition-transform" />
                                Comece sua Análise Gratuita Agora
                            </Button>
                        </motion.div>

                        <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-8 justify-center text-xs sm:text-sm flex-wrap px-4">

                            <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full">

                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#A8C940] flex-shrink-0" />
                                <span className="font-medium whitespace-nowrap text-xs sm:text-sm">100% Gratuito</span>
                            </motion.div>
                            <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full">

                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#A8C940] flex-shrink-0" />
                                <span className="font-medium whitespace-nowrap text-xs sm:text-sm">Resultados em Minutos</span>
                            </motion.div>
                            <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full">

                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#A8C940] flex-shrink-0" />
                                <span className="font-medium whitespace-nowrap text-xs sm:text-sm">IA Especializada</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>);

}