import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";

export default function FeedbackForm({ cargoAlvo, areaAtuacao, onFeedbackSubmitted }) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comments, setComments] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (rating === 0) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            const feedbackData = {
                rating,
                cargo_alvo: cargoAlvo || "",
                area_atuacao: areaAtuacao || ""
            };

            if (comments && comments.trim().length > 0) {
                feedbackData.comments = comments.trim();
            }

            await base44.entities.Feedback.create(feedbackData);
            
            setIsSubmitted(true);
            if (onFeedbackSubmitted) {
                onFeedbackSubmitted();
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setError("Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="my-8"
            >
                <Card className="border-2 border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-green-900 mb-2">
                                Obrigado pelo seu feedback!
                            </h3>
                            <p className="text-green-700">
                                Sua opinião é muito importante para continuarmos melhorando.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="my-8"
        >
            <Card className="border-2 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-start gap-3">
                        <MessageSquare className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                            <CardTitle className="text-xl">
                                Como foi sua experiência?
                            </CardTitle>
                            <CardDescription className="text-base mt-1">
                                Sua opinião nos ajuda a melhorar continuamente a qualidade das análises
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Rating Stars */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700">
                                Avalie a qualidade da análise *
                            </label>
                            <div className="flex gap-2 justify-center md:justify-start">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star
                                            className={`w-10 h-10 transition-colors ${
                                                star <= (hoveredRating || rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-sm text-gray-600 text-center md:text-left">
                                    {rating === 1 && "Muito insatisfeito"}
                                    {rating === 2 && "Insatisfeito"}
                                    {rating === 3 && "Regular"}
                                    {rating === 4 && "Satisfeito"}
                                    {rating === 5 && "Muito satisfeito"}
                                </p>
                            )}
                        </div>

                        {/* Comments */}
                        <div className="space-y-2">
                            <label htmlFor="feedback-comments" className="text-sm font-semibold text-gray-700">
                                Comentários adicionais (opcional)
                            </label>
                            <Textarea
                                id="feedback-comments"
                                placeholder="Compartilhe sua opinião sobre a análise, sugestões ou melhorias..."
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <p className="text-sm text-red-600 text-center">{error}</p>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={rating === 0 || isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            {isSubmitting ? (
                                "Enviando..."
                            ) : (
                                "Enviar Feedback"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}