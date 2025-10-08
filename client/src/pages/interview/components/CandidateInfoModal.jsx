import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { jobOpenings } from "@/pages/careers/constants/jobs";

// Convert job titles to options with kebab-case values
const positionOptions = Object.values(jobOpenings)
  .flatMap((category) => category.jobs)
  .map((job) => ({
    label: job.title,
    value: job.title.toLowerCase().replace(/\s+/g, "-"),
    experience: job.experience,
    location: job.location,
  }));

export default function CandidateInfoModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!position) {
      setError("Please select a position");
      return;
    }

    // Find the original position title from the selected value
    const selectedPosition = positionOptions.find(
      (opt) => opt.value === position
    );

    onSubmit({
      name: name.trim(),
      position: selectedPosition.label, // Send original title
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Your Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Your Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="position" className="text-sm font-medium">
              Position
            </label>
            <Select
              value={position}
              onValueChange={(value) => {
                setPosition(value);
                setError("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(jobOpenings).map(([key, category]) => (
                  <div key={key}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                      {category.title}
                    </div>
                    {category.jobs.map((job) => (
                      <SelectItem
                        key={job.title}
                        value={job.title.toLowerCase().replace(/\s+/g, "-")}
                      >
                        <div>
                          <div>{job.title}</div>
                          <div className="text-xs text-gray-500">
                            {job.experience} • {job.location}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Start Interview</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
