import { createClientFromRequest } from 'npm:@base44/sdk@0.8.24';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        let user = null;
        try {
            user = await base44.auth.me();
        } catch (e) {
            // Ignorar erro de autenticação para visitantes anônimos
        }

        const payload = await req.json();
        
        // URL de destino especificada
        const webhookUrl = "https://api.base44.com/api/apps/prod/functions/receiveEvent?secret=saude-em-contexto-2026";

        // Formatação do payload padronizada
        const dataToSend = {
            app_name: "Especialista LinkedIn",
            event_type: "access",
            user_name: user?.full_name || "Visitante Anônimo",
            user_email: user?.email || "N/A",
            source: payload.path || "/", // Passa a rota que foi acessada
            event_name: "page_view",
            page_name: payload.pageName || "Home" // Dado extra para você saber qual página exata
        };

        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            console.error("Failed to send access webhook:", response.status, await response.text());
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("Error in trackAccess:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});