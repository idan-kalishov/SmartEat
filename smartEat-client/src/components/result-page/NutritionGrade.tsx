import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface NutritionGradeProps {
  grade: string;
  score: number;
  recommendations: string[];
  positiveFeedback: string;
}

export const NutritionGrade: React.FC<NutritionGradeProps> = ({
  grade,
  score,
  recommendations,
  positiveFeedback,
}) => {
  // Map grade to badge color and mascot image
  const gradeStyles = {
    A: {
      color: "bg-green-100",
      badge: "bg-green-500",
      text: "Great job!",
      mascot: "/assets/mascot-happy.png",
    },
    B: {
      color: "bg-green-100",
      badge: "bg-green-500",
      text: "Good effort!",
      mascot: "/assets/mascot-happy.png",
    },
    C: {
      color: "bg-orange-100",
      badge: "bg-orange-500",
      text: "Room to grow!",
      mascot: "/assets/mascot-sad.png",
    },
    D: {
      color: "bg-red-100",
      badge: "bg-red-500",
      text: "Needs improvement.",
      mascot: "/assets/mascot-sad.png",
    },
    F: {
      color: "bg-red-200",
      badge: "bg-red-700",
      text: "Critical attention.",
      mascot: "/assets/mascot-sad.png",
    },
    default: {
      color: "bg-gray-100",
      badge: "bg-gray-500",
      text: "Unknown grade.",
      mascot: "",
    },
  };

  const { color, badge, mascot } = gradeStyles[grade] || gradeStyles.default;

  return (
    <Card className={`${color} rounded-xl shadow-md`}>
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xl font-bold flex items-center gap-2">
              Nutrition Grade
              <Badge className={`${badge} text-white`}>{grade}</Badge>
            </div>
            <div className="text-gray-600 text-sm">Score: {score}/100</div>
          </div>
          {mascot && (
            <img
              src={mascot}
              alt="Mascot"
              className="h-16 w-16"
              style={{ objectFit: "contain" }}
            />
          )}
        </div>

        <div className="my-4">
          <Progress value={score} />
        </div>

        <div className="text-base text-gray-700 mb-4">{positiveFeedback}</div>

        {recommendations.length > 0 && (
          <div>
            <div className="font-medium mb-2">Recommendations:</div>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
