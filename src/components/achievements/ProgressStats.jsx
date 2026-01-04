import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Target, Zap, Crown } from "lucide-react";

export default function ProgressStats({ userProfile, achievements }) {
  const stats = [
    {
      title: "Total Points",
      value: userProfile?.total_score || 0,
      icon: Target,
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Current Streak",
      value: `${userProfile?.streak_count || 0} days`,
      icon: Zap,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Achievements",
      value: achievements.length,
      icon: Trophy,
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Level",
      value: Math.floor((userProfile?.total_score || 0) / 100) + 1,
      icon: Crown,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.title}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}