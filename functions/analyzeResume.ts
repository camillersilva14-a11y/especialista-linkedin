import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return Response.json({ error: 'Method not allowed' }, { status: 405 });
        }

        const base44 = createClientFromRequest(req);
        // Note: We do NOT check for user auth here because we want to allow unauthenticated users
        // to use the analysis tool.
        
        const body = await req.json();
        const { file_url, cargoAlvo, areaAtuacao } = body;

        if (!file_url || !cargoAlvo || !areaAtuacao) {
            return Response.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const prompt = `Você é um consultor sênior de carreira e especialista no algoritmo do LinkedIn, especializado no mercado farmacêutico brasileiro.

CONTEXTO:
- Cargo Alvo: ${cargoAlvo}
- Área de Atuação: ${areaAtuacao}
- Currículo anexado: ${file_url}

TAREFA:
Analise o currículo em anexo e crie um relatório completo de otimização do perfil LinkedIn para este profissional, considerando o cargo alvo no mercado farmacêutico brasileiro.

DIRETRIZES PARA A SEÇÃO "SOBRE":
- Utilize a técnica de STORYTELLING para narrar a trajetória profissional.
- Conecte as experiências passadas com o objetivo futuro (${cargoAlvo}).
- Destaque conquistas quantitativas e qualitativas do currículo.
- Use tom profissional, confiante e empático.
- Estruture em: Gancho (Headline expandida), Minha História (Jornada), Expertise (Competências chave) e Como posso ajudar (Proposta de valor).

IMPORTANTE: Retorne EXATAMENTE no formato JSON especificado, sem texto adicional antes ou depois do JSON.`;

        // Schema do JSON de resposta
        const responseSchema = {
            type: "object",
            properties: {
                diagnostico: {
                    type: "object",
                    properties: {
                        nota: { type: "number", description: "Nota de 0 a 100" },
                        explicacao: { type: "string", description: "Explicação detalhada do diagnóstico em markdown" },
                        checklistVisual: { type: "string", description: "Checklist visual dos principais pontos de melhoria" }
                    }
                },
                headlines: {
                    type: "array",
                    items: { type: "string" },
                    description: "3 opções de headlines otimizadas"
                },
                sobre: {
                    type: "string",
                    description: "Reescrita da seção 'Sobre' em markdown, usando storytelling envolvente, primeira pessoa, focada em resultados e alinhada ao cargo alvo."
                },
                experiencia: {
                    type: "string",
                    description: "Exemplo de otimização de uma experiência profissional"
                },
                palavrasChave: {
                    type: "object",
                    properties: {
                        topKeywords: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    keyword: { type: "string" },
                                    relevancia: { type: "string" }
                                }
                            },
                            description: "Top 10 palavras-chave para o cargo"
                        },
                        hardSkills: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    skill: { type: "string" },
                                    justificativa: { type: "string" }
                                }
                            },
                            description: "5 hard skills essenciais"
                        },
                        softSkills: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    skill: { type: "string" },
                                    justificativa: { type: "string" }
                                }
                            },
                            description: "5 soft skills importantes"
                        },
                        gaps: {
                            type: "array",
                            items: { type: "string" },
                            description: "Gaps identificados que podem ser desenvolvidos"
                        }
                    }
                },
                dicaOuro: {
                    type: "string",
                    description: "Uma dica prática de engajamento para começar hoje"
                }
            }
        };

        // Call the integration using the service role context (or just standard context but from backend)
        // Using asServiceRole might be safer if the integration requires permissions the public user doesn't have.
        // But usually standard context is fine if backend functions are allowed to call it.
        // Actually, let's use asServiceRole to ensure it works even if the user is not authenticated.
        
        const results = await base44.asServiceRole.integrations.Core.InvokeLLM({
            prompt: prompt,
            file_urls: [file_url],
            response_json_schema: responseSchema
        });

        return Response.json(results);

    } catch (error) {
        console.error('Analysis error:', error);
        return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
});