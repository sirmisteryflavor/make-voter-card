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

/**
 * Wraps text to fit within a maximum width, returning an array of lines.
 * Uses ctx.measureText() to determine where to break.
 */
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

    // 2. Layout Constants — Tighter Margins
    const cardMargin = 36;
    const contentPadding = 48;
    const leftX = cardMargin + contentPadding;
    const rightX = CANVAS_WIDTH - cardMargin - contentPadding;
    const contentWidth = rightX - leftX;
    const cardTop = 80;
    const cardHeight = 1700;

    // 3. White Card Background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 4. Load Potato Asset as Watermark
    const potatoImg = new Image();
    const arrayIndex = Math.max(
      0,
      Math.min(data.potatoIndex - 1, POTATO_IMAGES.length - 1)
    );
    potatoImg.src = POTATO_IMAGES[arrayIndex];

    const imageLoaded = await loadImageWithFallback(potatoImg);

    // 5. Draw Potato Watermark (semi-transparent, centered in card)
    if (imageLoaded) {
      const potatoSize = 450;
      const potatoX = leftX + contentWidth / 2 - potatoSize / 2;
      const potatoY = cardTop + cardHeight / 2 - potatoSize / 2;

      ctx.globalAlpha = 0.05;
      ctx.drawImage(potatoImg, potatoX, potatoY, potatoSize, potatoSize);
      ctx.globalAlpha = 1.0;
    }

    // 6. "MY VOTER CARD" Label
    let currentY = 140;
    ctx.fillStyle = "#A1A1AA";
    ctx.font = "600 32px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("MY VOTER CARD", leftX, currentY);
    currentY += 50;

    // 7. Election Title (with wrapping)
    ctx.fillStyle = "#18181B";
    ctx.font = "bold 64px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const titleLines = wrapText(ctx, data.electionTitle || "2024 Voter Guide", contentWidth);
    for (const line of titleLines) {
      ctx.fillText(line, leftX, currentY);
      currentY += 76;
    }
    currentY += 20;

    // 8. Divider line (thin, zinc-200)
    ctx.strokeStyle = "#E4E4E7";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftX, currentY);
    ctx.lineTo(rightX, currentY);
    ctx.stroke();
    currentY += 40;

    // 9. Get filled rows separated by type
    const filledRows = data.rows.filter(
      (r) => r.position.trim() && r.decision.trim()
    );
    const candidates = filledRows.filter((r) => r.type === "candidate");
    const measures = filledRows.filter((r) => r.type === "measure");

    // Helper function to render a section of rows
    const renderSection = (sectionLabel: string, rows: typeof filledRows) => {
      if (rows.length === 0) return;

      // Section Header
      ctx.fillStyle = "#A1A1AA";
      ctx.font = "600 32px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(sectionLabel, leftX, currentY);
      currentY += 45;

      // Render rows in this section
      for (const row of rows) {
        // Position text (left-aligned)
        ctx.fillStyle = "#71717A";
        ctx.font = "400 40px sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(row.position, leftX, currentY);

        // Decision text (right-aligned)
        ctx.fillStyle = "#18181B";
        ctx.font = "600 40px sans-serif";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText(row.decision, rightX, currentY);

        currentY += 48;

        // Divider line below row
        ctx.strokeStyle = "#E4E4E7";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(leftX, currentY);
        ctx.lineTo(rightX, currentY);
        ctx.stroke();

        currentY += 52;
      }
    };

    // 10. Render CANDIDATES section
    renderSection("CANDIDATES", candidates);

    // 11. Add spacing between sections if both exist
    if (candidates.length > 0 && measures.length > 0) {
      currentY += 20;
    }

    // 12. Render PROPOSITIONS section
    renderSection("PROPOSITIONS", measures);

    // 13. Footer Area (anchored to card bottom)
    const cardBottom = cardTop + cardHeight;
    const footerDividerY = cardBottom - 60;

    // Divider line before footer
    ctx.strokeStyle = "#E4E4E7";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftX, footerDividerY);
    ctx.lineTo(rightX, footerDividerY);
    ctx.stroke();

    // 13. Branding Footer (below card)
    ctx.fillStyle = "#D4D4D8";
    ctx.font = "400 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Made on www.potatovotes.com", CANVAS_WIDTH / 2, cardBottom + 50);
  } catch (error) {
    // Re-throw with context for the component to handle
    if (error instanceof Error) {
      throw new Error(`Failed to generate card: ${error.message}`);
    }
    throw new Error("Failed to generate card: An unexpected error occurred");
  }
}
