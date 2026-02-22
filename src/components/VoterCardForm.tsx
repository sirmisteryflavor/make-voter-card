"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VoterCardData, VotingRow } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import {
  MAX_NAME_CHARS,
  MAX_TITLE_CHARS,
  MAX_ROW_TEXT_CHARS,
  MAX_NOTE_CHARS,
  MAX_TOTAL_ROWS,
} from "@/lib/constants";

interface Props {
  data: VoterCardData;
  setData: React.Dispatch<React.SetStateAction<VoterCardData>>;
  onManualGenerate: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function VoterCardForm({
  data,
  setData,
  onManualGenerate,
  isLoading,
  error,
}: Props) {
  const [errorStates, setErrorStates] = useState<Record<string, boolean>>({});

  const addRow = () => {
    if (data.rows.length >= MAX_TOTAL_ROWS) return;
    const newRow: VotingRow = {
      id: crypto.randomUUID(),
      type: "candidate",
      position: "",
      decision: "",
      note: "",
    };
    setData({ ...data, rows: [...data.rows, newRow] });
  };

  const removeRow = (id: string) => {
    setData({ ...data, rows: data.rows.filter((r) => r.id !== id) });
  };

  const updateRow = (id: string, field: keyof VotingRow, value: string) => {
    setData({
      ...data,
      rows: data.rows.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    });
  };

  const triggerErrorHighlight = (key: string, maxLen: number, value: string) => {
    if (value.length >= maxLen) {
      setErrorStates((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setErrorStates((prev) => ({ ...prev, [key]: false }));
      }, 600);
    }
  };

  return (
    <section className="flex-1 space-y-8" aria-labelledby="form-title">
      <h2 id="form-title" className="sr-only">
        Voter Card Information Form
      </h2>

      {/* Error Banner */}
      {error && (
        <div
          className="bg-zinc-50 border-2 border-red-500 p-4 rounded-xl shadow-brutal-sm sticky top-20 z-30"
          role="alert"
        >
          <p className="text-red-500 font-bold text-sm tracking-wide">{error}</p>
        </div>
      )}

      {/* Your Info */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm uppercase tracking-widest font-black text-zinc-900">
            Your Info
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border-4 border-zinc-900 shadow-brutal space-y-5">
          <Input
            label="Name"
            id="user-name"
            maxLength={MAX_NAME_CHARS}
            placeholder="Your name"
            value={data.name}
            isErrorState={errorStates["name"]}
            onChange={(e) => {
              setData({ ...data, name: e.target.value });
              triggerErrorHighlight("name", MAX_NAME_CHARS, e.target.value);
            }}
            disabled={isLoading}
          />

          <Input
            label="Election Title"
            id="election-title"
            maxLength={MAX_TITLE_CHARS}
            placeholder="e.g. 2026 New York Primary"
            value={data.electionTitle}
            isErrorState={errorStates["title"]}
            onChange={(e) => {
              setData({ ...data, electionTitle: e.target.value });
              triggerErrorHighlight("title", MAX_TITLE_CHARS, e.target.value);
            }}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Voting Decisions */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm uppercase tracking-widest font-black text-zinc-900">
            Voting Decisions
          </h3>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {data.rows.map((row) => {
              const isCandidate = row.type === "candidate";
              const positionLabel = isCandidate ? "Position" : "Measure";
              const positionPlaceholder = isCandidate ? "e.g. Mayor" : "e.g. Prop 33";
              const decisionLabel = isCandidate ? "Candidate" : "Your Vote";
              const decisionPlaceholder = isCandidate ? "e.g. Jane Smith" : "e.g. Yes / No";

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  key={row.id}
                  className="bg-white rounded-2xl border-4 border-zinc-900 shadow-brutal p-5"
                >
                  {/* Type Toggle and Delete Button */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="inline-flex bg-zinc-900 rounded-xl p-1 shadow-brutal-sm">
                      <button
                        onClick={() => updateRow(row.id, "type", "candidate")}
                        disabled={isLoading}
                        className={cn(
                          "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                          isCandidate
                            ? "bg-sprout text-zinc-900"
                            : "text-zinc-400 hover:text-white"
                        )}
                      >
                        Candidate
                      </button>
                      <button
                        onClick={() => updateRow(row.id, "type", "measure")}
                        disabled={isLoading}
                        className={cn(
                          "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                          !isCandidate
                            ? "bg-sprout text-zinc-900"
                            : "text-zinc-400 hover:text-white"
                        )}
                      >
                        Measure
                      </button>
                    </div>

                    {data.rows.length > 1 && (
                      <button
                        onClick={() => removeRow(row.id)}
                        disabled={isLoading}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-100 border-2 border-zinc-900 text-zinc-900 hover:bg-red-500 hover:text-white transition-all shadow-brutal-sm active:translate-y-[2px] active:translate-x-[2px] active:shadow-none disabled:opacity-50"
                        aria-label="Remove row"
                      >
                        <X className="h-4 w-4 stroke-[3]" />
                      </button>
                    )}
                  </div>

                  {/* Input Fields */}
                  <div className="flex flex-col gap-4">
                    <Input
                      label={positionLabel}
                      maxLength={MAX_ROW_TEXT_CHARS}
                      placeholder={positionPlaceholder}
                      value={row.position}
                      isErrorState={errorStates[`${row.id}-pos`]}
                      onChange={(e) => {
                        updateRow(row.id, "position", e.target.value);
                        triggerErrorHighlight(`${row.id}-pos`, MAX_ROW_TEXT_CHARS, e.target.value);
                      }}
                      disabled={isLoading}
                    />

                    <Input
                      label={decisionLabel}
                      maxLength={MAX_ROW_TEXT_CHARS}
                      placeholder={decisionPlaceholder}
                      value={row.decision}
                      isErrorState={errorStates[`${row.id}-dec`]}
                      onChange={(e) => {
                        updateRow(row.id, "decision", e.target.value);
                        triggerErrorHighlight(`${row.id}-dec`, MAX_ROW_TEXT_CHARS, e.target.value);
                      }}
                      disabled={isLoading}
                    />

                    <Input
                      label="Note (optional)"
                      maxLength={MAX_NOTE_CHARS}
                      placeholder={isCandidate ? "e.g. Endorsed by NYT" : "e.g. Protects renters"}
                      value={row.note}
                      isErrorState={errorStates[`${row.id}-note`]}
                      onChange={(e) => {
                        updateRow(row.id, "note", e.target.value);
                        triggerErrorHighlight(`${row.id}-note`, MAX_NOTE_CHARS, e.target.value);
                      }}
                      disabled={isLoading}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {data.rows.length < MAX_TOTAL_ROWS ? (
          <Button
            onClick={addRow}
            disabled={isLoading}
            variant="outline"
            className="w-full border-dashed"
          >
            <Plus className="h-5 w-5 mr-2 stroke-[3]" /> ADD ROW
          </Button>
        ) : (
          <div className="bg-sprout text-zinc-900 p-4 rounded-xl border-4 border-zinc-900 shadow-brutal text-center flex flex-col gap-1">
            <span className="font-black uppercase tracking-wider text-sm">
              MAXIMUM CAPACITY REACHED
            </span>
            <span className="font-bold text-xs">
              You've hit the limit for a single poster. Generate this card, then start a new one for the rest of your votes!
            </span>
          </div>
        )}
      </div>

      {/* Main Action Form Submission */}
      <div className="fixed bottom-4 left-4 right-4 z-40 sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:z-auto mt-8">
        <Button
          onClick={onManualGenerate}
          isLoading={isLoading}
          variant="primary"
          size="lg"
          className="w-full text-xl"
        >
          GENERATE CARD
        </Button>
      </div>
    </section>
  );
}
