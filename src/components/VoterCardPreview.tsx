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
    <section className="space-y-6 mt-8 lg:mt-0" aria-labelledby="preview-title">
      <h2 id="preview-title" className="sr-only">
        Voter Card Preview
      </h2>

      {/* Live Preview Indicator */}
      <div className="flex items-center justify-between px-2 lg:px-0">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
          Live Preview
        </h3>
        <span className="text-xs text-slate-500">
          Updates as you type
        </span>
      </div>

      {/* Error State - Always Visible */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 font-medium text-sm">Error</p>
          <p className="text-red-600 text-xs mt-1">{error}</p>
        </div>
      )}

      {/* Canvas Container - ALWAYS in DOM */}
      <div
        className={`relative ${isGenerated ? "" : "hidden"}`}
        aria-live="polite"
        aria-label="Voter card preview"
      >
        {/* Canvas - Always rendered so ref always works */}
        <div className="bg-slate-100 p-4 rounded-2xl shadow-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-auto bg-white rounded"
            role="img"
            aria-label="Generated voter card preview showing your selected candidates and ballot positions"
          />
        </div>

        {/* Action Buttons - Only show after generation */}
        {isGenerated && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDownload}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              aria-label="Download voter card as PNG image"
            >
              <Download size={18} /> Download
            </button>
            {/* ShareButton only renders on mobile with Web Share API */}
            <ShareButton
              canvasRef={canvasRef}
              cardData={data}
            />
          </div>
        )}
      </div>

      {/* Empty State - Overlay shown before generation */}
      {!isGenerated && !isLoading && !error && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <p className="text-slate-400 text-sm">
            Fill out the form to see your voter card preview here. Updates live as you type.
          </p>
        </div>
      )}

      {/* Loading State - Overlay shown while generating */}
      {isLoading && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin text-4xl">⏳</div>
            <p className="text-slate-500 font-medium">Generating your card...</p>
            <p className="text-slate-400 text-sm">
              This should only take a moment
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
