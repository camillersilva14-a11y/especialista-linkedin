import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
// Dialog removed to use custom overlay
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import HeroSection from "../components/linkedin/HeroSection";
import HowItWorks from "../components/linkedin/HowItWorks";
import OnboardingForm from "../components/linkedin/OnboardingForm";
import BenefitsPreview from "../components/linkedin/BenefitsPreview";
import ResultsDisplay from "../components/linkedin/ResultsDisplay";

export default function LinkedInOptimizer() {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [userData, setUserData] = useState({ cargoAlvo: "", areaAtuacao: "" });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisComplete = (results, data) => {
    setAnalysisResults(results);
    if (data) setUserData(data);
    setIsAnalyzing(false);

    // Track profile view completion
    if (results) {
      base44.analytics.track({
        eventName: "profile_view_completed",
        properties: {
          cargo_alvo: data?.cargoAlvo,
          area_atuacao: data?.areaAtuacao
        }
      });

      // Scroll suave até os resultados
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  useEffect(() => {
    // Check for pending results from before login - using localStorage
    const pendingResults = localStorage.getItem('pendingAnalysisResults');
    const pendingData = localStorage.getItem('pendingUserData');

    if (pendingResults && pendingData) {
      try {
        setAnalysisResults(JSON.parse(pendingResults));
        setUserData(JSON.parse(pendingData));
        
        // Clear storage
        localStorage.removeItem('pendingAnalysisResults');
        localStorage.removeItem('pendingUserData');

        // Scroll to results
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 500);
      } catch (e) {
        console.error("Error restoring pending analysis:", e);
      }
    }
  }, []);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695a67f18e890bdc64a3e245/3f4cacd4a_logo-final-curva-sem-fundo-01002.png"
                alt="Portal Saúde em Contexto"
                className="h-12 w-auto" />

                            <div>
                                <p className="text-gray-600 text-sm font-semibold">LinkedIn Irresistível para o Mercado Farmacêutico

                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <HeroSection />

            {/* How It Works */}
            <HowItWorks />

            {/* Benefits Preview */}
            <BenefitsPreview />

            {/* Onboarding Form */}
            <OnboardingForm
        onAnalysisComplete={handleAnalysisComplete}
        onAnalysisStart={handleAnalysisStart}
        isAnalyzing={isAnalyzing} />


            {/* Results Display */}
            {analysisResults &&
      <div id="results-section">
                    <ResultsDisplay 
                        results={analysisResults} 
                        cargoAlvo={userData.cargoAlvo}
                        areaAtuacao={userData.areaAtuacao}
                    />
                </div>
      }

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-20">
                <div className="mx-auto px-4 py-12 max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">
                                Portal Saúde em Contexto
                            </h3>
                            <p className="text-slate-50 text-sm">Transformando carreiras no mercado farmacêutico através de tecnologia e inteligência artificial.

              </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contato</h3>
                            <p className="text-slate-50 text-sm">contato@saudememcontexto.com.br

              </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Privacidade</h3>
                            <p className="text-slate-50 text-sm">Seus dados são processados de forma segura e não são armazenados permanentemente.

              </p>
                        </div>
                    </div>
                    <div className="text-slate-50 mt-8 pt-8 text-sm text-center">
                        © 2025 Portal Saúde em Contexto. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
            {/* Analysis Loading Popup - Portal to Body */}
            {isAnalyzing && createPortal(
                <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300 relative z-50">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full shadow-inner">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">
                                Estamos avaliando o seu currículo
                            </h3>
                            <p className="text-base text-gray-600">
                                Nossa IA está lendo seu perfil e preparando recomendações estratégicas para o mercado farmacêutico.
                            </p>
                            <div className="bg-blue-50 text-blue-800 text-sm py-2 px-4 rounded-full font-medium mt-2">
                                Isso leva apenas alguns segundos...
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>);

}