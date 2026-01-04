import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Brain } from "lucide-react";
import { format } from "date-fns";

export default function LearningStats({ userProfile }) {
  const currentLevel = Math.floor((userProfile?.total_score || 0) / 100) + 1;
  const progressToNextLevel = ((userProfile?.total_score || 0) % 100);

  return (
    <div className="space-y-6">
      
      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-purple-500" />
              Level Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-purple-600 mb-1">Level {currentLevel}</div>
              <p className="text-sm text-gray-500">
                {100 - progressToNextLevel} points to next level
              </p>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Streak</span>
              <span className="font-bold text-green-600">{userProfile?.streak_count || 0} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Active</span>
              <span className="font-medium text-gray-900">
                {userProfile?.last_activity_date 
                  ? format(new Date(userProfile.last_activity_date), 'MMM d')
                  : 'Today'
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Learning Style</span>
              <span className="font-medium text-gray-900 capitalize">
                {userProfile?.preferences?.learning_style?.replace(/_/g, ' ') || 'Not set'}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-none shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6" />
              <h3 className="font-semibold">AI Insight</h3>
            </div>
            <p className="text-purple-100 text-sm">
              Based on your activity patterns, you're most productive during morning sessions. 
              Consider scheduling important learning tasks earlier in the day.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}