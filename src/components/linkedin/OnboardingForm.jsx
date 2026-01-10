import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2, Sparkles, Info } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function OnboardingForm({ onAnalysisComplete, onAnalysisStart, isAnalyzing }) {
    const [formData, setFormData] = useState({
        cargoAlvo: "",
        areaAtuacao: "",
        vagaLink: ""
    });
    const [cvFile, setCvFile] = useState(null);
    const [error, setError] = useState("");

    const areasAtuacao = [
        "Pesquisa Clínica",
        "Farmacovigilância",
        "Medical Affairs",
        "P&D / Desenvolvimento de Produtos",
        "Medical Science Liaison"
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                setError("Por favor, envie um arquivo PDF ou Word (.doc/.docx)");
                setCvFile(null);
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError("O arquivo deve ter no máximo 10MB");
                setCvFile(null);
                return;
            }
            setCvFile(file);
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validações
        if (!cvFile) {
            setError("Por favor, faça upload do seu currículo");
            return;
        }
        if (!formData.cargoAlvo.trim()) {
            setError("Por favor, informe seu cargo alvo");
            return;
        }
        if (!formData.areaAtuacao) {
            setError("Por favor, selecione sua área de atuação");
            return;
        }

        onAnalysisStart();
        
        // Pequeno delay
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const toBase64 = file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });

            const fileBase64 = await toBase64(cvFile);

            // Chamar a função de backend (PÚBLICA)
            // Agora esperamos um objeto { success, data, error } com status 200
            const response = await base44.functions.invoke('analyzeResume', {
                file_data: fileBase64,
                filename: cvFile.name,
                cargoAlvo: formData.cargoAlvo,
                areaAtuacao: formData.areaAtuacao
            });

            // O SDK retorna { data: { success: ..., data: ... }, status: 200 }
            const responseData = response.data;

            if (!responseData.success) {
                throw new Error(responseData.error || "Erro desconhecido no servidor");
            }

            onAnalysisComplete(responseData.data, formData);

        } catch (err) {
            console.error('Erro na análise:', err);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setError(err.message || "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.");
            onAnalysisComplete(null);
        }
    };

    return (
        <section id="onboarding-form" className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="shadow-2xl border-2 border-purple-200">
                    <CardHeader className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 border-b border-purple-100 p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="bg-gradient-to-br from-[#C4405B] to-[#8B3A62] p-2 sm:p-3 rounded-xl shadow-lg flex-shrink-0">
                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg sm:text-xl lg:text-2xl text-gray-900">
                                    Olá! Sou o LinkedIn Strategist AI 👋
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base mt-2 text-gray-700">
                                    Sou seu consultor sênior de carreira e especialista no algoritmo do LinkedIn. 
                                    Minha missão é transformar seu perfil em uma ferramenta magnética de atração de oportunidades no mercado farmacêutico.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6">
                        <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <p className="font-semibold text-blue-900 mb-1">
                                        Para começar, preciso dos seguintes dados:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li>Seu currículo em PDF ou Word</li>
                                        <li>O cargo que você deseja conquistar</li>
                                        <li>Sua área de atuação no mercado farmacêutico</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Upload CV */}
                            <div className="space-y-2">
                                <Label htmlFor="cv-upload" className="text-base font-semibold text-gray-800">
                                    1. Upload do Currículo *
                                </Label>
                                <label 
                                    htmlFor="cv-upload"
                                    className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 hover:bg-purple-50/30 transition-all cursor-pointer"
                                >
                                    <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                                    <Input
                                        id="cv-upload"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <span className="text-purple-600 hover:text-purple-700 font-semibold">
                                        Clique para fazer upload do seu currículo
                                    </span>
                                    <p className="text-sm text-gray-500 mt-2">
                                        PDF ou Word (máx. 10MB)
                                    </p>
                                    {cvFile && (
                                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="text-sm text-green-800 font-medium">
                                                ✓ {cvFile.name}
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Cargo Alvo */}
                            <div className="space-y-2">
                                <Label htmlFor="cargo-alvo" className="text-base font-semibold text-gray-800">
                                    2. Cargo Alvo *
                                </Label>
                                <Input
                                    id="cargo-alvo"
                                    placeholder="Ex: Coordenador de Pesquisa Clínica"
                                    value={formData.cargoAlvo}
                                    onChange={(e) => setFormData({...formData, cargoAlvo: e.target.value})}
                                    className="text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                />
                            </div>

                            {/* Área de Atuação */}
                            <div className="space-y-2">
                                <Label htmlFor="area-atuacao" className="text-base font-semibold text-gray-800">
                                    3. Área de Atuação no Mercado Farmacêutico *
                                </Label>
                                <Select 
                                    value={formData.areaAtuacao} 
                                    onValueChange={(value) => setFormData({...formData, areaAtuacao: value})}
                                >
                                    <SelectTrigger className="text-base">
                                        <SelectValue placeholder="Selecione sua área" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {areasAtuacao.map((area) => (
                                            <SelectItem key={area} value={area}>
                                                {area}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Submit Button */}
                            <Button 
                                type="submit" 
                                size="lg"
                                disabled={isAnalyzing}
                                className="w-full bg-gradient-to-r from-[#C4405B] via-[#8B3A62] to-[#6B2D52] hover:from-[#A8354E] hover:to-[#5A2644] text-lg py-7 font-semibold shadow-xl hover:shadow-2xl transition-all"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        <span className="whitespace-normal text-center">
                                            Estamos avaliando o seu currículo...
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Analisar Meu Perfil Agora
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}