import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function SectionFeedback({ sectionName, contentSnippet, cargoAlvo, areaAtuacao, className = "" }) {
    const [status, setStatus] = useState(null); // 'like', 'dislike', or null
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFeedback = async (sentiment) => {
        setIsSubmitting(true);
        try {
            await base44.entities.SuggestionFeedback.create({
                section_name: sectionName,
                sentiment: sentiment,
                content_snippet: contentSnippet ? contentSnippet.substring(0, 100) : "",
                cargo_alvo: cargoAlvo,
                area_atuacao: areaAtuacao
            });
            
            setStatus(sentiment);
            toast.success("Obrigado pelo seu feedback!");
            
            base44.analytics.track({
                eventName: "suggestion_feedback_submitted",
                properties: {
                    section: sectionName,
                    sentiment: sentiment
                }
            });
        } catch (error) {
            console.error("Error submitting feedback:", error);
            toast.error("Erro ao salvar feedback.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Button
                variant={status === 'like' ? "default" : "ghost"}
                size="sm"
                onClick={() => handleFeedback('like')}
                disabled={isSubmitting || status !== null}
                className={status === 'like' ? "bg-green-600 hover:bg-green-700" : "text-gray-400 hover:text-green-600"}
                title="Gostei desta sugestão"
            >
                <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
                variant={status === 'dislike' ? "default" : "ghost"}
                size="sm"
                onClick={() => handleFeedback('dislike')}
                disabled={isSubmitting || status !== null}
                className={status === 'dislike' ? "bg-red-600 hover:bg-red-700" : "text-gray-400 hover:text-red-600"}
                title="Não gostei desta sugestão"
            >
                <ThumbsDown className="w-4 h-4" />
            </Button>
        </div>
    );
}