import { createClientFromRequest } from 'npm:@base44/sdk@0.8.24';

Deno.serve(async (req) => {
    try {
        const payload = await req.json();
        const webhookUrl = Deno.env.get("ANALYTICS_WEBHOOK_URL");
        
        if (!webhookUrl) {
            console.warn("ANALYTICS_WEBHOOK_URL not set");
            return Response.json({ success: true });
        }

        const dataToSend = {
            type: "lead_created",
            lead: payload.data,
            event: payload.event,
            timestamp: new Date().toISOString()
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