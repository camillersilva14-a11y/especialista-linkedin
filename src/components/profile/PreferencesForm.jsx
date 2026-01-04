import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Save } from "lucide-react";

export default function PreferencesForm({ userProfile, onSave, isSaving }) {
  const [preferences, setPreferences] = useState(userProfile?.preferences || {
    learning_style: '',
    experience_level: '',
    goals: [],
    interests: [],
    preferred_pace: ''
  });

  const goalOptions = [
    "Learn new skills",
    "Advance career",
    "Personal development",
    "Academic achievement",
    "Professional certification",
    "Creative pursuits"
  ];

  const interestOptions = [
    "Technology",
    "Business",
    "Design",
    "Science",
    "Arts",
    "Health & Wellness",
    "Languages",
    "Finance",
    "Marketing",
    "Leadership"
  ];

  const handleGoalToggle = (goal, checked) => {
    setPreferences(prev => ({
      ...prev,
      goals: checked 
        ? [...prev.goals, goal]
        : prev.goals.filter(g => g !== goal)
    }));
  };

  const handleInterestToggle = (interest, checked) => {
    setPreferences(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ preferences });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            Learning Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Learning Style */}
            <div>
              <Label className="text-base font-medium">Learning Style</Label>
              <Select 
                value={preferences.learning_style} 
                onValueChange={(value) => setPreferences({...preferences, learning_style: value})}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="How do you learn best?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual - Images & videos</SelectItem>
                  <SelectItem value="auditory">Auditory - Listening & discussions</SelectItem>
                  <SelectItem value="kinesthetic">Hands-on - Practice & experiments</SelectItem>
                  <SelectItem value="reading">Reading - Text-based learning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Experience Level */}
            <div>
              <Label className="text-base font-medium">Experience Level</Label>
              <Select 
                value={preferences.experience_level} 
                onValueChange={(value) => setPreferences({...preferences, experience_level: value})}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Your current level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preferred Pace */}
            <div>
              <Label className="text-base font-medium">Preferred Learning Pace</Label>
              <Select 
                value={preferences.preferred_pace} 
                onValueChange={(value) => setPreferences({...preferences, preferred_pace: value})}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="How fast do you like to learn?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow & Steady</SelectItem>
                  <SelectItem value="moderate">Moderate Pace</SelectItem>
                  <SelectItem value="fast">Fast Track</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Goals */}
            <div>
              <Label className="text-base font-medium mb-3 block">Learning Goals</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={preferences.goals.includes(goal)}
                      onCheckedChange={(checked) => handleGoalToggle(goal, checked)}
                    />
                    <Label htmlFor={goal} className="text-sm">{goal}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <Label className="text-base font-medium mb-3 block">Areas of Interest</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interestOptions.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={preferences.interests.includes(interest)}
                      onCheckedChange={(checked) => handleInterestToggle(interest, checked)}
                    />
                    <Label htmlFor={interest} className="text-sm">{interest}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}