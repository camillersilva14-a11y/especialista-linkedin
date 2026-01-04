import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, Clock, Brain } from "lucide-react";

export default function StepContent({ step, onComplete, userProfile, isGeneratingNext }) {
  const [stepData, setStepData] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);

  React.useEffect(() => {
    const startTime = Date.now();
    return () => {
      const endTime = Date.now();
      setTimeSpent((endTime - startTime) / 1000);
    };
  }, []);

  const renderStepContent = () => {
    switch(step.step_type) {
      case "preference":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">What's your preferred learning style?</Label>
              <RadioGroup 
                value={stepData.learning_style} 
                onValueChange={(value) => setStepData({...stepData, learning_style: value})}
                className="mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="visual" id="visual" />
                  <Label htmlFor="visual">Visual - I learn best with images, diagrams, and videos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="auditory" id="auditory" />
                  <Label htmlFor="auditory">Auditory - I prefer listening and discussions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kinesthetic" id="kinesthetic" />
                  <Label htmlFor="kinesthetic">Hands-on - I learn by doing and practicing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reading" id="reading" />
                  <Label htmlFor="reading">Reading - I prefer text-based learning</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">What's your experience level?</Label>
              <Select value={stepData.experience_level} onValueChange={(value) => setStepData({...stepData, experience_level: value})}>
                <SelectTrigger className="mt-3">
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner - I'm just starting out</SelectItem>
                  <SelectItem value="intermediate">Intermediate - I have some experience</SelectItem>
                  <SelectItem value="advanced">Advanced - I'm experienced and want to deepen knowledge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "tutorial":
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">{step.content}</h4>
              <p className="text-gray-600">
                This is an interactive tutorial step. Follow along and check the box when you're ready to continue.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="understood" 
                checked={stepData.understood}
                onCheckedChange={(checked) => setStepData({...stepData, understood: checked})}
              />
              <Label htmlFor="understood">I understand and I'm ready to continue</Label>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
              <p className="text-gray-700 leading-relaxed">{step.content}</p>
            </div>
          </div>
        );
    }
  };

  const canComplete = () => {
    switch(step.step_type) {
      case "preference":
        return stepData.learning_style && stepData.experience_level;
      case "tutorial":
        return stepData.understood;
      default:
        return true;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">{step.title}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{step.description}</p>
            </div>
          </div>
          {step.estimated_duration && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Estimated time: {step.estimated_duration} minutes
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={() => onComplete({ ...stepData, timeSpent })}
              disabled={!canComplete() || isGeneratingNext}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              {isGeneratingNext ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Generating Next Step...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Step
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}