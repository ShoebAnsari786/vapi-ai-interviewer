import { apiClient } from "../lib/api-client";

// Interview APIs
export const interviewApi = {
  summarizeInterview: async (data) => {
    return await apiClient.post("/interviews/summarize-interview", data);
  },
  getInterviews: async () => {
    return await apiClient.get("/interviews");
  },
  getInterviewById: async (id) => {
    return await apiClient.get(`/interviews/${id}`);
  },
};

// Job Openings APIs
export const openingsApi = {
  getOpenings: async () => {
    return await apiClient.get("/openings");
  },
  getOpeningById: async (id) => {
    return await apiClient.get(`/openings/${id}`);
  },
  getQuestions: async (jobId) => {
    return await apiClient.get(`/openings/${jobId}/questions`);
  },
  saveQuestions: async ({ jobId, questions }) => {
    return await apiClient.put(`/openings/${jobId}`, { questions });
  },
};

// Candidate APIs
export const candidateApi = {
  createCandidate: async (formData) => {
    return await apiClient.post("/candidates", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getCandidatesByOpening: async (openingId) => {
    return await apiClient.get(`/candidates/opening/${openingId}`);
  },
  getCandidates: async () => {
    return await apiClient.get("/candidates");
  },
  getCandidateById: async (id) => {
    return await apiClient.get(`/candidates/${id}`);
  },
};

// Export all APIs
export const api = {
  interview: interviewApi,
  openings: openingsApi,
  candidate: candidateApi,
};
