/**
 * Validation & UI Constraints
 */
export const MAX_NAME_CHARS = 50;
export const MAX_TITLE_CHARS = 80;
export const MAX_ROW_TEXT_CHARS = 60; // Max for both Position and Decision
export const MAX_TOTAL_ROWS = 10;

export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1920;

/**
 * Potato image paths - explicit array for easy maintenance.
 * Add or remove images here; no need to update count elsewhere.
 */
export const POTATO_IMAGES = [
  "/images/potatoes/potato-1.png",
  "/images/potatoes/potato-2.png",
  "/images/potatoes/potato-3.png",
  "/images/potatoes/potato-4.png",
] as const;

export const APP_NAME = "PotatoVotes";
export const APP_DESCRIPTION = "Generate and share your voting guide with a potato twist.";
