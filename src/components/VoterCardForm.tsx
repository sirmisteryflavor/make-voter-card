"use client";

import React, { useRef } from "react";
import { Plus, X, RefreshCw, Loader2 } from "lucide-react";
import { VoterCardData, VotingRow } from "@/lib/types";
import {
  POTATO_IMAGES,
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
  const nameInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const rowInputRefs = useRef<{ [key: string]: { position: HTMLInputElement | null; decision: HTMLInputElement | null } }>({});

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

  const randomizePotato = () => {
    const newIndex = Math.floor(Math.random() * POTATO_IMAGES.length) + 1;
    setData({ ...data, potatoIndex: newIndex });
  };

  const handleMaxLength = (inputRef: React.RefObject<HTMLInputElement>, maxLen: number) => {
    if (inputRef.current && inputRef.current.value.length >= maxLen) {
      inputRef.current.classList.add('ring-2', 'ring-red-300');
      setTimeout(() => {
        inputRef.current?.classList.remove('ring-2', 'ring-red-300');
      }, 600);
    }
  };

  const handleRowMaxLength = (ref: HTMLInputElement | null, maxLen: number) => {
    if (ref && ref.value.length >= maxLen) {
      ref.classList.add('ring-2', 'ring-red-300');
      setTimeout(() => {
        ref.classList.remove('ring-2', 'ring-red-300');
      }, 600);
    }
  };

  return (
    <section className="flex-1 space-y-6" aria-labelledby="form-title">
      <h2 id="form-title" className="sr-only">
        Voter Card Information Form
      </h2>

      {/* Error Banner */}
      {error && (
        <div
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded sticky top-20 z-30"
          role="alert"
        >
          <p className="text-red-700 font-medium text-sm">{error}</p>
          <p className="text-red-600 text-xs mt-1">
            Something went wrong generating your card. Please try again.
          </p>
        </div>
      )}

      {/* Your Info */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 space-y-5">
        <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500">
          Your Info
        </h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="user-name" className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5 block">
              Name
            </label>
            <input
              ref={nameInputRef}
              id="user-name"
              maxLength={MAX_NAME_CHARS}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-3 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-base transition-colors placeholder:text-zinc-400"
              placeholder="Your name"
              value={data.name}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
                handleMaxLength(nameInputRef, MAX_NAME_CHARS);
              }}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="election-title" className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5 block">
              Election Title
            </label>
            <input
              ref={titleInputRef}
              id="election-title"
              maxLength={MAX_TITLE_CHARS}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-3 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-base transition-colors placeholder:text-zinc-400"
              placeholder="e.g. 2026 New York Primary"
              value={data.electionTitle}
              onChange={(e) => {
                setData({ ...data, electionTitle: e.target.value });
                handleMaxLength(titleInputRef, MAX_TITLE_CHARS);
              }}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Voting Decisions */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500">
            Voting Decisions
          </h3>
        </div>

        <div className="space-y-3">
          {data.rows.map((row) => {
            const isCandidate = row.type === "candidate";
            const positionLabel = isCandidate ? "Position" : "Proposition";
            const positionPlaceholder = isCandidate ? "e.g. Mayor, Governor, Senator" : "e.g. Prop 33 - Rent Control";
            const decisionLabel = isCandidate ? "Candidate" : "Your Vote";
            const decisionPlaceholder = isCandidate ? "e.g. Jane Smith" : "e.g. Yes, No, For, Against";

            return (
              <div
                key={row.id}
                className="bg-white rounded-xl border border-zinc-200 p-4"
              >
                {/* Type Toggle and Delete Button */}
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex bg-zinc-100 rounded-lg p-0.5">
                    <button
                      onClick={() => updateRow(row.id, "type", "candidate")}
                      disabled={isLoading}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        isCandidate
                          ? "text-violet-700 bg-white shadow-sm"
                          : "text-zinc-500 hover:text-zinc-600"
                      }`}
                    >
                      Candidate
                    </button>
                    <button
                      onClick={() => updateRow(row.id, "type", "measure")}
                      disabled={isLoading}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        !isCandidate
                          ? "text-violet-700 bg-white shadow-sm"
                          : "text-zinc-500 hover:text-zinc-600"
                      }`}
                    >
                      Proposition
                    </button>
                  </div>

                  {data.rows.length > 1 && (
                    <button
                      onClick={() => removeRow(row.id)}
                      disabled={isLoading}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Remove row`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Input Fields */}
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1 block">
                      {positionLabel}
                    </label>
                    <input
                      ref={(el) => {
                        if (!rowInputRefs.current[row.id]) {
                          rowInputRefs.current[row.id] = { position: null, decision: null };
                        }
                        if (el) rowInputRefs.current[row.id].position = el;
                      }}
                      maxLength={MAX_ROW_TEXT_CHARS}
                      placeholder={positionPlaceholder}
                      value={row.position}
                      onChange={(e) => {
                        updateRow(row.id, "position", e.target.value);
                        if (rowInputRefs.current[row.id]?.position) {
                          handleRowMaxLength(rowInputRefs.current[row.id].position, MAX_ROW_TEXT_CHARS);
                        }
                      }}
                      disabled={isLoading}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors placeholder:text-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1 block">
                      {decisionLabel}
                    </label>
                    <input
                      ref={(el) => {
                        if (!rowInputRefs.current[row.id]) {
                          rowInputRefs.current[row.id] = { position: null, decision: null };
                        }
                        if (el) rowInputRefs.current[row.id].decision = el;
                      }}
                      maxLength={MAX_ROW_TEXT_CHARS}
                      placeholder={decisionPlaceholder}
                      value={row.decision}
                      onChange={(e) => {
                        updateRow(row.id, "decision", e.target.value);
                        if (rowInputRefs.current[row.id]?.decision) {
                          handleRowMaxLength(rowInputRefs.current[row.id].decision, MAX_ROW_TEXT_CHARS);
                        }
                      }}
                      disabled={isLoading}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors placeholder:text-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1 block">
                      Note (optional)
                    </label>
                    <input
                      maxLength={MAX_NOTE_CHARS}
                      placeholder={isCandidate ? "e.g. Endorsed by NYT" : "e.g. Protects renters"}
                      value={row.note}
                      onChange={(e) => {
                        updateRow(row.id, "note", e.target.value);
                        const noteInput = (e.target as HTMLInputElement);
                        handleRowMaxLength(noteInput, MAX_NOTE_CHARS);
                      }}
                      disabled={isLoading}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors placeholder:text-zinc-400"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {data.rows.length < MAX_TOTAL_ROWS ? (
          <button
            onClick={addRow}
            disabled={isLoading}
            className="w-full py-3 border border-dashed border-zinc-300 rounded-xl text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Row
          </button>
        ) : (
          <p className="text-center text-xs text-zinc-500 py-3">
            Max limit of {MAX_TOTAL_ROWS} rows reached.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="fixed bottom-4 left-4 right-4 z-40 sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:z-auto">
        <button
          onClick={onManualGenerate}
          disabled={isLoading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            "Generate Card"
          )}
        </button>
      </div>

      {/* Swap Potato Button */}
      <div className="flex justify-center pb-4 sm:pb-0">
        <button
          onClick={randomizePotato}
          disabled={isLoading}
          className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-medium px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Change random potato image"
          title="Swap Potato"
        >
          <RefreshCw className="h-3.5 w-3.5 inline mr-1" />
          Swap Potato
        </button>
      </div>
    </section>
  );
}
