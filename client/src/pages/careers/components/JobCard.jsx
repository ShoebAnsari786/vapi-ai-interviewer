import { useNavigate } from "react-router-dom";

const JobCard = ({ title, location, experience, type, department }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const jobId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    navigate(`/careers/${department}/${jobId}`);
  };

  const handleApply = (e) => {
    e.stopPropagation(); // Prevent card click event
    const jobId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    navigate(`/careers/apply/${jobId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
        <span className="flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {location}
        </span>
        <span className="flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {experience}
        </span>
        <span className="flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {type}
        </span>
      </div>
      <button
        onClick={handleApply}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;
