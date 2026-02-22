"use client";

import React from "react";
import { Download } from "lucide-react";
import { VoterCardData } from "@/lib/types";
import ShareButton from "./ShareButton";

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isGenerated: boolean;
  data: VoterCardData;
  isLoading: boolean;
  error: string | null;
}

export default function VoterCardPreview({
  canvasRef,
  isGenerated,
  data,
  isLoading,
  error,
}: Props) {
  const handleDownload = () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.href = canvasRef.current.toDataURL("image/png");
    link.download = `PotatoVotes-${data.name || "Ballot"}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="space-y-4" aria-labelledby="preview-title">
      <h2 id="preview-title" className="sr-only">
        Voter Card Preview
      </h2>

      {/* Sticky Preview Container */}
      <div className="sticky top-24 lg:top-8">
        <h3 className="text-xs uppercase tracking-wider text-[#8B7355] mb-3 text-center font-semibold">
          Preview
        </h3>

        {/* Canvas Container - ALWAYS in DOM */}
        <div
          className={`relative ${isGenerated ? "" : "hidden"}`}
          aria-live="polite"
          aria-label="Voter card preview"
        >
          {/* Canvas - Always rendered so ref always works */}
          <div className="bg-[#F5EDE0] p-3 rounded-xl border border-[#E8D5B8] aspect-[9/16] flex items-center justify-center overflow-hidden shadow-sm">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
              role="img"
              aria-label="Generated voter card preview showing your selected candidates and ballot positions"
            />
          </div>

          {/* Action Buttons - Only show after generation */}
          {isGenerated && (
            <div className="flex flex-col gap-2 mt-3">
              <button
                onClick={handleDownload}
                className="w-full bg-[#3D2E16] hover:bg-[#2A1F10] text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                aria-label="Download voter card as PNG image"
              >
                <Download className="h-4 w-4" /> Download
              </button>
              <ShareButton
                canvasRef={canvasRef}
                cardData={data}
              />
            </div>
          )}
        </div>

        {/* Empty State - Shown before generation */}
        {!isGenerated && !isLoading && !error && (
          <div className="bg-[#FFFCF5] p-6 rounded-xl border border-[#E8D5B8] text-center aspect-[9/16] flex flex-col items-center justify-center shadow-sm">
            <span className="text-4xl mb-3">🥔</span>
            <p className="text-sm text-[#8B7355]">
              Fill in the form and click<br />
              Generate to preview
            </p>
          </div>
        )}

        {/* Loading State - Shown while generating */}
        {isLoading && (
          <div className="bg-[#FFFCF5] p-6 rounded-xl border border-[#E8D5B8] text-center aspect-[9/16] flex flex-col items-center justify-center shadow-sm">
            <div className="animate-spin text-4xl mb-3">⏳</div>
            <p className="text-sm text-[#8B7355] font-medium">
              Generating your card...
            </p>
            <p className="text-xs text-[#A68A5B] mt-1">
              This should only take a moment
            </p>
          </div>
        )}

        {/* Size info */}
        <p className="text-xs text-center text-[#8B7355] mt-2">
          1080 × 1920px • 9:16 ratio
        </p>
      </div>
    </section>
  );
}
