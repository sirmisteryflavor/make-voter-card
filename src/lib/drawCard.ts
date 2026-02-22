import { VoterCardData } from "./types";
import { CANVAS_WIDTH, CANVAS_HEIGHT, POTATO_IMAGES } from "./constants";

/**
 * Loads an image with a fallback handler.
 * Returns true if loaded successfully, false otherwise.
 */
function loadImageWithFallback(
  img: HTMLImageElement,
  timeout: number = 5000
): Promise<boolean> {
  return new Promise((resolve) => {
    let loaded = false;

    const timeoutId = setTimeout(() => {
      if (!loaded) {
        resolve(false);
      }
    }, timeout);

    img.onload = () => {
      loaded = true;
      clearTimeout(timeoutId);
      resolve(true);
    };

    img.onerror = () => {
      loaded = true;
      clearTimeout(timeoutId);
      resolve(false);
    };

    // Trigger the load
    if (img.src) {
      if (img.complete) {
        loaded = true;
        clearTimeout(timeoutId);
        resolve(true);
      }
    }
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * The core drawing engine with modern, minimal ballot card design.
 * @param canvas - The HTML5 Canvas reference
 * @param data - The state containing names, titles, and votes
 * @throws Error with user-friendly message if canvas doesn't support 2D context
 */
export async function drawCard(
  canvas: HTMLCanvasElement,
  data: VoterCardData
): Promise<void> {
  try {
    const ctx = canvas.getContext("2d");

    // Check if canvas context is available
    if (!ctx) {
      throw new Error(
        "Your browser doesn't support canvas rendering. Please use a modern browser like Chrome, Firefox, Safari, or Edge."
      );
    }

    // 1. Clear and Set Dimensions
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // 2. Layout Constants
    const cardMargin = 40;
    const contentPadding = 48;
    const leftX = cardMargin + contentPadding;
    const rightX = CANVAS_WIDTH - cardMargin - contentPadding;
    const contentWidth = rightX - leftX;

    // Massive Border
    const borderWidth = 24;

    // 3. The Avant-Garde Potato Base (Off-White with Massive Deep Brown Border)
    ctx.fillStyle = "#45220A"; // potato-dark Outer border color
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = "#FDFCF0"; // potato-light inner background
    // Fill the inner canvas, leaving the border
    ctx.fillRect(borderWidth, borderWidth, CANVAS_WIDTH - borderWidth * 2, CANVAS_HEIGHT - borderWidth * 2);

    // 3.5. Draw the Tactile Starchy Dot Grid
    ctx.fillStyle = "#A68A5B"; // Subtle mustard accent
    ctx.globalAlpha = 0.3;
    const dotSpacing = 40;
    const dotRadius = 3;
    for (let x = borderWidth + dotSpacing / 2; x < CANVAS_WIDTH - borderWidth; x += dotSpacing) {
      for (let y = borderWidth + dotSpacing / 2; y < CANVAS_HEIGHT - borderWidth; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;

    // 4. Draw the Subtle Potato Background Watermark
    const potatoImg = new Image();
    potatoImg.crossOrigin = "anonymous";
    const arrayIndex = Math.max(
      0,
      Math.min(data.potatoIndex - 1, POTATO_IMAGES.length - 1)
    );
    potatoImg.src = POTATO_IMAGES[arrayIndex];

    const imageLoaded = await loadImageWithFallback(potatoImg);

    if (imageLoaded) {
      // Massive, subtle background potato
      const potatoSize = 1200;
      const potatoX = (CANVAS_WIDTH - potatoSize) / 2;
      const potatoY = (CANVAS_HEIGHT - potatoSize) / 2 + 100; // slightly lower than center

      ctx.save();
      // Subtle transparency
      ctx.globalAlpha = 0.05;

      ctx.drawImage(potatoImg, potatoX, potatoY, potatoSize, potatoSize);
      ctx.restore();
    }

    // 5. Header Area
    let currentY = borderWidth + 60;

    // Small "MY VOTER CARD" label WITH Brutalist Box
    const labelText = data.name ? `${data.name.toUpperCase()}'S VOTER CARD` : "MY VOTER CARD";
    ctx.font = "800 32px sans-serif";
    const labelMetrics = ctx.measureText(labelText);
    const labelHeight = 32;

    ctx.fillStyle = "#FFFFFF"; // Hyper Violet background
    ctx.fillRect(leftX - 8, currentY - 8, labelMetrics.width + 16, labelHeight + 16);

    // Brutalist hard shadow for label box
    ctx.fillStyle = "#45220A"; // potato-dark drop shadow
    ctx.fillRect(leftX - 8 + 4, currentY - 8 + 4, labelMetrics.width + 16, labelHeight + 16);

    // Redraw the box over the shadow
    ctx.fillStyle = "#45220A"; // Hyper Violet background
    ctx.fillRect(leftX - 8, currentY - 8, labelMetrics.width + 16, labelHeight + 16);

    ctx.fillStyle = "#FDFCF0"; // White text
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(labelText, leftX, currentY);

    currentY += 60;

    // Large Election Title WITH Sprout Highlight Box background
    ctx.font = "900 76px sans-serif";
    const title = data.electionTitle || "2024 Voter Guide";
    const titleLines = wrapText(ctx, title, contentWidth);
    const lineHeight = 86;

    for (const line of titleLines) {
      const lineMetrics = ctx.measureText(line);

      // Sprout shadow
      ctx.fillStyle = "#45220A";
      ctx.fillRect(leftX - 12 + 6, currentY - 8 + 6, lineMetrics.width + 24, 76 + 16);

      // Sprout box
      ctx.fillStyle = "#ADFF00"; // Electric Sprout
      ctx.fillRect(leftX - 12, currentY - 8, lineMetrics.width + 24, 76 + 16);

      // Black text
      ctx.fillStyle = "#45220A"; // potato-dark
      ctx.fillText(line, leftX, currentY);
      currentY += lineHeight;
    }

    currentY += 24;

    // Thick Divider line under title
    ctx.strokeStyle = "#45220A";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(leftX, currentY);
    ctx.lineTo(rightX, currentY);
    ctx.stroke();

    currentY += 60;

    // 5. Sections
    const filledRows = data.rows.filter(
      (r) => r.position.trim() && r.decision.trim()
    );
    const candidates = filledRows.filter((r) => r.type === "candidate");
    const measures = filledRows.filter((r) => r.type === "measure");

    const renderSection = (sectionLabel: string, rows: typeof filledRows) => {
      if (rows.length === 0) return;

      // Section Header ("CANDIDATES" / "PROPOSITIONS")
      ctx.fillStyle = "#8B7355"; // muted brown
      ctx.font = "800 32px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(sectionLabel, leftX, currentY);
      currentY += 56;

      // Render rows
      for (let j = 0; j < rows.length; j++) {
        const row = rows[j];

        // Position (Top line)
        ctx.fillStyle = "#8B4513"; // Custom Potato label color
        ctx.font = "700 36px sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(row.position.toUpperCase(), leftX, currentY);

        currentY += 44;

        // Candidate / Decision (Second line, left aligned, wrapping if needed)
        ctx.fillStyle = "#45220A"; // potato-dark
        ctx.font = "900 48px sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        const decisionLines = wrapText(ctx, row.decision.toUpperCase(), contentWidth);
        for (const line of decisionLines) {
          ctx.fillText(line, leftX, currentY);
          currentY += 56;
        }

        currentY += 4;

        // Note (Third line, left aligned, wrapping if needed)
        if (row.note && row.note.trim()) {
          ctx.fillStyle = "#A68A5B"; // muted accent
          ctx.font = "italic 32px sans-serif";
          ctx.textAlign = "left";

          const noteLines = wrapText(ctx, row.note.trim(), contentWidth);
          for (const line of noteLines) {
            ctx.fillText(line, leftX, currentY);
            currentY += 42;
          }
          currentY += 12;
        }

        // Subtle thin divider between rows (but not after the last row)
        if (j < rows.length - 1) {
          ctx.strokeStyle = "#E8D5B8"; // Custom Card Border
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(leftX, currentY);
          ctx.lineTo(rightX, currentY);
          ctx.stroke();
          currentY += 24;
        } else {
          currentY += 16;
        }
      }
    };

    renderSection("CANDIDATES", candidates);

    if (candidates.length > 0 && measures.length > 0) {
      currentY += 20;
    }

    renderSection("MEASURES", measures);
  } catch (error) {
    // Re-throw with context for the component to handle
    if (error instanceof Error) {
      throw new Error(`Failed to generate card: ${error.message}`);
    }
    throw new Error("Failed to generate card: An unexpected error occurred");
  }
}
