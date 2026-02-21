/**
 * Shared types for the application. 
 * Defining these in a central file prevents circular dependencies.
 */

export type VotingRowType = "candidate" | "measure";

export interface VotingRow {
  id: string;
  type: VotingRowType;
  position: string;
  decision: string;
}

export interface VoterCardData {
  name: string;
  electionTitle: string;
  potatoIndex: number;
  rows: VotingRow[];
}
