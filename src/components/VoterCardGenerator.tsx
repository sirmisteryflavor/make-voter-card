"use client";

import { useState, useRef, useCallback } from "react";
import VoterCardForm from "./VoterCardForm";
import VoterCardPreview from "./VoterCardPreview";
import { VoterCardData } from "@/lib/types";
import { drawCard } from "@/lib/drawCard";

export default function VoterCardGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewSectionRef = useRef<HTMLDivElement>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VoterCardData>({
    name: "",
    electionTitle: "",
    potatoIndex: 1,
    rows: [{ id: "1", type: "candidate", position: "", decision: "", note: "" }],
  });

  /**
   * SANITIZATION LOGIC
   * Strips leading/trailing whitespace from all strings
   * before they hit the Canvas drawing engine.
   */
  const sanitizeData = (raw: VoterCardData): VoterCardData => {
    return {
      ...raw,
      name: raw.name.trim(),
      electionTitle: raw.electionTitle.trim(),
      rows: raw.rows.map((row) => ({
        ...row,
        position: row.position.trim(),
        decision: row.decision.trim(),
        note: row.note.trim(),
      })),
    };
  };

  /**
   * Core card generation logic
   * Separated so it can be called from both manual generation and auto-update
   */
  const performGenerate = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // 1. Sanitize
      const cleanData = sanitizeData(data);

      // 2. Draw to Canvas
      await drawCard(canvasRef.current, cleanData);

      setIsGenerated(true);

      // 3. Scroll to preview on mobile
      if (window.innerWidth < 1024 && previewSectionRef.current) {
        previewSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } catch (err) {
      // Handle errors gracefully
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong generating your card. Please try again.");
      }
      setIsGenerated(false);
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  /**
   * Manual generate button handler (for redundancy)
   */
  const handleManualGenerate = async () => {
    if (isLoading) return;
    await performGenerate();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <VoterCardForm
        data={data}
        setData={setData}
        onManualGenerate={handleManualGenerate}
        isLoading={isLoading}
        error={error}
      />
      <div ref={previewSectionRef} className="lg:w-[360px] shrink-0">
        <VoterCardPreview
          canvasRef={canvasRef}
          isGenerated={isGenerated}
          data={data}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
