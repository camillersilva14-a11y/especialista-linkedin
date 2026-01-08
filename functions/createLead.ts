import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return Response.json({ error: 'Method not allowed' }, { status: 405 });
        }

        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { full_name, email, whatsapp } = body;

        // Create Lead using service role to bypass RLS issues
        const result = await base44.asServiceRole.entities.Lead.create({
            full_name: full_name || user.full_name || "Usuário",
            email: email || user.email,
            whatsapp: whatsapp || user.whatsapp || "Não informado",
            status: 'novo'
        });

        return Response.json(result);
    } catch (error) {
        console.error('Lead creation error:', error);
        return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
});