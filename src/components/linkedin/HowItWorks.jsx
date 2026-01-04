import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Brain, Award } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            icon: Upload,
            title: "Envie seus dados",
            description: "Faça upload do seu currículo e informe seu cargo alvo",
            color: "from-[#6DB4C8] to-[#A8C940]"
        },
        {
            icon: Brain,
            title: "Análise Inteligente",
            description: "Nossa IA especializada analisa seu perfil, identifica pontos fortes e ajuda você a contar sua melhor história profissional",
            color: "from-[#A8C940] to-[#C4405B]"
        },
        {
            icon: Award,
            title: "Receba suas Recomendações",
            description: "Obtenha diagnóstico completo, sugestões de headline otimizadas, palavras-chave estratégicas e muito mais",
            color: "from-[#C4405B] to-[#8B3A62]"
        }
    ];

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
                        Como Funciona?
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                        Em apenas 3 passos simples, transforme seu perfil LinkedIn em uma ferramenta poderosa de atração de oportunidades
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <Card key={index} className="relative border-2 hover:shadow-xl transition-all duration-300">
                                <CardContent className="pt-12 pb-6 sm:pb-8 px-4 sm:px-6 text-center">
                                    {/* Step Number */}
                                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-white px-3 sm:px-4 py-1 rounded-full border-2 border-gray-200 text-xs sm:text-sm font-bold text-gray-600 whitespace-nowrap">
                                            Passo {index + 1}
                                        </div>
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                                        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}