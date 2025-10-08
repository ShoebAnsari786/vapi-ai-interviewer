import { CheckCircle, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function InterviewSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const candidateName = state?.name || "Candidate";
  const position = state?.position || "the position";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <CheckCircle className="h-20 w-20 text-green-500" />
            <Clock className="h-8 w-8 text-blue-500 absolute -bottom-2 -right-2" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Interview Completed!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you {candidateName} for completing the technical screening
            interview for {position}.
          </p>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p>
              Our team will carefully review your interview responses and assess
              your technical skills.
            </p>
            <p>
              You will receive feedback and next steps via email within 2-3
              business days.
            </p>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => navigate("/careers")}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Careers
          </button>
        </div>
      </div>
    </div>
  );
}
