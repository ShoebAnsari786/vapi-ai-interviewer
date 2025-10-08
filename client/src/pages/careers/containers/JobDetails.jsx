import { useParams, useNavigate } from "react-router-dom";
import { jobOpenings } from "../constants/jobs";
import DataTable from "@/components/shared/table/DataTable";
import CopyLinkCard from "@/components/shared/cards/CopyLinkCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, Briefcase } from "lucide-react";
import { ArrowLeftIcon } from "lucide-react";
import QuestionsSection from "../components/QuestionsSection";

// Mock data for candidates (replace with API data later)
const mockCandidates = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    interviewDate: "2024-03-15T14:30:00",
    score: 8.5,
    status: "Completed",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    interviewDate: "2024-03-14T10:15:00",
    score: 7.2,
    status: "Completed",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@example.com",
    interviewDate: "2024-03-13T16:45:00",
    score: 9.0,
    status: "Completed",
  },
];

const tableColumns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "interviewDate",
    label: "Interview Date",
    render: (row) => new Date(row.interviewDate).toLocaleString(),
  },
  {
    key: "score",
    label: "Score",
    render: (row) => (
      <div className="flex items-center">
        <div
          className={`h-2 w-2 rounded-full mr-2 ${
            row.score >= 7
              ? "bg-green-500"
              : row.score >= 5
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        />
        <span
          className={`font-medium ${
            row.score >= 7
              ? "text-green-600"
              : row.score >= 5
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {row.score.toFixed(1)}/10
        </span>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        {row.status}
      </span>
    ),
  },
];

const JobDetails = () => {
  const { department, jobId } = useParams();
  const navigate = useNavigate();

  // Find the job in the jobOpenings data
  const job = jobOpenings[department]?.jobs.find(
    (j) => j.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === jobId
  );

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Job not found
        </h2>
        <Button onClick={() => navigate("/careers")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Careers
        </Button>
      </div>
    );
  }

  const interviewLink = `${window.location.origin}/tech-interview/${jobId}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back button */}
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => navigate("/careers")}
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Careers
      </Button>

      {/* Job Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
        <div className="flex gap-4 text-sm text-gray-600">
          <span className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location}
          </span>
          <span>•</span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {job.experience}
          </span>
          <span>•</span>
          <span className="flex items-center">
            <Briefcase className="w-4 h-4 mr-1" />
            {job.type}
          </span>
        </div>
      </div>

      {/* Interview Link Section */}
      <div className="mb-8">
        <CopyLinkCard
          title="Technical Interview Link"
          link={interviewLink}
          description="Share this link with candidates to start the technical interview process."
          onCopy={(link) => console.log("Link copied:", link)}
        />
      </div>

      {/* Questions Section */}
      <div className="mb-8">
        <QuestionsSection jobId={jobId} />
      </div>

      {/* Candidates Table Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Interview Candidates
        </h2>
        <DataTable
          columns={tableColumns}
          data={mockCandidates}
          onRowClick={(row) => console.log("Clicked row:", row)}
          searchable
          sortable
          pagination
          itemsPerPage={10}
        />
      </div>
    </div>
  );
};

export default JobDetails;
