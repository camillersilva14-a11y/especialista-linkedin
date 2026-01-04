import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function StepNavigation({ 
  currentStepIndex, 
  totalSteps, 
  onPrevious, 
  onNext, 
  canGoNext 
}) {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStepIndex === 0}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Previous
      </Button>
      
      <div className="flex gap-2">
        {Array(totalSteps).fill(0).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index <= currentStepIndex ? 'bg-indigo-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      
      <Button
        onClick={onNext}
        disabled={currentStepIndex === totalSteps - 1 || !canGoNext}
        className="flex items-center gap-2"
      >
        Next
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}