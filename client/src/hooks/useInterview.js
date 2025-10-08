import { api } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useSummarizeInterviewMutation() {
  return useMutation({
    mutationFn: api.interview.summarizeInterview,
  });
}

export function useGetQuestionsQuery({ enabled, jobId }) {
  return useQuery({
    queryKey: ["opening-questions", jobId],
    queryFn: () => api.openings.getQuestions(jobId),
    enabled,
  });
}

export function useSaveQuestionsMutation() {
  return useMutation({
    mutationFn: api.openings.saveQuestions,
  });
}
