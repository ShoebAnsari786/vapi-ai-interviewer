import { useState } from "react";
import JobCategorySection from "../components/JobCategorySection";
import { jobOpenings } from "../constants/jobs";

const Careers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Filter jobs based on search and filters
  const filteredJobs = Object.entries(jobOpenings).reduce(
    (acc, [key, category]) => {
      const filteredCategory = {
        ...category,
        jobs: category.jobs.filter((job) => {
          const matchesSearch =
            !searchQuery ||
            job.title.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesDepartment =
            !selectedDepartment || key === selectedDepartment;
          const matchesLocation =
            !selectedLocation ||
            job.location.toLowerCase() === selectedLocation.toLowerCase();
          return matchesSearch && matchesDepartment && matchesLocation;
        }),
      };
      if (filteredCategory.jobs.length > 0) {
        acc[key] = filteredCategory;
      }
      return acc;
    },
    {}
  );

  // Get unique departments and locations for filters
  const departments = Object.keys(jobOpenings);
  const locations = [
    ...new Set(
      Object.values(jobOpenings)
        .flatMap((category) => category.jobs)
        .map((job) => job.location)
    ),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full px-4 py-2 border rounded-lg pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border rounded-lg bg-white"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg bg-white"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Job Categories */}
      {Object.entries(filteredJobs).map(([key, category]) => (
        <JobCategorySection
          key={key}
          categoryKey={key}
          title={category.title}
          jobCount={category.jobs.length}
          jobs={category.jobs}
        />
      ))}

      {/* No results message */}
      {Object.keys(filteredJobs).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No jobs found matching your criteria
        </div>
      )}
    </div>
  );
};

export default Careers;
