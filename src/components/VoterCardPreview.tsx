"use client";

import React from "react";
import { Download, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VoterCardData } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import ShareButton from "./ShareButton";

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isGenerated: boolean;
  data: VoterCardData;
  isLoading: boolean;
  error: string | null;
  randomizePotato: () => void;
}

export default function VoterCardPreview({
  canvasRef,
  isGenerated,
  data,
  isLoading,
  error,
  randomizePotato,
}: Props) {
  const handleDownload = async () => {
    if (!canvasRef.current) return;

    try {
      // Convert canvas to blob directly (PNG format for lossless quality)
      const blob = await new Promise<Blob | null>((resolve) => {
        canvasRef.current?.toBlob((b) => resolve(b), "image/png");
      });

      if (!blob) {
        console.error("Failed to convert canvas to blob");
        return;
      }

      const safeName = (data.name || "Ballot").replace(/[^a-zA-Z0-9]/g, "-");
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `PotatoVotes-${safeName}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup memory
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Failed to download card", e);
    }
  };

  return (
    <section className="space-y-4" aria-labelledby="preview-title">
      <h2 id="preview-title" className="sr-only">
        Voter Card Preview
      </h2>

      {/* Sticky Preview Container */}
      <div className="sticky top-24 lg:top-8">
        <h3 className="text-sm uppercase tracking-widest text-zinc-900 mb-4 text-center font-black">
          Live Preview
        </h3>

        {/* Canvas Container - ALWAYS in DOM */}
        <div
          className={`relative ${isGenerated ? "" : "hidden"}`}
          aria-live="polite"
          aria-label="Voter card preview"
        >
          {/* Canvas - Always rendered so ref always works */}
          <div className="bg-zinc-50 p-4 rounded-2xl border-4 border-zinc-900 shadow-brutal aspect-[9/16] flex items-center justify-center overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain rounded-lg border-2 border-zinc-900"
              role="img"
              aria-label="Generated voter card preview showing your selected candidates and ballot positions"
            />
          </div>

          {/* Action Buttons - Only show after generation */}
          <AnimatePresence>
            {isGenerated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 mt-5"
              >
                <Button
                  onClick={randomizePotato}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full border-dashed"
                  aria-label="Change random potato image"
                  title="Swap Potato"
                >
                  <RefreshCw className="h-5 w-5 mr-2 stroke-[3]" />
                  SWAP POTATO
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleDownload}
                    variant="primary"
                    className="w-full text-sm"
                    aria-label="Download voter card as PNG image"
                  >
                    <Download className="h-4 w-4 mr-2 stroke-[3]" /> DOWNLOAD
                  </Button>
                  <ShareButton
                    canvasRef={canvasRef}
                    cardData={data}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Empty State - Shown before generation */}
        {!isGenerated && !isLoading && !error && (
          <div className="bg-zinc-50 p-6 rounded-2xl border-4 border-zinc-900 border-dashed text-center aspect-[9/16] flex flex-col items-center justify-center shadow-brutal">
            <span className="text-6xl mb-4 grayscale opacity-50">🥔</span>
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
              Fill in the form<br />
              and generate<br />
              to preview
            </p>
          </div>
        )}

        {/* Loading State - Shown while generating */}
        {isLoading && (
          <div className="bg-zinc-50 p-6 rounded-2xl border-4 border-zinc-900 text-center aspect-[9/16] flex flex-col items-center justify-center shadow-brutal">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-sm font-black text-zinc-900 uppercase tracking-widest">
              GENERATING ART...
            </p>
            <p className="text-xs text-zinc-500 mt-2 font-bold tracking-wide">
              Please wait
            </p>
          </div>
        )}

        {/* Size info */}
        <p className="text-xs font-bold text-center text-zinc-500 mt-4 tracking-widest uppercase">
          1080 × 1920PX • 9:16 RATIO
        </p>
      </div>
    </section>
  );
}
