import { useEffect, useRef } from "react";
import { assistant, vapi } from "../../../lib/vapi";
import { useState } from "react";
import { VoiceAnimation } from "@/components/animations/VoiceAnimation";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import {
  useGetQuestionsQuery,
  useSummarizeInterviewMutation,
} from "@/hooks/useInterview";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import CandidateInfoModal from "../components/CandidateInfoModal";

const NUMBER_OF_QUESTIONS_TO_ASK = 3;

export default function Interview() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const candidateName = searchParams.get("name");
  const position = searchParams.get("position");

  const [showModal, setShowModal] = useState(!candidateName || !position);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState("");
  const [hasCamera, setHasCamera] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);

  const {
    data: { questions = [] } = {},
    isLoading: isQuestionsLoading,
    refetch: refetchQuestions,
  } = useGetQuestionsQuery({
    enabled: Boolean(jobId),
    jobId,
  });

  const { mutateAsync: summarizeInterview, isPending: isSummarizingInterview } =
    useSummarizeInterviewMutation();

  const handleCandidateInfoSubmit = ({ name, position }) => {
    setSearchParams({ name, position });

    const newJobId = position.toLowerCase().replace(/\s+/g, "-");
    navigate(
      `/tech-interview/${newJobId}?name=${encodeURIComponent(
        name
      )}&position=${encodeURIComponent(position)}`,
      { replace: true }
    );

    refetchQuestions();
  };

  async function handleSummarizeInterview() {
    const payload = {
      chat_transcript: messages,
      name: candidateName,
      position,
    };

    const response = await summarizeInterview(payload);
    console.log({ payload });
  }

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
  }, [messages]);

  const endCall = async () => {
    if (vapi) {
      vapi.stop();
    }
    console.log({ messages });
    await handleSummarizeInterview();
    setMessages([]);

    navigate("/interview-success", {
      state: {
        name: candidateName,
        position: position,
      },
    });
  };

  useEffect(() => {
    let currentVideoRef = videoRef.current;
    let retryCount = 0;
    const maxRetries = 3;
    let retryTimeout;

    async function setupCamera() {
      try {
        console.log("Setting up camera...");
        if (!currentVideoRef) {
          console.log("Video ref not ready, updating ref...");
          currentVideoRef = videoRef.current;
          if (!currentVideoRef && retryCount < maxRetries) {
            retryCount++;
            console.log(
              `Retrying camera setup (${retryCount}/${maxRetries})...`
            );
            retryTimeout = setTimeout(setupCamera, 1000);
            return;
          } else if (!currentVideoRef) {
            throw new Error("Video element not found after retries");
          }
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 320,
            height: 240,
            facingMode: "user",
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise((resolve) => {
            videoRef.current.onloadedmetadata = resolve;
          });
          await videoRef.current.play();
          console.log("Camera setup successful");
          setHasCamera(true);
        } else {
          throw new Error("Video ref lost during setup");
        }
      } catch (err) {
        console.error("Camera setup error:", err);

        if (err.name === "NotAllowedError") {
          alert(
            "Camera access was denied. Please enable camera access in your browser settings and refresh the page."
          );
        } else if (err.name === "NotFoundError") {
          alert(
            "No camera found. Please connect a camera and refresh the page."
          );
        } else if (err.name === "NotReadableError") {
          alert(
            "Camera is in use by another application. Please close other apps using the camera and refresh."
          );
        } else {
          alert(`Camera error: ${err.message}. Please refresh and try again.`);
        }
        setHasCamera(false);
      }
    }

    setupCamera();

    return () => {
      clearTimeout(retryTimeout);
      if (currentVideoRef?.srcObject) {
        const tracks = currentVideoRef.srcObject.getTracks();
        tracks.forEach((track) => {
          track.stop();
          console.log("Camera track stopped:", track.label);
        });
      }
    };
  }, []);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden && isConnected) {
        alert("Please don't switch tabs during the interview!");
        endCall();
      }
    }

    function handleFullscreenChange() {
      if (!document.fullscreenElement && isConnected) {
        alert("Please remain in fullscreen mode during the interview!");
        endCall();
      }
    }

    function handleContextMenu(e) {
      if (isConnected) {
        e.preventDefault();
        return false;
      }
    }

    function handleKeyDown(e) {
      if (isConnected && (e.altKey || e.metaKey)) {
        e.preventDefault();
        alert("Please don't try to switch windows during the interview!");
        return false;
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isConnected, endCall]);

  useEffect(() => {
    vapi.on("call-start", () => {
      console.log("Call started");
      setIsConnected(true);
      setIsLoading(false);
    });
    vapi.on("call-end", () => {
      console.log("Call ended");
      // endCall();
      setIsConnected(false);
      setIsSpeaking(false);
    });
    vapi.on("speech-start", () => {
      console.log("Assistant started speaking");
      setIsSpeaking(true);
    });
    vapi.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setIsSpeaking(false);
    });
    vapi.on("message", (message) => {
      console.log("Message:", message);
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    });
    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
    });
    return () => {
      vapi?.stop();
    };
  }, []);

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  };

  const startCall = async () => {
    try {
      if (!hasCamera) {
        alert("Please enable your camera to start the interview");
        return;
      }

      setIsLoading(true);
      enterFullscreen();

      const formattedQuestions = questions
        .slice(0, NUMBER_OF_QUESTIONS_TO_ASK)
        .map((question) => `- ${question}`)
        .join("\n");

      if (vapi) {
        await vapi.start(assistant, {
          variableValues: {
            questions: formattedQuestions || "",
          },
        });
      }
    } catch (error) {
      console.error("Error starting call:", error);
      alert("Failed to start the call. Please try again.");
    } finally {
      // setIsLoading(false);
    }
  };

  if (isQuestionsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CandidateInfoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCandidateInfoSubmit}
      />

      <div className="flex flex-col gap-4 w-screen h-screen items-center justify-center">
        <div className="flex gap-4 justify-center">
          <div className="w-[320px] h-[240px] flex items-center justify-center bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg">
            <VoiceAnimation isActive={isSpeaking} size={190} />
          </div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-[320px] h-[240px] rounded-lg bg-gray-200 object-cover"
          />
        </div>

        <div className="h-[30px]">
          {messages?.length > 0 && (
            <div className="transcript-border max-w-2xl mx-auto w-full">
              <div className="transcript">
                <p
                  key={lastMessage}
                  className={clsx(
                    "transition-opacity duration-500 opacity-0",
                    "animate-fadeIn opacity-100"
                  )}
                >
                  {lastMessage}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 h-fit mx-auto">
          {!isConnected && (
            <Button
              onClick={startCall}
              disabled={!hasCamera || isLoading || isSummarizingInterview}
            >
              {!hasCamera
                ? "Enable Camera First"
                : isLoading
                ? "Starting..."
                : "Start Call"}
            </Button>
          )}
          {isConnected && (
            <Button
              variant="destructive"
              className="text-white"
              onClick={endCall}
            >
              End Call
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
