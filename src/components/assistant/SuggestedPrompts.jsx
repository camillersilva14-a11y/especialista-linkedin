import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function SuggestedPrompts({ prompts, onPromptClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium text-gray-600">Suggested questions:</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {prompts.map((prompt, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="p-4 cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200"
              onClick={() => onPromptClick(prompt)}
            >
              <p className="text-sm text-gray-700">{prompt}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}