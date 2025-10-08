import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useCandidate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitApplication = async (position, resumeFile) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("position", position);
      formData.append("Upload_your_CV", resumeFile);

      const response = await fetch(
        "https://shivamraj01.app.n8n.cloud/webhook/8118bfe9-5515-4232-ae49-7e9fcf8979ae",
        {
          method: "POST",
          body: formData,
          headers: {
            accept: "/",
            "accept-language": "en-US,en;q=0.9",
            origin: window.location.origin,
            priority: "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitApplication,
    isLoading,
    error,
  };
};

export function useGetCandidatesQuery() {
  return useQuery({
    queryKey: ["candidates"],
    queryFn: api.candidate.getCandidates,
  });
}

export function useGetCandidateByIdQuery(id) {
  return useQuery({
    queryKey: ["candidate", id],
    queryFn: () => api.candidate.getCandidateById(id),
    enabled: !!id,
  });
}
