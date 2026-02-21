"use client";

import React from "react";
import { Plus, X, RefreshCw } from "lucide-react";
import { VoterCardData, VotingRow } from "@/lib/types";
import {
  POTATO_IMAGES,
  MAX_NAME_CHARS,
  MAX_TITLE_CHARS,
  MAX_ROW_TEXT_CHARS,
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
  const addRow = () => {
    if (data.rows.length >= MAX_TOTAL_ROWS) return;
    const newRow: VotingRow = {
      id: crypto.randomUUID(),
      type: "candidate",
      position: "",
      decision: "",
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

  return (
    <section className="space-y-8 pb-24 lg:pb-0" aria-labelledby="form-title">
      <h2 id="form-title" className="sr-only">
        Voter Card Information Form
      </h2>

      {/* Error Banner */}
      {error && (
        <div
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded sticky top-4 z-30"
          role="alert"
        >
          <p className="text-red-700 font-medium text-sm">{error}</p>
          <p className="text-red-600 text-xs mt-1">
            Something went wrong generating your card. Please try again.
          </p>
        </div>
      )}

      {/* Header Inputs */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="relative">
          <label
            htmlFor="user-name"
            className="block text-xs font-bold text-slate-400 uppercase mb-1"
          >
            Your Name
          </label>
          <input
            id="user-name"
            maxLength={MAX_NAME_CHARS}
            className="w-full p-3 border-b-2 border-slate-100 focus:border-yellow-500 outline-none text-xl font-semibold transition-colors disabled:opacity-50"
            placeholder="e.g. Spuddy McSpudface"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            disabled={isLoading}
          />
          <span className="absolute right-0 bottom-[-20px] text-[10px] text-slate-400">
            {data.name.length}/{MAX_NAME_CHARS}
          </span>
        </div>

        <div className="relative pt-2">
          <label
            htmlFor="election-title"
            className="block text-xs font-bold text-slate-400 uppercase mb-1"
          >
            Election Title
          </label>
          <input
            id="election-title"
            maxLength={MAX_TITLE_CHARS}
            className="w-full p-3 border-b-2 border-slate-100 focus:border-yellow-500 outline-none transition-colors disabled:opacity-50"
            placeholder="e.g. 2024 Presidential Election"
            value={data.electionTitle}
            onChange={(e) => setData({ ...data, electionTitle: e.target.value })}
            disabled={isLoading}
          />
          <span className="absolute right-0 bottom-[-20px] text-[10px] text-slate-400">
            {data.electionTitle.length}/{MAX_TITLE_CHARS}
          </span>
        </div>
      </div>

      {/* Voting Rows */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Your Ballot Picks
          </h3>
          <button
            type="button"
            onClick={randomizePotato}
            className="text-xs flex items-center gap-1 text-slate-500 hover:text-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Change random potato image"
            disabled={isLoading}
          >
            <RefreshCw size={12} /> Swap Potato
          </button>
        </div>

        <div className="space-y-4">
          {data.rows.map((row, index) => (
            <div
              key={row.id}
              className="group relative bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-1">
                  <label
                    htmlFor={`pos-${row.id}`}
                    className="sr-only"
                  >
                    Position or Office for row {index + 1}
                  </label>
                  <input
                    id={`pos-${row.id}`}
                    maxLength={MAX_ROW_TEXT_CHARS}
                    className="w-full bg-transparent border-b border-transparent focus:border-slate-200 outline-none text-sm transition-colors disabled:opacity-50"
                    placeholder="Position/Office"
                    value={row.position}
                    onChange={(e) =>
                      updateRow(row.id, "position", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  <div className="text-[9px] text-slate-300 text-right">
                    {row.position.length}/{MAX_ROW_TEXT_CHARS}
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <label
                    htmlFor={`dec-${row.id}`}
                    className="sr-only"
                  >
                    Your pick for row {index + 1}
                  </label>
                  <input
                    id={`dec-${row.id}`}
                    maxLength={MAX_ROW_TEXT_CHARS}
                    className="w-full bg-transparent border-b border-transparent focus:border-slate-200 outline-none text-sm font-bold transition-colors disabled:opacity-50"
                    placeholder="Your Choice"
                    value={row.decision}
                    onChange={(e) =>
                      updateRow(row.id, "decision", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  <div className="text-[9px] text-slate-300 text-right">
                    {row.decision.length}/{MAX_ROW_TEXT_CHARS}
                  </div>
                </div>

                {data.rows.length > 1 && (
                  <button
                    onClick={() => removeRow(row.id)}
                    className="self-center p-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Remove row ${index + 1}`}
                    disabled={isLoading}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {data.rows.length < MAX_TOTAL_ROWS ? (
          <button
            onClick={addRow}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            aria-label={`Add a new candidate or measure. Current count: ${data.rows.length} of ${MAX_TOTAL_ROWS}`}
          >
            <Plus size={18} /> Add Candidate or Measure ({data.rows.length}/
            {MAX_TOTAL_ROWS})
          </button>
        ) : (
          <p className="text-center text-xs text-amber-600 font-medium py-2">
            Max limit of {MAX_TOTAL_ROWS} rows reached.
          </p>
        )}
      </div>

      {/* Mobile sticky button */}
      <button
        onClick={onManualGenerate}
        disabled={isLoading}
        className="lg:hidden sticky bottom-4 left-4 right-4 z-40 bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 disabled:cursor-not-allowed text-yellow-950 font-black py-4 px-6 rounded-2xl shadow-2xl transition-all active:scale-[0.98] disabled:active:scale-100 flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden"
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin">⏳</span>
            <span className="hidden sm:inline">GENERATING...</span>
            <span className="sm:hidden">GEN...</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">GENERATE</span>
            <span className="sm:hidden">GEN</span>
          </>
        )}
      </button>

      {/* Desktop button - only visible on lg+ */}
      <button
        onClick={onManualGenerate}
        disabled={isLoading}
        className="hidden lg:flex w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 disabled:cursor-not-allowed text-yellow-950 font-black py-5 px-6 rounded-2xl shadow-lg shadow-yellow-100 transition-all active:scale-[0.98] disabled:active:scale-100 items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin">⏳</span>
            GENERATING...
          </>
        ) : (
          "GENERATE MY VOTER CARD"
        )}
      </button>
    </section>
  );
}
