import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export default function ResultSummary() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: interview, isLoading } = useQuery({
    queryKey: ["interview", id],
    queryFn: () => api.interview.getInterviewById(id),
  });

  if (isLoading) {
    return <div>Loading summary...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Interview Feedback</h1>
            <p className="text-gray-600">
              Feedback submitted on{" "}
              {format(new Date(interview.created_at), "PPp")}
            </p>
          </div>
          <div className="text-center">
            <div className="relative inline-block">
              <svg className="w-24 h-24">
                <circle
                  className="text-gray-200"
                  strokeWidth="5"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-blue-600"
                  strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 45 * (1 - interview.overall_score / 100)
                  }`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold">
                  {interview.overall_score}
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">Overall Score</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Ratings</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Technical</span>
                  <span>{interview.technical_score}/10</span>
                </div>
                <Progress value={interview.technical_score * 10} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Communication</span>
                  <span>{interview.communication_score}/10</span>
                </div>
                <Progress value={interview.communication_score * 10} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Confidence</span>
                  <span>{interview.confidence_score}/10</span>
                </div>
                <Progress value={interview.confidence_score * 10} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Strengths</h2>
              <ul className="space-y-2">
                {interview.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-4 h-4 mt-1 mr-2 bg-green-500 rounded-full" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Areas for Improvement
              </h2>
              <ul className="space-y-2">
                {interview.areas_of_improvement.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-4 h-4 mt-1 mr-2 bg-yellow-500 rounded-full" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Remarks</h2>
            <p className="text-gray-700">{interview.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
