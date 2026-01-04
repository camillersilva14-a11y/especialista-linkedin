import React from "react";
import { motion } from "framer-motion";
import { Brain, User } from "lucide-react";
import { format } from "date-fns";

export default function ChatMessage({ message }) {
  const isAI = message.type === "ai";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isAI 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
      }`}>
        {isAI ? (
          <Brain className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div className={`max-w-[80%] ${isAI ? '' : 'text-right'}`}>
        <div className={`inline-block px-4 py-3 rounded-2xl ${
          isAI 
            ? 'bg-white border border-gray-200 text-gray-900' 
            : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <p className="text-xs text-gray-400 mt-1 px-2">
          {format(message.timestamp, 'HH:mm')}
        </p>
      </div>
    </motion.div>
  );
}