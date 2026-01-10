import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return Response.json({ error: 'Method not allowed' }, { status: 405 });
        }

        const base44 = createClientFromRequest(req);
        
        const body = await req.json();
        const { file_data, filename, cargoAlvo, areaAtuacao } = body;

        if (!file_data || !cargoAlvo || !areaAtuacao) {
            return Response.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Convert Base64 to File object
        // file_data is expected to be a data URL: "data:application/pdf;base64,..."
        const fileResponse = await fetch(file_data);
        const fileBlob = await fileResponse.blob();
        
        // We need to create a File object for the upload integration
        // The integration expects the file directly in the payload property 'file'
        // But for UploadPrivateFile, the input schema says "file": "string" (binary)
        // In the SDK, we typically pass the File object.
        const file = new File([fileBlob], filename || "resume.pdf", { type: fileBlob.type });

        // 1. Upload file using service role (bypassing user auth requirement)
        const uploadResult = await base44.asServiceRole.integrations.Core.UploadPrivateFile({ 
            file: file 
        });

        if (!uploadResult.file_uri) {
            throw new Error("Failed to upload file");
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

        return Response.json(results);

    } catch (error) {
        console.error('Analysis error:', error);
        return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
});