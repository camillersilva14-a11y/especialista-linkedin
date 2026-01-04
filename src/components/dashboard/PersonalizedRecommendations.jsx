
import React, { useState, useEffect, useCallback } from "react";
import { InvokeLLM } from "@/integrations/Core";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Lightbulb, ArrowRight, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PersonalizedRecommendations({ userProfile, isLoading }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRecommendations = useCallback(async () => {
    if (!userProfile) return;
    
    setIsGenerating(true);
    try {
      const result = await InvokeLLM({
        prompt: `Based on this user profile: ${JSON.stringify(userProfile.preferences)}, 
        generate 3 personalized learning recommendations. Focus on their learning style, goals, and experience level. 
        Make recommendations actionable and specific.`,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  category: { type: "string" },
                  priority: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      setRecommendations(result.recommendations || []);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [userProfile]); // userProfile is a dependency because it's used inside the callback

  useEffect(() => {
    if (userProfile) {
      generateRecommendations();
    }
  }, [userProfile, generateRecommendations]); // generateRecommendations is now a stable dependency

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-500" />
              AI Recommendations
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={generateRecommendations}
              disabled={isGenerating}
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                          {rec.category}
                        </span>
                        <span className="text-xs text-gray-500">{rec.priority} priority</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Complete your profile to get personalized recommendations!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
