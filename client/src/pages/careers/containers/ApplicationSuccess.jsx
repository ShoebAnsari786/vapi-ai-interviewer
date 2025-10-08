import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ApplicationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <CheckCircle className="h-20 w-20 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Application Submitted!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your interest. We will review your application and get
            back to you soon.
          </p>
        </div>
        <div className="mt-8">
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
