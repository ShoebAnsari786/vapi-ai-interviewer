import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

const CopyLinkCard = ({ title, link, description, className = "", onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      onCopy?.(link);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <Button
          onClick={handleCopy}
          variant={copied ? "outline" : "default"}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>

      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 font-mono text-sm mb-4 break-all">
        {link}
      </div>

      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  );
};

export default CopyLinkCard;
