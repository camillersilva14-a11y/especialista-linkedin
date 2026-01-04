import React from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export default function AITypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
        <Brain className="w-4 h-4 text-white" />
      </div>
      
      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-gray-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}