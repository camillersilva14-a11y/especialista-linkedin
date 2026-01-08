import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return Response.json({ error: 'Method not allowed' }, { status: 405 });
        }

        const base44 = createClientFromRequest(req);
        const body = await req.json();
        const { rating, comments, cargo_alvo, area_atuacao } = body;

        if (!rating) {
            return Response.json({ error: 'Rating is required' }, { status: 400 });
        }

        // Prepare data with safe defaults
        const feedbackData = {
            rating: Number(rating),
            cargo_alvo: cargo_alvo ? String(cargo_alvo).trim() : undefined,
            area_atuacao: area_atuacao ? String(area_atuacao).trim() : undefined,
            comments: comments ? String(comments).trim() : undefined
        };

        console.log('Attempting to create feedback with data:', JSON.stringify(feedbackData));
        
        // Use AppFeedback entity with service role
        const result = await base44.asServiceRole.entities.AppFeedback.create(feedbackData);
        
        console.log('Feedback created successfully:', result);

        return Response.json(result);
    } catch (error) {
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Feedback submission error:', error);
        return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
});