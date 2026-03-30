import { createClientFromRequest } from 'npm:@base44/sdk@0.8.24';

Deno.serve(async (req) => {
    try {
        // payload.data contém os dados da entidade Lead que acabou de ser criada
        const payload = await req.json();
        
        // URL de destino especificada
        const webhookUrl = "https://api.base44.com/api/apps/prod/functions/receiveEvent?secret=saude-em-contexto-2026";

        // Formatação do payload de acordo com o exigido pelo Saúde em Contexto Analytics
        const dataToSend = {
            app_name: "Especialista LinkedIn",
            event_type: "lead",
            user_name: payload.data?.full_name || "Nome não informado",
            user_email: payload.data?.email || "Email não informado",
            source: "LinkedIn",
            event_name: "lead_captured"
        };

        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            console.error("Failed to send webhook:", response.status, await response.text());
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("Error in onLeadCreated:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});