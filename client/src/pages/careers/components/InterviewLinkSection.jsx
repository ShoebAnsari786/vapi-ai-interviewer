import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/20/solid";

const InterviewLinkSection = ({ jobId }) => {
  const [copied, setCopied] = useState(false);
  const interviewLink = `${window.location.origin}/interview/${jobId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(interviewLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Technical Interview Link
      </h2>
      <div className="flex items-center gap-4">
        <div className="flex-1 bg-gray-50 p-3 rounded-md border border-gray-200 font-mono text-sm">
          {interviewLink}
        </div>
        <Button
          onClick={copyLink}
          variant={copied ? "outline" : "default"}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardIcon className="w-4 h-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Share this link with candidates to start the technical interview
        process.
      </p>
    </div>
  );
};

export default InterviewLinkSection;
