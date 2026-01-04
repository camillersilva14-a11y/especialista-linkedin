import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Rocket, User, Zap } from "lucide-react";

export default function QuickActions({ userProfile }) {
  const actions = [
    {
      title: "Continue Learning",
      description: "Pick up where you left off",
      icon: Rocket,
      url: "Onboarding",
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Ask AI Assistant",
      description: "Get personalized help",
      icon: MessageCircle,
      url: "Assistant",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Update Profile",
      description: "Refine your preferences",
      icon: User,
      url: "Profile",
      color: "from-pink-500 to-red-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actions.map((action, index) => (
            <Link key={action.title} to={createPageUrl(action.url)}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-shadow duration-200 cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <action.icon className="w-5 h-5" />
                  <div>
                    <p className="font-semibold text-sm">{action.title}</p>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}