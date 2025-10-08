import { useParams } from "react-router-dom";
import { useGetCandidateByIdQuery } from "@/hooks/useCandidate";
import { format } from "date-fns";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: candidate, isLoading, error } = useGetCandidateByIdQuery(id);

  if (isLoading) {
    return <div className="text-center py-4">Loading candidate profile...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Error: {error.message}
      </div>
    );
  }

  if (!candidate) {
    return <div className="text-center py-4">Candidate not found</div>;
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
            <h1 className="text-2xl font-bold mb-2">Candidate Profile</h1>
            <p className="text-gray-600">
              Applied on {format(new Date(candidate.created_at), "PPp")}
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
                    2 * Math.PI * 45 * (1 - candidate.score)
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
                  {(candidate.score * 100).toFixed(0)}
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">ATS Score</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-medium">{candidate.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Position</label>
                  <p className="font-medium">{candidate.position}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{candidate.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium">{candidate.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Experience</label>
                  <p className="font-medium">{candidate.experience} years</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      candidate.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : candidate.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {candidate.status.charAt(0).toUpperCase() +
                      candidate.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Links</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Resume</label>
                  <a
                    href={candidate.resume_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    View Resume <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Scores */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Evaluation Scores</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>ATS Score</span>
                  <span>{(candidate.score * 100).toFixed(1)}%</span>
                </div>
                <Progress value={candidate.score * 100} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>LinkedIn Profile Score</span>
                  <span>
                    {(candidate.linkedin_profile_score * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={candidate.linkedin_profile_score * 100} />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Screening Questions</h2>
            <div className="space-y-3">
              {candidate.questions.map((question, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p>{question}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <h2 className="text-lg font-semibold mb-4">AI Analysis</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">
                {candidate.remarks}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
