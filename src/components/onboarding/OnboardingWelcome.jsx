import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Brain, Target, Sparkles } from "lucide-react";

export default function OnboardingWelcome({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-12 text-center">
            
            {/* Animated Icons */}
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center"
              >
                <Brain className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 text-yellow-800" />
              </motion.div>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Welcome to SmartPath
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Your AI-powered learning companion that adapts to <span className="font-semibold text-indigo-600">your</span> unique style, 
              pace, and goals for an unforgettable journey.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-indigo-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">AI-Powered</h3>
                <p className="text-sm text-gray-600">Personalized recommendations</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Goal-Oriented</h3>
                <p className="text-sm text-gray-600">Achieve your objectives</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-pink-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Gamified</h3>
                <p className="text-sm text-gray-600">Earn rewards & achievements</p>
              </div>
            </div>

            <Button
              onClick={onStart}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold shadow-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}