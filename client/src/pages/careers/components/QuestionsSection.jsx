import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Save, Loader2 } from "lucide-react";
import { MAX_QUESTIONS } from "../constants/questions";
import { useParams } from "react-router-dom";
import {
  useGetQuestionsQuery,
  useSaveQuestionsMutation,
} from "@/hooks/useInterview";
import toast from "react-hot-toast";

export default function QuestionsSection({ jobId }) {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const {
    data: { questions: questionsData = [] } = {},
    isLoading: isQuestionsLoading,
    refetch: refetchQuestions,
  } = useGetQuestionsQuery({
    enabled: Boolean(jobId),
    jobId,
  });

  const { mutateAsync: saveQuestions, isLoading: isSaving } =
    useSaveQuestionsMutation();

  // Update questions when questionsData changes
  useEffect(() => {
    if (questionsData?.length > 0) {
      const formattedQuestions = questionsData.map((question, index) => ({
        id: index + 1,
        question: question,
      }));
      setQuestions(formattedQuestions);
    }
  }, [questionsData]);

  const handleAdd = () => {
    if (questions.length >= MAX_QUESTIONS) {
      toast.error(`You can only add up to ${MAX_QUESTIONS} questions.`);
      return;
    }

    const newQuestion = {
      id: Date.now(),
      question: "",
    };

    setQuestions([...questions, newQuestion]);
    setEditingId(newQuestion.id);
    setEditValue("");
  };

  const handleEdit = (id, question) => {
    setEditingId(id);
    setEditValue(question);
  };

  const handleSave = (id) => {
    if (!editValue.trim()) {
      toast.error("Question cannot be empty");
      return;
    }

    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, question: editValue.trim() } : q
      )
    );
    setEditingId(null);
    setEditValue("");
  };

  const handleDelete = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditValue("");
    }
  };

  const handleSaveAll = async () => {
    const saveToastId = toast.loading("Saving questions...");
    try {
      // Convert questions back to string array for API
      const questionsToSave = questions.map((q) => q.question);

      // Save questions using mutation
      await saveQuestions({
        jobId,
        questions: questionsToSave,
      });

      // Refetch questions to confirm update
      await refetchQuestions();

      toast.success("Questions saved successfully", {
        id: saveToastId,
      });
    } catch (error) {
      console.error("Error saving questions:", error);
      toast.error("Failed to save questions. Please try again.", {
        id: saveToastId,
      });
    }
  };

  if (isQuestionsLoading) {
    return <div className="p-4 text-center">Loading questions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Interview Questions ({questions.length}/{MAX_QUESTIONS})
        </h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleAdd}
            disabled={questions.length >= MAX_QUESTIONS || isSaving}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
          <Button onClick={handleSaveAll} variant="default" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full border rounded-lg">
        <AccordionItem value="questions-list">
          <AccordionTrigger className="px-4">Questions List</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-4">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex-1">
                    {editingId === q.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder="Enter your question"
                          className="flex-1"
                          disabled={isSaving}
                        />
                        {/* <Button size="sm" onClick={() => handleSave(q.id)}>
                          Save
                        </Button> */}
                        <Button
                          size="sm"
                          onClick={() => handleSave(q.id)}
                          disabled={isSaving}
                        >
                          Save
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-500">
                          {index + 1}.
                        </span>
                        <span className="text-gray-700">{q.question}</span>
                      </div>
                    )}
                  </div>
                  {editingId !== q.id && (
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isSaving}
                        onClick={() => handleEdit(q.id, q.question)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(q.id)}
                        disabled={isSaving}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {questions.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No questions added yet. Click "Add Question" to get started.
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
