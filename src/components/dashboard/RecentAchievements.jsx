import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentAchievements({ achievements, isLoading }) {
  const iconMap = {
    trophy: Trophy,
    star: Star,
    award: Award,
    crown: Crown
  };

  const rarityColors = {
    common: "bg-gray-100 text-gray-800 border-gray-200",
    rare: "bg-blue-100 text-blue-800 border-blue-200",
    epic: "bg-purple-100 text-purple-800 border-purple-200",
    legendary: "bg-yellow-100 text-yellow-800 border-yellow-200"
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16 mt-1" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {achievements.length > 0 ? (
            <div className="space-y-4">
              {achievements.slice(0, 3).map((achievement, index) => {
                const IconComponent = iconMap[achievement.icon] || Trophy;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{achievement.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={rarityColors[achievement.rarity || 'common']}>
                          {achievement.rarity || 'common'}
                        </Badge>
                        <span className="text-xs text-gray-500">{achievement.points} pts</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Complete onboarding to unlock achievements!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}