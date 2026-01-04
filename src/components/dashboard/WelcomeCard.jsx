import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Rocket, ArrowRight, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WelcomeCard({ user, userProfile, completionPercentage, isLoading }) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600">
        <CardContent className="p-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 bg-white/20" />
            <Skeleton className="h-6 w-64 bg-white/20" />
            <Skeleton className="h-4 w-full bg-white/20" />
            <Skeleton className="h-10 w-32 bg-white/20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-none">
        <CardContent className="p-8 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-4 translate-y-4" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <h2 className="text-2xl font-bold">
                Welcome back, {user?.full_name?.split(' ')[0] || 'Learner'}!
              </h2>
            </div>
            
            <p className="text-indigo-100 mb-6 text-lg">
              {userProfile?.onboarding_completed 
                ? "Continue your personalized learning journey with AI-powered recommendations."
                : "Let's complete your onboarding to unlock your full potential!"
              }
            </p>

            {!userProfile?.onboarding_completed && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-indigo-100">Onboarding Progress</span>
                  <span className="text-sm font-semibold">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2 bg-white/20" />
              </div>
            )}

            <Link to={createPageUrl(userProfile?.onboarding_completed ? "Assistant" : "Onboarding")}>
              <Button className="bg-white text-indigo-600 hover:bg-white/90 font-semibold shadow-lg">
                <Rocket className="w-4 h-4 mr-2" />
                {userProfile?.onboarding_completed ? "Get AI Recommendations" : "Continue Onboarding"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}