import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Copy, TrendingUp, Lightbulb, Key, FileText, Award, Info, Printer, Lock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import FeedbackForm from "./FeedbackForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function ResultsDisplay({ results, cargoAlvo, areaAtuacao }) {
    const [copiedSection, setCopiedSection] = useState(null);
    const [hasRated, setHasRated] = useState(false);
    // Feedback logic removed as per request to remove obligatoriness
    const [showFeedbackModal, setShowFeedbackModal] = useState(false); // Kept state to minimize changes impact if referenced elsewhere, though effectively unused for blocking now.

    // Contact info collection state
    const [showContactModal, setShowContactModal] = useState(false);
    const [whatsappInput, setWhatsappInput] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [pendingAction, setPendingAction] = useState(null);
    const [isSavingUser, setIsSavingUser] = useState(false);

    const copyToClipboard = (text, section) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
    };

    const handleProtectedAction = async (action) => {
        try {
            const isAuthenticated = await base44.auth.isAuthenticated();
            setPendingAction(() => action);
            
            if (isAuthenticated) {
                try {
                    const user = await base44.auth.me();
                    // Pre-fill data if available
                    setNameInput(user.full_name || "");
                    setWhatsappInput(user.whatsapp || "");
                    setEmailInput(user.email || "");
                    
                    // If everything is present, we might want to skip modal?
                    // But requirement says "collect data", maybe verify?
                    // Let's check if fields are missing or empty
                    if (!user.full_name || !user.whatsapp || !user.email) {
                        setShowContactModal(true);
                    } else {
                        // All info present, ensure lead created and proceed
                        await base44.functions.invoke('createLead', {
                            full_name: user.full_name,
                            email: user.email,
                            whatsapp: user.whatsapp
                        });
                        action();
                    }
                } catch (e) {
                    setShowContactModal(true);
                }
            } else {
                // Unauthenticated - show modal to collect data
                setShowContactModal(true);
            }
        } catch (err) {
            console.error("Error in protected action handler:", err);
            setShowContactModal(true);
        }
    };

    const handleSaveContactInfo = async () => {
        if (!whatsappInput.trim() || !nameInput.trim() || !emailInput.trim()) return;
        
        setIsSavingUser(true);
        try {
            // Try to update user profile if authenticated
            try {
                const isAuthenticated = await base44.auth.isAuthenticated();
                if (isAuthenticated) {
                    await base44.auth.updateMe({ 
                        whatsapp: whatsappInput,
                        full_name: nameInput
                        // Email usually cannot be updated via updateMe directly if it's the auth identifier, but we collect it for the lead
                    });
                }
            } catch (e) {
                // Ignore auth update errors (e.g. not logged in)
            }

            // Create lead in backend
            try {
                await base44.functions.invoke('createLead', {
                    full_name: nameInput,
                    email: emailInput,
                    whatsapp: whatsappInput
                });
            } catch (e) {
                console.error("Error creating lead", e);
            }

            setShowContactModal(false);
            
            if (pendingAction) {
                pendingAction();
                setPendingAction(null);
            }

        } catch (error) {
            console.error("Error saving contact info", error);
        } finally {
            setIsSavingUser(false);
        }
    };

    const downloadAsWord = () => {
        const content = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset="utf-8">
                <title>Análise de Perfil LinkedIn</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
                    h2 { color: #4b5563; margin-top: 30px; }
                    h3 { color: #1f2937; margin-top: 20px; }
                    .highlight { background-color: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 5px solid #2563eb; }
                    ul { margin-bottom: 15px; }
                    li { margin-bottom: 5px; }
                </style>
            </head>
            <body>
                <h1>Relatório de Otimização de Perfil LinkedIn</h1>
                <p><strong>Cargo Alvo:</strong> ${cargoAlvo}</p>
                <p><strong>Área:</strong> ${areaAtuacao}</p>
                <p><strong>Data:</strong> ${new Date().toLocaleDateString()}</p>
                <hr/>
                
                <h2>📊 Diagnóstico do Perfil Atual</h2>
                <p><strong>Nota:</strong> ${results.diagnostico?.nota || 0}/100</p>
                <div>${results.diagnostico?.explicacao ? results.diagnostico.explicacao.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') : ''}</div>
                
                ${results.diagnostico?.checklistVisual ? `
                <h3>Checklist Visual</h3>
                <div>${results.diagnostico.checklistVisual.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}</div>
                ` : ''}

                <h2>🎯 Sugestões de Headline</h2>
                <ul>
                    ${results.headlines?.map(h => `<li>${h}</li>`).join('') || ''}
                </ul>

                <h2>✍️ Reescrita da Seção "Sobre"</h2>
                <div class="highlight">
                    ${results.sobre ? results.sobre.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') : ''}
                </div>

                <h2>🚀 Otimização de Experiência</h2>
                <div>${results.experiencia ? results.experiencia.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') : ''}</div>

                <h2>🔑 Palavras-Chave Estratégicas</h2>
                
                <h3>Top Keywords</h3>
                <ul>
                    ${results.palavrasChave?.topKeywords?.map(k => `<li><strong>${k.keyword}:</strong> ${k.relevancia}</li>`).join('') || ''}
                </ul>

                <h3>Hard Skills</h3>
                <ul>
                    ${results.palavrasChave?.hardSkills?.map(s => `<li><strong>${s.skill}:</strong> ${s.justificativa}</li>`).join('') || ''}
                </ul>

                <h3>Soft Skills</h3>
                <ul>
                    ${results.palavrasChave?.softSkills?.map(s => `<li><strong>${s.skill}:</strong> ${s.justificativa}</li>`).join('') || ''}
                </ul>

                ${results.palavrasChave?.gaps?.length ? `
                <h3>Oportunidades de Desenvolvimento (Gaps)</h3>
                <ul>
                    ${results.palavrasChave.gaps.map(g => `<li>${g}</li>`).join('')}
                </ul>
                ` : ''}

                <h2>💡 Dica de Ouro</h2>
                <div class="highlight" style="border-left-color: #f59e0b;">
                    ${results.dicaOuro ? results.dicaOuro.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') : ''}
                </div>
            </body>
            </html>
        `;

        const blob = new Blob(['\ufeff', content], {
            type: 'application/msword'
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Analise_LinkedIn_${cargoAlvo.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!results) return null;

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 print:bg-white print:py-0">
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #results-section, #results-section * {
                        visibility: visible;
                    }
                    #results-section {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Banner */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-3 bg-green-100 text-green-800 px-6 py-4 rounded-2xl shadow-lg">
                        <CheckCircle2 className="w-6 h-6" />
                        <span className="text-lg font-semibold">
                            Análise Concluída com Sucesso! 🎉
                        </span>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Diagnóstico do Perfil Atual */}
                    <Card className="shadow-xl border-2 border-blue-100">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-2xl">📊 Diagnóstico do Perfil Atual</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-5xl font-bold text-blue-600">
                                        {results.diagnostico?.nota || "N/A"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div 
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all duration-500"
                                                style={{ width: `${results.diagnostico?.nota || 0}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">Pontuação do seu perfil atual</p>
                                    </div>
                                </div>
                            </div>
                            <div className="prose max-w-none">
                                <ReactMarkdown>{results.diagnostico?.explicacao || ""}</ReactMarkdown>
                            </div>

                            {/* Checklist Visual */}
                            {results.diagnostico?.checklistVisual && (
                                <Alert className="mt-6 bg-yellow-50 border-yellow-200">
                                    <Info className="h-4 w-4 text-yellow-600" />
                                    <AlertDescription>
                                        <div className="prose max-w-none text-sm">
                                            <ReactMarkdown>{results.diagnostico.checklistVisual}</ReactMarkdown>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    {/* Sugestões de Headline */}
                    <Card className="shadow-xl border-2 border-purple-100">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg">
                                        <Award className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl">🎯 Sugestões de Headline Otimizado</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {results.headlines?.map((headline, index) => (
                                    <div key={index} className="relative group">
                                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="secondary">Opção {index + 1}</Badge>
                                                    </div>
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {headline}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(headline, `headline-${index}`)}
                                                    className="flex-shrink-0"
                                                >
                                                    {copiedSection === `headline-${index}` ? (
                                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reescrita da Seção "Sobre" */}
                    <Card className="shadow-xl border-2 border-indigo-100">
                        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-2 rounded-lg">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl">✍️ Reescrita da Seção "Sobre"</CardTitle>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => copyToClipboard(results.sobre || "", 'sobre')}
                                >
                                    {copiedSection === 'sobre' ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                                            Copiado!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copiar Texto
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="prose max-w-none bg-white p-6 rounded-lg border">
                                <ReactMarkdown>{results.sobre || ""}</ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Otimização de Experiência */}
                    <Card className="shadow-xl border-2 border-green-100">
                        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-2xl">🚀 Otimização de Experiência (Amostra)</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="prose max-w-none">
                                <ReactMarkdown>{results.experiencia || ""}</ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Palavras-Chave Estratégicas */}
                    <Card className="shadow-xl border-2 border-orange-100">
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-orange-600 to-red-600 p-2 rounded-lg">
                                    <Key className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-2xl">🔑 Palavras-Chave Estratégicas Personalizadas</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-8">
                                {/* Top Keywords */}
                                {results.palavrasChave?.topKeywords && results.palavrasChave.topKeywords.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                            Top 10 Palavras-Chave para seu Cargo Alvo
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Estas são as palavras-chave mais buscadas por recrutadores para seu cargo específico. Inclua-as no seu perfil!
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {results.palavrasChave.topKeywords.map((item, index) => (
                                                <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 mb-1">{item.keyword}</p>
                                                            <p className="text-xs text-gray-600">{item.relevancia}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Hard Skills */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        Hard Skills Diferenciadoras
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Competências técnicas essenciais que diferenciam profissionais de destaque no seu cargo.
                                    </p>
                                    <div className="space-y-3">
                                        {results.palavrasChave?.hardSkills?.map((item, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg border-2 border-red-100 hover:border-red-300 transition-all">
                                                <div className="flex items-start gap-3">
                                                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white flex-shrink-0">
                                                        {item.skill}
                                                    </Badge>
                                                    <p className="text-sm text-gray-700 flex-1">{item.justificativa}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Soft Skills */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        Soft Skills Valorizadas
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Competências comportamentais que recrutadores buscam especificamente para seu cargo.
                                    </p>
                                    <div className="space-y-3">
                                        {results.palavrasChave?.softSkills?.map((item, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
                                                <div className="flex items-start gap-3">
                                                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white flex-shrink-0">
                                                        {item.skill}
                                                    </Badge>
                                                    <p className="text-sm text-gray-700 flex-1">{item.justificativa}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Skills Gaps */}
                                {results.palavrasChave?.gaps && results.palavrasChave.gaps.length > 0 && (
                                    <Alert className="bg-yellow-50 border-yellow-200">
                                        <Info className="h-5 w-5 text-yellow-600" />
                                        <AlertDescription>
                                            <div className="space-y-2">
                                                <p className="font-semibold text-yellow-900">
                                                    💡 Oportunidades de Desenvolvimento:
                                                </p>
                                                <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                                                    {results.palavrasChave.gaps.map((gap, index) => (
                                                        <li key={index}>{gap}</li>
                                                    ))}
                                                </ul>
                                                <p className="text-xs text-yellow-700 mt-3">
                                                    Considere desenvolver ou destacar estas competências para fortalecer ainda mais seu perfil.
                                                </p>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dica de Ouro */}
                    <Card className="shadow-xl border-2 border-yellow-100">
                        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-2 rounded-lg">
                                    <Lightbulb className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-2xl">💡 Dica de Ouro</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Alert className="bg-yellow-50 border-yellow-200">
                                <Lightbulb className="h-5 w-5 text-yellow-600" />
                                <AlertDescription className="text-base">
                                    <ReactMarkdown>{results.dicaOuro || ""}</ReactMarkdown>
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>

                {/* Feedback Form */}
                <div className="no-print">
                    <FeedbackForm 
                        cargoAlvo={cargoAlvo} 
                        areaAtuacao={areaAtuacao} 
                        onFeedbackSubmitted={() => setHasRated(true)}
                    />
                </div>

                {/* Feedback Modal Removed */}

                {/* Contact Info Collection Modal */}
                <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Quase lá!</DialogTitle>
                            <DialogDescription>
                                Informe seus dados para liberar o download do seu relatório.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullname">Nome Completo *</Label>
                                <Input
                                    id="fullname"
                                    placeholder="Seu nome completo"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">Telefone com DDD *</Label>
                                <Input
                                    id="whatsapp"
                                    placeholder="(11) 99999-9999"
                                    value={whatsappInput}
                                    onChange={(e) => setWhatsappInput(e.target.value)}
                                    required
                                />
                            </div>
                            <Button 
                                onClick={handleSaveContactInfo} 
                                disabled={!whatsappInput.trim() || !nameInput.trim() || !emailInput.trim() || isSavingUser}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                                {isSavingUser ? "Salvando..." : "Confirmar e Baixar"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* CTA Final */}
                <div className="mt-12 text-center">
                    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
                        <CardContent className="pt-8 pb-8">
                            <h3 className="text-2xl font-bold mb-4">
                                Pronto para Transformar seu Perfil? 🚀
                            </h3>
                            <p className="text-lg text-blue-50 mb-6 max-w-2xl mx-auto">
                                Agora você tem todas as ferramentas para criar um LinkedIn irresistível. 
                                Implemente essas sugestões e comece a atrair as melhores oportunidades do mercado farmacêutico!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button 
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-blue-50 gap-2 no-print shadow-md font-semibold"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                >
                                    Fazer Nova Análise
                                </Button>
                                <Button 
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-blue-50 gap-2 no-print shadow-md font-semibold"
                                    onClick={() => {
                                        base44.analytics.track({
                                            eventName: "resume_download_click",
                                            properties: { type: "pdf_print", cargo_alvo: cargoAlvo }
                                        });
                                        handleProtectedAction(() => window.print());
                                    }}
                                >
                                    <Printer className="w-5 h-5" />
                                    Imprimir / Salvar PDF
                                </Button>
                                <Button 
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-blue-50 gap-2 no-print shadow-md font-semibold"
                                    onClick={() => {
                                        base44.analytics.track({
                                            eventName: "resume_download_click",
                                            properties: { type: "word", cargo_alvo: cargoAlvo }
                                        });
                                        handleProtectedAction(downloadAsWord);
                                    }}
                                >
                                    <FileText className="w-5 h-5" />
                                    Baixar em Word
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}