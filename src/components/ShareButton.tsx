"use client";

import React, { useState, useEffect } from "react";
import { Share2 } from "lucide-react";
import { VoterCardData } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cardData: VoterCardData;
}

export default function ShareButton({ canvasRef, cardData }: Props) {
  const [isShareAvailable, setIsShareAvailable] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Check if Web Share API is available on mount
  useEffect(() => {
    setIsShareAvailable(!!navigator.share);
  }, []);

  // Only render if Web Share API is available (mobile browsers)
  if (!isShareAvailable) {
    return null;
  }

  const handleShare = async () => {
    if (!canvasRef.current) return;

    try {
      setIsSharing(true);

      // Convert canvas to blob directly using toBlob API
      const blob = await new Promise<Blob | null>((resolve) => {
        canvasRef.current?.toBlob((b) => resolve(b), "image/png");
      });

      if (!blob) {
        console.error("Failed to convert canvas to blob");
        return;
      }

      // Create a File object for sharing
      const file = new File([blob], "PotatoVotes-Ballot.png", {
        type: "image/png",
      });

      // Use Web Share API
      await navigator.share({
        title: "My PotatoVotes Card",
        text: `Check out my voter picks! ${cardData.electionTitle || "2024 Voter Guide"
          }`,
        files: [file],
      });
    } catch (err) {
      // User cancelled share or an error occurred
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Share failed:", err);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={isSharing}
      isLoading={isSharing}
      variant="secondary"
      className="w-full text-sm"
      aria-label="Share voter card on social media or messaging app"
    >
      <Share2 className="h-4 w-4 mr-2 stroke-[3]" />
      SHARE
    </Button>
  );
}
