import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Target, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressOverview({ userProfile, progress, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedSteps = progress.filter(p => p.completed).length;
  const totalSteps = progress.length || 10;
  const completionRate = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Main Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-600">Overall Completion</span>
              <span className="text-sm font-bold text-indigo-600">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{completedSteps}</p>
              <p className="text-xs text-gray-600">Completed</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{totalSteps - completedSteps}</p>
              <p className="text-xs text-gray-600">Remaining</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{userProfile?.total_score || 0}</p>
              <p className="text-xs text-gray-600">Total Points</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{userProfile?.streak_count || 0}</p>
              <p className="text-xs text-gray-600">Day Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}