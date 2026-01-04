import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award, Crown } from "lucide-react";

export default function AchievementCard({ achievement, index, userProfile }) {
  const iconMap = {
    trophy: Trophy,
    star: Star,
    award: Award,
    crown: Crown
  };

  const rarityColors = {
    common: "from-gray-400 to-gray-500",
    rare: "from-blue-400 to-blue-500",
    epic: "from-purple-400 to-purple-500",
    legendary: "from-yellow-400 to-orange-500"
  };

  const IconComponent = iconMap[achievement.icon] || Trophy;
  const isUnlocked = false; // You could implement logic here to check if user has this achievement

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className={`border-none shadow-lg overflow-hidden transition-all duration-300 ${
        isUnlocked ? 'bg-white' : 'bg-gray-50'
      }`}>
        <CardContent className="p-6 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${
            rarityColors[achievement.rarity || 'common']
          } flex items-center justify-center ${isUnlocked ? '' : 'opacity-50'}`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          
          <h3 className={`font-bold text-lg mb-2 ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
            {achievement.title}
          </h3>
          
          <p className={`text-sm mb-4 ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
            {achievement.description}
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <Badge className={`${isUnlocked ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}>
              {achievement.points} points
            </Badge>
            <Badge variant="outline" className={`${
              isUnlocked ? 'border-purple-200 text-purple-700' : 'border-gray-200 text-gray-500'
            }`}>
              {achievement.rarity || 'common'}
            </Badge>
          </div>
          
          {!isUnlocked && achievement.requirement && (
            <p className="text-xs text-gray-400 mt-3">
              Unlock by: {achievement.requirement.type?.replace(/_/g, ' ')} ({achievement.requirement.value})
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}