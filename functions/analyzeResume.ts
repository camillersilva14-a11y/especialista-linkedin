import { createClientFromRequest } from 'npm:@base44/sdk@0.8.3';

Deno.serve(async (req) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Content-Type': 'application/json'
    };

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers });
    }

    try {
        if (req.method !== 'POST') {
            return Response.json({ success: false, error: 'Method not allowed' }, { status: 200, headers });
        }

        // Initialize client - this handles the service role key injection from env
        let base44;
        try {
            base44 = createClientFromRequest(req);
        } catch (e) {
            console.error("Error creating client:", e);
            // If creating client fails (e.g. bad auth header), we try to proceed? 
            // We need base44 object to use integrations.
            // If createClientFromRequest fails, we can't use the SDK.
            return Response.json({ success: false, error: 'Authentication initialization failed' }, { status: 200, headers });
        }
        
        const body = await req.json();
        const { file_data, filename, cargoAlvo, areaAtuacao } = body;

        if (!file_data || !cargoAlvo || !areaAtuacao) {
            return Response.json({ success: false, error: 'Missing required parameters' }, { status: 200, headers });
        }

        // Convert Base64 to File object
        const fileResponse = await fetch(file_data);
        const fileBlob = await fileResponse.blob();
        const file = new File([fileBlob], filename || "resume.pdf", { type: fileBlob.type });

        // 1. Upload file using service role (bypassing user auth requirement)
        // We wrap in try-catch to ensure we return 200 with error details
        let uploadResult;
        try {
             uploadResult = await base44.asServiceRole.integrations.Core.UploadPrivateFile({ 
                file: file 
            });
        } catch (uploadError) {
            console.error("UploadPrivateFile error:", uploadError);
            return Response.json({ success: false, error: `Upload failed: ${uploadError.message}` }, { status: 200, headers });
        }

        if (!uploadResult || !uploadResult.file_uri) {
            return Response.json({ success: false, error: "Upload failed (no URI)" }, { status: 200, headers });
        }

        // 2. Create signed URL for the LLM to access it
        const signedUrlResult = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
            file_uri: uploadResult.file_uri,
            expires_in: 300 // 5 minutes
        });

        const file_url = signedUrlResult.signed_url;

        // 3. Prepare prompt
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

        // 4. Call LLM
        const results = await base44.asServiceRole.integrations.Core.InvokeLLM({
            prompt: prompt,
            file_urls: [file_url],
            response_json_schema: responseSchema
        });

        // SUCCESS!
        return Response.json({ success: true, data: results }, { status: 200, headers });

    } catch (error) {
        console.error('Analysis error:', error);
        return Response.json({ success: false, error: error.message || 'Internal server error' }, { status: 200, headers });
    }
});