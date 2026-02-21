"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
    rows: [{ id: "1", type: "candidate", position: "", decision: "" }],
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
   * Debounced live preview on every keystroke/change
   * Updates canvas in real-time with 300ms debounce
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      performGenerate();
    }, 300);

    return () => clearTimeout(timeout);
  }, [data, performGenerate]);

  /**
   * Manual generate button handler (for redundancy)
   */
  const handleManualGenerate = async () => {
    if (isLoading) return;
    await performGenerate();
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
      <VoterCardForm
        data={data}
        setData={setData}
        onManualGenerate={handleManualGenerate}
        isLoading={isLoading}
        error={error}
      />
      <div ref={previewSectionRef} className="scroll-mt-4">
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
