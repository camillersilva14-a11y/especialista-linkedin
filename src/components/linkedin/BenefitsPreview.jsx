import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Target, Lightbulb, Key } from "lucide-react";

export default function BenefitsPreview() {
    const benefits = [
        {
            icon: TrendingUp,
            title: "Diagnóstico do Perfil Atual",
            description: "Avaliação completa com nota de 0 a 100 e explicação detalhada dos pontos de melhoria.",
            gradient: "from-[#6DB4C8] to-[#A8C940]"
        },
        {
            icon: Target,
            title: "Sugestões de Headline Otimizada",
            description: "3 opções de títulos estratégicos otimizados para SEO e atração de recrutadores.",
            gradient: "from-[#A8C940] to-[#C4405B]"
        },
        {
            icon: Key,
            title: "Palavras-Chave Estratégicas Personalizadas",
            description: "Top 10 palavras-chave para seu cargo específico, Hard Skills diferenciadoras e Soft Skills valorizadas, com análise de gaps.",
            gradient: "from-[#C4405B] to-[#8B3A62]"
        },
        {
            icon: Lightbulb,
            title: "Dica de Ouro",
            description: "Ação de engajamento imediato para começar a atrair atenção no LinkedIn hoje mesmo.",
            gradient: "from-[#8B3A62] to-[#6DB4C8]"
        }
    ];

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
                        O que Você Receberá
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                        Uma análise completa e personalizada do seu perfil LinkedIn com recomendações práticas
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
                                <CardHeader className="pb-3 sm:pb-4">
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-3 sm:mb-4`}>
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-base sm:text-lg">
                                        {benefit.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-8 sm:mt-12 text-center px-4">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span>Tudo isso de forma 100% gratuita e em poucos minutos!</span>
                    </div>
                </div>
            </div>
        </section>
    );
}