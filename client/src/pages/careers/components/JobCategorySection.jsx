import JobCard from "./JobCard";

const JobCategorySection = ({ title, jobCount, jobs, categoryKey }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
          {jobCount} {jobCount === 1 ? "job" : "jobs"}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job, index) => (
          <JobCard key={index} {...job} department={categoryKey} />
        ))}
      </div>
    </div>
  );
};

export default JobCategorySection;
