import React from "react";
import { motion } from "framer-motion";
import { User, Brain, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfileHeader({ user, userProfile }) {
  const userLevel = Math.floor((userProfile?.total_score || 0) / 100) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-none shadow-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden">
        <CardContent className="p-8 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{user?.full_name || 'User'}</h1>
                <p className="text-indigo-100 mb-3">{user?.email}</p>
                <div className="flex items-center gap-3">
                  <Badge className="bg-white/20 text-white border-white/30">
                    Level {userLevel}
                  </Badge>
                  <Badge className="bg-yellow-400/20 text-yellow-200 border-yellow-400/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {userProfile?.total_score || 0} points
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-indigo-100">
              <Brain className="w-4 h-4" />
              <span className="text-sm">
                {userProfile?.onboarding_completed 
                  ? "Onboarding completed - Ready for advanced learning!" 
                  : "Complete onboarding to unlock full personalization"
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}