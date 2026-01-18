import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return Response.json({ error: 'Method not allowed' }, { status: 405 });
        }

        const base44 = createClientFromRequest(req);
        let user = null;
        try {
            user = await base44.auth.me();
        } catch (e) {
            // User might not be logged in, ignoring error
        }

        const body = await req.json();
        const { full_name, email, whatsapp } = body;

        // Validate required fields if user is not logged in or fields are missing
        const nameToUse = full_name || (user && user.full_name);
        const emailToUse = email || (user && user.email);
        const phoneToUse = whatsapp || (user && user.whatsapp);

        if (!nameToUse || !emailToUse || !phoneToUse) {
             return Response.json({ error: 'Nome, Email e Telefone são obrigatórios.' }, { status: 400 });
        }

        // Create Lead using service role to bypass RLS issues
        const result = await base44.asServiceRole.entities.Lead.create({
            full_name: nameToUse,
            email: emailToUse,
            whatsapp: phoneToUse,
            status: 'novo'
        });

        return Response.json(result);
    } catch (error) {
        console.error('Lead creation error:', error);
        return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
});