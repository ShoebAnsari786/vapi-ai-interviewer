import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import DataTable from "@/components/shared/table/DataTable";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

export default function TechnicalScreeningTable() {
  const navigate = useNavigate();
  const { data: interviews = [], isLoading } = useQuery({
    queryKey: ["interviews"],
    queryFn: api.interview.getInterviews,
  });

  const columns = [
    { key: "name", label: "Name" },
    { key: "position", label: "Position" },
    {
      key: "interview_date",
      label: "Interview Date",
      render: (row) => format(new Date(row.interview_date), "PPp"),
    },
    {
      key: "technical_score",
      label: "Technical",
      render: (row) => `${row.technical_score}/10`,
    },
    {
      key: "communication_score",
      label: "Communication",
      render: (row) => `${row.communication_score}/10`,
    },
    {
      key: "confidence_score",
      label: "Confidence",
      render: (row) => `${row.confidence_score}/10`,
    },
    {
      key: "overall_score",
      label: "Overall Score",
      render: (row) => `${row.overall_score}%`,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "completed"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/candidate/result-summary/${row.id}`);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Summary</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading interviews...</div>;
  }

  return (
    <DataTable
      columns={columns}
      data={interviews}
      searchable={true}
      sortable={true}
    />
  );
}
