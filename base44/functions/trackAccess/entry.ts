import { createClientFromRequest } from 'npm:@base44/sdk@0.8.24';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        let user = null;
        try {
            user = await base44.auth.me();
        } catch (e) {
            // Ignore auth error for public pages
        }

        const payload = await req.json();
        const webhookUrl = Deno.env.get("ANALYTICS_WEBHOOK_URL");
        
        if (!webhookUrl) {
            console.warn("ANALYTICS_WEBHOOK_URL not set");
            return Response.json({ success: true });
        }

        const dataToSend = {
            type: "app_access",
            pageName: payload.pageName,
            path: payload.path,
            user_id: user ? user.id : "anonymous",
            user_email: user ? user.email : null,
            timestamp: new Date().toISOString()
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