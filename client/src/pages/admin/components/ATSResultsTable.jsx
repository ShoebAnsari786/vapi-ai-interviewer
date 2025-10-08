import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import DataTable from "@/components/shared/table/DataTable";
import { Copy, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useGetCandidatesQuery } from "@/hooks/useCandidate";

export default function ATSResultsTable() {
  const navigate = useNavigate();
  const { data: candidates = [], isLoading, error } = useGetCandidatesQuery();

  const copyInterviewLink = (row) => {
    const baseUrl = window.location.origin;
    const interviewLink = `${baseUrl}/tech-interview/${row.position.toLowerCase()}?name=${encodeURIComponent(
      row.name
    )}&position=${encodeURIComponent(row.position)}`;

    navigator.clipboard
      .writeText(interviewLink)
      .then(() => {
        alert("Interview link copied!"); // You might want to replace this with a toast
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        alert("Failed to copy link");
      });
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "position", label: "Position" },
    { key: "email", label: "Email" },
    {
      key: "phone",
      label: "Phone",
      render: (row) => row.phone?.toString() || "-",
    },
    {
      key: "experience",
      label: "Experience",
      render: (row) => `${row?.experience || "0"} years`,
    },
    {
      key: "score",
      label: "ATS Score",
      render: (row) => `${(row.score * 100)?.toFixed(1) || 0}%`,
    },
    {
      key: "linkedin_profile_score",
      label: "LinkedIn Score",
      render: (row) =>
        `${(row?.linkedin_profile_score * 100)?.toFixed(1) || 0}%`,
    },
    {
      key: "created_at",
      label: "Applied Date",
      render: (row) => format(new Date(row.created_at), "PPp"),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "approved"
              ? "bg-green-100 text-green-800"
              : row.status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/candidate/profile/${row._id}`);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyInterviewLink(row);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy Interview Link</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div className="text-center py-4">Loading candidates...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Error: {error.message}
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={candidates}
      searchable={true}
      sortable={true}
    />
  );
}
