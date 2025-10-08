import { Routes, Route } from "react-router-dom";
import Interview from "./pages/interview";
import InterviewSuccess from "./pages/interview/containers/InterviewSuccess";
import Careers from "./pages/careers";
import JobDetails from "./pages/careers/containers/JobDetails";
import ApplyForJob from "./pages/careers/containers/ApplyForJob";
import ApplicationSuccess from "./pages/careers/containers/ApplicationSuccess";
import Admin from "./pages/admin/containers/Admin";
import ResultSummary from "./pages/candidate/containers/ResultSummary";
import CandidateProfile from "./pages/candidate/containers/CandidateProfile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Careers />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/careers/:department/:jobId" element={<JobDetails />} />
      <Route path="/careers/apply/:jobId" element={<ApplyForJob />} />
      <Route
        path="/careers/application-success"
        element={<ApplicationSuccess />}
      />
      <Route path="/tech-interview/:jobId" element={<Interview />} />
      <Route path="/interview-success" element={<InterviewSuccess />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/candidate/result-summary/:id" element={<ResultSummary />} />
      <Route path="/candidate/profile/:id" element={<CandidateProfile />} />
    </Routes>
  );
};

export default AppRoutes;
